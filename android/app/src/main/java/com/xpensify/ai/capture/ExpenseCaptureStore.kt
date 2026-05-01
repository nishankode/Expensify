package com.xpensify.ai.capture

import android.content.Context
import android.util.Log
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID

object ExpenseCaptureStore {
  private const val TAG = "SmsExpenseCapture"
  private const val PREFS_NAME = "xpensify_capture_store"
  private const val LEGACY_PREFS_NAME = "sms_expense_capture"
  private const val KEY_CONFIG = "config_json"
  private const val KEY_PENDING = "pending_transactions"
  private const val KEY_LAST_SIGNATURE = "last_signature"
  private const val KEY_LAST_SIGNATURE_AT = "last_signature_at"
  private const val DUPLICATE_WINDOW_MS = 15_000L

  fun saveConfiguration(context: Context, configJson: String) {
    val config = runCatching { JSONObject(configJson) }.getOrNull()
    prefs(context).edit().putString(KEY_CONFIG, configJson).apply()
    if (config != null) {
      legacyPrefs(context).edit()
        .putString("user_id", config.optString("userId"))
        .putString("categories", config.optJSONArray("categories")?.toString() ?: "[]")
        .apply()
    }
    Log.d(TAG, "Saved native capture configuration")
  }

  fun clearConfiguration(context: Context) {
    prefs(context).edit().remove(KEY_CONFIG).apply()
    legacyPrefs(context).edit().remove("user_id").remove("categories").apply()
  }

  fun getConfiguration(context: Context): JSONObject? {
    val raw = prefs(context).getString(KEY_CONFIG, null) ?: return null
    return runCatching { JSONObject(raw) }.getOrNull()
  }

  fun getEffectiveConfiguration(context: Context): JSONObject? {
    getConfiguration(context)?.let { return it }

    val legacyUserId = legacyPrefs(context).getString("user_id", null)
    val legacyCategories = legacyPrefs(context).getString("categories", null)
    if (legacyUserId.isNullOrBlank() || legacyCategories.isNullOrBlank()) {
      Log.d(TAG, "No native capture configuration found")
      return null
    }

    val config = JSONObject().apply {
      put("userId", legacyUserId)
      put("categories", runCatching { JSONArray(legacyCategories) }.getOrElse { JSONArray() })
    }

    prefs(context).edit().putString(KEY_CONFIG, config.toString()).apply()
    Log.d(TAG, "Loaded legacy native capture configuration")
    return config
  }

  fun getPendingTransactions(context: Context): JSONArray {
    val raw = prefs(context).getString(KEY_PENDING, null)
      ?: legacyPrefs(context).getString("pending", "[]")
      ?: "[]"
    return runCatching { JSONArray(raw) }.getOrElse { JSONArray() }
  }

  fun addPendingTransaction(context: Context, expense: JSONObject) {
    val pending = getPendingTransactions(context)
    pending.put(expense)
    prefs(context).edit().putString(KEY_PENDING, pending.toString()).apply()
    legacyPrefs(context).edit().putString("pending", pending.toString()).apply()
    Log.d(TAG, "Queued pending expense ${expense.optString("id")}")
  }

  fun removePendingTransactions(context: Context, ids: List<String>) {
    if (ids.isEmpty()) {
      return
    }

    val pending = getPendingTransactions(context)
    val updated = JSONArray()
    for (index in 0 until pending.length()) {
      val item = pending.optJSONObject(index) ?: continue
      if (!ids.contains(item.optString("id"))) {
        updated.put(item)
      }
    }
    prefs(context).edit().putString(KEY_PENDING, updated.toString()).apply()
    legacyPrefs(context).edit().putString("pending", updated.toString()).apply()
  }

  fun newPendingExpense(
    userId: String,
    categoryId: String,
    categoryName: String,
    amount: Double,
    note: String,
    sourceBody: String,
  ): JSONObject {
    return JSONObject().apply {
      put("id", UUID.randomUUID().toString())
      put("userId", userId)
      put("categoryId", categoryId)
      put("categoryName", categoryName)
      put("amount", amount)
      put("note", if (note.isBlank()) "Auto-captured UPI payment" else note)
      put("date", java.time.Instant.now().toString())
      put("type", "expense")
      put("paymentMethod", "UPI")
      put("recurring", false)
      put("sourceBody", sourceBody)
    }
  }

  fun shouldSuppressDuplicate(context: Context, signature: String): Boolean {
    val prefs = prefs(context)
    val previous = prefs.getString(KEY_LAST_SIGNATURE, null)
    val previousAt = prefs.getLong(KEY_LAST_SIGNATURE_AT, 0L)
    val now = System.currentTimeMillis()
    val duplicate = previous == signature && now - previousAt < DUPLICATE_WINDOW_MS
    if (!duplicate) {
      prefs.edit()
        .putString(KEY_LAST_SIGNATURE, signature)
        .putLong(KEY_LAST_SIGNATURE_AT, now)
        .apply()
    }
    return duplicate
  }

  private fun prefs(context: Context) =
    context.applicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

  private fun legacyPrefs(context: Context) =
    context.applicationContext.getSharedPreferences(LEGACY_PREFS_NAME, Context.MODE_PRIVATE)
}
