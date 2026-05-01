package com.xpensify.ai.capture

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import org.json.JSONObject
import java.util.Locale
import java.util.regex.Pattern

class PaymentNotificationListenerService : NotificationListenerService() {
  override fun onListenerConnected() {
    super.onListenerConnected()
    Log.d(TAG, "Notification listener connected")
  }

  override fun onNotificationPosted(sbn: StatusBarNotification?) {
    if (sbn == null) {
      return
    }

    val extras = sbn.notification.extras ?: return
    val payload = extractNotificationPayload(extras)
    if (payload.body.isBlank()) {
      return
    }

    Log.d(TAG, "Notification received from ${sbn.packageName}: ${payload.body}")

    val parsed = parsePaymentNotification(
      packageName = sbn.packageName.orEmpty(),
      title = payload.title,
      body = payload.body,
    ) ?: return

    if (ExpenseCaptureStore.shouldSuppressDuplicate(applicationContext, parsed.optString("signature"))) {
      Log.d(TAG, "Notification suppressed as duplicate")
      return
    }

    Log.d(TAG, "Payment notification parsed: ${parsed.optDouble("amount")} ${parsed.optString("merchant")}")
    ExpenseOverlayManager.show(applicationContext, parsed)
  }

  private fun parsePaymentNotification(
    packageName: String,
    title: String,
    body: String,
  ): JSONObject? {
    val searchText = listOf(title, body).filter { it.isNotBlank() }.joinToString(" | ")
    val normalized = searchText.lowercase(Locale.ENGLISH)
    val amount = extractAmount(searchText)
    val fromKnownPaymentSource = KNOWN_PAYMENT_PACKAGES.any { packageName.contains(it) }
    val looksLikePayment = PAYMENT_KEYWORDS.any { normalized.contains(it) }
    val looksLikeNonSpend = REFUND_KEYWORDS.any { normalized.contains(it) }

    if (looksLikeNonSpend) {
      if (shouldLogIgnoredNotification(packageName, normalized, amount)) {
        Log.d(TAG, "Ignored notification as non-spend: $searchText")
      }
      return null
    }

    if (!looksLikePayment && !(fromKnownPaymentSource && amount != null)) {
      if (shouldLogIgnoredNotification(packageName, normalized, amount)) {
        Log.d(TAG, "Ignored notification: missing payment signal for $searchText")
      }
      return null
    }

    if (amount == null) {
      if (shouldLogIgnoredNotification(packageName, normalized, null)) {
        Log.d(TAG, "Ignored notification: amount not found in $searchText")
      }
      return null
    }

    val merchant = extractMerchant(title, body, packageName)

    return JSONObject().apply {
      put("amount", amount)
      put("merchant", merchant)
      put("body", searchText)
      put("signature", "$packageName:${amount}:${merchant.lowercase(Locale.ENGLISH)}:${searchText.take(48)}")
    }
  }

  private fun extractAmount(body: String): Double? {
    for (pattern in AMOUNT_PATTERNS) {
      val match = pattern.matcher(body)
      if (match.find()) {
        val value = match.group(1)?.replace(",", "")?.toDoubleOrNull()
        if (value != null && value > 0) {
          return value
        }
      }
    }
    return null
  }

  private fun extractMerchant(title: String, body: String, packageName: String): String {
    val searchText = listOf(title, body).filter { it.isNotBlank() }.joinToString(" | ")
    val candidates = listOf(
      Regex("""\bto\s+([A-Za-z][A-Za-z .&'()-]{1,60}?)(?=\.?\s*(?:ref|utr|not you|call|sms)\b|$)""", RegexOption.IGNORE_CASE),
      Regex("""\b(?:paid to|sent to|transferred to|merchant)\s+([A-Za-z][A-Za-z0-9@._&'() -]{1,60}?)(?=\.?\s*(?:ref|utr|not you|call|sms)\b|$)""", RegexOption.IGNORE_CASE),
      Regex("""\b(?:spent at|purchase at|debited for)\s+([A-Za-z][A-Za-z0-9@._&'() -]{1,60}?)(?=\.?\s*(?:ref|utr|not you|call|sms)\b|$)""", RegexOption.IGNORE_CASE),
      Regex("""(?:vpa|upi id)[:\s]+([A-Za-z0-9._@-]{3,50})""", RegexOption.IGNORE_CASE),
      Regex("""(?:for)\s+([A-Za-z0-9@._&()' -]{2,50})\s+(?:using|via|through)""", RegexOption.IGNORE_CASE),
    )

    for (regex in candidates) {
      val value = regex.find(searchText)?.groupValues?.getOrNull(1)?.trim()
      if (!value.isNullOrBlank() && isLikelyMerchant(value)) {
        return cleanupMerchant(value)
      }
    }

    val normalizedTitle = title.trim()
    if (normalizedTitle.isNotBlank() && normalizedTitle.lowercase(Locale.ENGLISH) !in GENERIC_NOTIFICATION_TITLES) {
      return cleanupMerchant(normalizedTitle)
    }

    return when {
      packageName.contains("phonepe") -> "PhonePe payment"
      packageName.contains("paytm") -> "Paytm payment"
      packageName.contains("google") || packageName.contains("gms") -> "Google Pay payment"
      else -> "Auto-captured UPI payment"
    }
  }

  private fun cleanupMerchant(value: String): String {
    return value
      .replace(Regex("""\b(?:via|using|through|on|ref|utr|txn|transaction)\b.*$""", RegexOption.IGNORE_CASE), "")
      .replace(Regex("""\b(?:not you|call|sms)\b.*$""", RegexOption.IGNORE_CASE), "")
      .replace("|", " ")
      .trim()
      .trimEnd('.', ',', ':', ';', '-')
      .ifBlank { "Auto-captured UPI payment" }
  }

  private fun isLikelyMerchant(value: String): Boolean {
    val cleaned = value.trim()
    if (cleaned.length < 2) {
      return false
    }

    if (cleaned.matches(Regex("""[0-9: .-]+"""))) {
      return false
    }

    return cleaned.any { it.isLetter() }
  }

  private fun shouldLogIgnoredNotification(
    packageName: String,
    normalized: String,
    amount: Double?,
  ): Boolean {
    return amount != null ||
      PAYMENT_KEYWORDS.any { normalized.contains(it) } ||
      KNOWN_PAYMENT_PACKAGES.any { packageName.contains(it) }
  }

  private fun extractNotificationPayload(extras: Bundle): NotificationPayload {
    val values = linkedSetOf<String>()
    val title = extras.getCharSequence("android.title")?.toString().orEmpty()

    fun addValue(raw: CharSequence?) {
      val text = raw?.toString()?.replace('\n', ' ')?.trim().orEmpty()
      if (text.isNotBlank()) {
        values.add(text)
      }
    }

    addValue(title)
    addValue(extras.getCharSequence("android.title.big"))
    addValue(extras.getCharSequence("android.text"))
    addValue(extras.getCharSequence("android.bigText"))
    addValue(extras.getCharSequence("android.subText"))
    addValue(extras.getCharSequence("android.summaryText"))
    addValue(extras.getCharSequence("android.infoText"))
    addValue(extras.getCharSequence("android.conversationTitle"))

    extras.getCharSequenceArray("android.textLines")?.forEach(::addValue)

    return NotificationPayload(
      title = title,
      body = values.joinToString(" | "),
    )
  }

  companion object {
    private const val TAG = "SmsExpenseCapture"

    private val PAYMENT_KEYWORDS = listOf(
      "debited",
      "paid",
      "payment",
      "sent",
      "spent",
      "purchase",
      "upi",
      "transaction",
      "transferred",
      "successful",
      "withdrawn",
    )

    private val REFUND_KEYWORDS = listOf(
      "credited",
      "received",
      "refund",
      "reversal",
      "cashback",
      "reward",
      "collect request",
      "money request",
      "request money",
      "failed",
      "pending",
      "declined",
    )

    private val KNOWN_PAYMENT_PACKAGES = listOf(
      "com.phonepe.app",
      "com.google.android.apps.nbu.paisa.user",
      "com.google.android.gms",
      "net.one97.paytm",
      "in.org.npci.upiapp",
      "com.amazon.mshop.android.shopping",
      "com.sbi.upi",
    )

    private val GENERIC_NOTIFICATION_TITLES = setOf(
      "upi",
      "payment",
      "transaction",
      "phonepe",
      "google pay",
      "gpay",
      "paytm",
    )

    private val AMOUNT_PATTERNS = listOf(
      Pattern.compile("""(?:rs\.?|inr|₹)\s*([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)""", Pattern.CASE_INSENSITIVE),
      Pattern.compile("""([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)\s*(?:rs\.?|inr|₹)""", Pattern.CASE_INSENSITIVE),
      Pattern.compile("""(?:amount|amt)[:\s]*([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)""", Pattern.CASE_INSENSITIVE),
    )

    fun hasNotificationAccess(context: Context): Boolean {
      val enabled = Settings.Secure.getString(context.contentResolver, "enabled_notification_listeners").orEmpty()
      val component = ComponentName(context, PaymentNotificationListenerService::class.java).flattenToString()
      return enabled.contains(component)
    }

    fun openNotificationSettings(context: Context) {
      val intent = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
        Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS")
      } else {
        Intent(Settings.ACTION_SETTINGS)
      }.apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      context.startActivity(intent)
    }
  }

  private data class NotificationPayload(
    val title: String,
    val body: String,
  )
}
