package com.xpensify.ai.capture

import android.content.Context
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.util.Log
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.GridLayout
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import androidx.core.content.res.ResourcesCompat
import com.xpensify.ai.R
import org.json.JSONArray
import org.json.JSONObject
import java.util.Locale

object ExpenseOverlayManager {
  private const val TAG = "SmsExpenseCapture"
  @Volatile private var currentView: View? = null

  fun hasPermission(context: Context): Boolean = Settings.canDrawOverlays(context)

  fun openPermissionSettings(context: Context) {
    val intent = android.content.Intent(
      Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
      Uri.parse("package:${context.packageName}")
    ).apply {
      addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
    }
    context.startActivity(intent)
  }

  fun show(context: Context, parsedExpense: JSONObject) {
    if (!hasPermission(context) || currentView != null) {
      Log.d(TAG, "Overlay skipped: permission=${hasPermission(context)} currentView=${currentView != null}")
      return
    }

    val config = ExpenseCaptureStore.getEffectiveConfiguration(context)
      ?: JSONObject().apply { put("categories", buildFallbackCategories()) }
    val categories = (config.optJSONArray("categories") ?: buildFallbackCategories()).takeIf { it.length() > 0 }
      ?: buildFallbackCategories()
    if (!config.has("userId")) {
      Log.d(TAG, "Using fallback overlay categories because native configuration is missing")
    }

    val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
    val overlay = buildOverlayView(context, windowManager, parsedExpense, config, categories)
    val layoutParams = WindowManager.LayoutParams(
      WindowManager.LayoutParams.MATCH_PARENT,
      WindowManager.LayoutParams.MATCH_PARENT,
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
      } else {
        WindowManager.LayoutParams.TYPE_PHONE
      },
      WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
      PixelFormat.TRANSLUCENT,
    ).apply {
      gravity = Gravity.CENTER
    }

    currentView = overlay
    windowManager.addView(overlay, layoutParams)
    Log.d(TAG, "Overlay shown for amount=${parsedExpense.optDouble("amount")} merchant=${parsedExpense.optString("merchant")}")
  }

  private fun buildOverlayView(
    context: Context,
    windowManager: WindowManager,
    parsedExpense: JSONObject,
    config: JSONObject,
    categories: JSONArray,
  ): View {
    val amount = parsedExpense.optDouble("amount", 0.0)
    val merchant = parsedExpense.optString("merchant", "Payment")
    val body = parsedExpense.optString("body")
    val userId = config.optString("userId")

    val root = FrameLayout(context).apply {
      setBackgroundColor(0x73000000)
      isClickable = true
      isFocusable = true
    }

    val scrollContainer = ScrollView(context).apply {
      isFillViewport = true
      overScrollMode = View.OVER_SCROLL_IF_CONTENT_SCROLLS
    }
    root.addView(
      scrollContainer,
      FrameLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.MATCH_PARENT,
      ),
    )

    val centeredHost = LinearLayout(context).apply {
      orientation = LinearLayout.VERTICAL
      gravity = Gravity.CENTER
      setPadding(dp(context, 20), dp(context, 24), dp(context, 20), dp(context, 24))
    }
    scrollContainer.addView(
      centeredHost,
      ViewGroup.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.WRAP_CONTENT,
      ),
    )

    val card = LinearLayout(context).apply {
      orientation = LinearLayout.VERTICAL
      background = roundedDrawable(dp(context, 26).toFloat(), Color.WHITE)
      setPadding(dp(context, 22), dp(context, 20), dp(context, 22), dp(context, 18))
      elevation = 24f
    }

    centeredHost.addView(
      card,
      LinearLayout.LayoutParams(dp(context, 350), ViewGroup.LayoutParams.WRAP_CONTENT),
    )

    val header = LinearLayout(context).apply {
      orientation = LinearLayout.HORIZONTAL
      gravity = Gravity.CENTER_VERTICAL
    }
    card.addView(
      header,
      LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT),
    )

    val badge = TextView(context).apply {
      text = "\u2197  DEBIT"
      textSize = 12f
      typeface = Typeface.DEFAULT_BOLD
      setTextColor(Color.parseColor("#E0554D"))
      background = roundedDrawable(999f, Color.parseColor("#FFF0EE"))
      setPadding(dp(context, 12), dp(context, 7), dp(context, 12), dp(context, 7))
    }
    header.addView(badge)

    header.addView(View(context), LinearLayout.LayoutParams(0, 0, 1f))

    val closeButton = TextView(context).apply {
      text = "\u00D7"
      textSize = 22f
      setTextColor(Color.parseColor("#545463"))
      setPadding(dp(context, 12), dp(context, 2), dp(context, 4), dp(context, 6))
      setOnClickListener { dismiss(windowManager) }
    }
    header.addView(closeButton)

    val merchantText = TextView(context).apply {
      text = merchant
      textSize = 18f
      typeface = Typeface.DEFAULT_BOLD
      setTextColor(Color.parseColor("#1F2430"))
      setPadding(0, dp(context, 10), 0, dp(context, 2))
    }
    card.addView(merchantText)

    val amountText = TextView(context).apply {
      text = "\u20B9${formatAmount(amount)}"
      textSize = 29f
      typeface = Typeface.DEFAULT_BOLD
      setTextColor(Color.parseColor("#121826"))
    }
    card.addView(amountText)

    val noteInput = EditText(context).apply {
      hint = "Add a note (optional)"
      textSize = 15f
      setTextColor(Color.parseColor("#1F2430"))
      setHintTextColor(Color.parseColor("#8B90A0"))
      background = roundedDrawable(dp(context, 16).toFloat(), Color.parseColor("#F6F7FB"))
      setPadding(dp(context, 14), dp(context, 12), dp(context, 14), dp(context, 12))
      gravity = Gravity.TOP or Gravity.START
      minLines = 2
      maxLines = 3
    }
    card.addView(
      noteInput,
      LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
        topMargin = dp(context, 16)
      },
    )

    val divider = View(context).apply {
      setBackgroundColor(Color.parseColor("#E8E8EF"))
    }
    card.addView(
      divider,
      LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(context, 1)).apply {
        topMargin = dp(context, 22)
        bottomMargin = dp(context, 18)
      },
    )

    val sectionTitle = LinearLayout(context).apply {
      orientation = LinearLayout.HORIZONTAL
      gravity = Gravity.CENTER_VERTICAL
    }
    card.addView(sectionTitle)

    val sparkles = TextView(context).apply {
      text = "\u2726"
      textSize = 18f
      setTextColor(Color.parseColor("#19198B"))
    }
    sectionTitle.addView(sparkles)

    val sectionLabel = TextView(context).apply {
      text = "Select category"
      textSize = 15f
      setTextColor(Color.parseColor("#565A6A"))
      setPadding(dp(context, 8), 0, 0, 0)
    }
    sectionTitle.addView(sectionLabel)

    val grid = GridLayout(context).apply {
      columnCount = 4
      rowCount = ((categories.length() + 3) / 4).coerceAtLeast(1)
      useDefaultMargins = false
      setPadding(0, dp(context, 18), 0, 0)
    }
    card.addView(grid)

    for (index in 0 until categories.length()) {
      val category = categories.optJSONObject(index) ?: continue
      val categoryName = category.optString("name", "Other")
      val categoryId = category.optString("id").ifBlank { categoryName }
      val categoryIcon = category.optString("icon").ifBlank { "category" }
      val categoryBackground = parseColor(category.optString("background"), "#F1F1F5")
      val categoryForeground = parseColor(category.optString("foreground"), "#4D4E59")
      val tile = buildCategoryTile(
        context = context,
        icon = categoryIcon,
        label = categoryName,
        iconBackground = categoryBackground,
        iconForeground = categoryForeground,
        onClick = {
          val note = noteInput.text?.toString()?.trim().orEmpty().ifBlank { merchant }
          val pendingExpense = ExpenseCaptureStore.newPendingExpense(
            userId = userId,
            categoryId = categoryId,
            categoryName = categoryName,
            amount = amount,
            note = note,
            sourceBody = body,
          )
          ExpenseCaptureStore.addPendingTransaction(context, pendingExpense)
          SmsExpenseCaptureModule.emitPendingChanged()
          dismiss(windowManager)
        },
      )

      grid.addView(
        tile,
        GridLayout.LayoutParams().apply {
          width = 0
          columnSpec = GridLayout.spec(GridLayout.UNDEFINED, 1f)
          setMargins(dp(context, 2), 0, dp(context, 2), dp(context, 14))
        },
      )
    }

    val footer = LinearLayout(context).apply {
      orientation = LinearLayout.HORIZONTAL
      gravity = Gravity.END
    }
    card.addView(
      footer,
      LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
        topMargin = dp(context, 4)
      },
    )

    val skipButton = TextView(context).apply {
      text = "Skip"
      textSize = 16f
      typeface = Typeface.DEFAULT_BOLD
      setTextColor(Color.parseColor("#6F7180"))
      setPadding(dp(context, 10), dp(context, 6), dp(context, 4), dp(context, 4))
      setOnClickListener { dismiss(windowManager) }
    }
    footer.addView(skipButton)

    return root
  }

  private fun buildCategoryTile(
    context: Context,
    icon: String,
    label: String,
    iconBackground: Int,
    iconForeground: Int,
    onClick: () -> Unit,
  ): View {
    val iconTypeface = ResourcesCompat.getFont(context, R.font.material_symbols_outlined)
    val tile = LinearLayout(context).apply {
      orientation = LinearLayout.VERTICAL
      gravity = Gravity.CENTER_HORIZONTAL
      setPadding(dp(context, 4), dp(context, 2), dp(context, 4), dp(context, 2))
      setOnClickListener { onClick() }
      isClickable = true
      isFocusable = true
    }

    val iconBox = TextView(context).apply {
      text = icon
      gravity = Gravity.CENTER
      textSize = 22f
      typeface = iconTypeface
      setTextColor(iconForeground)
      background = roundedDrawable(dp(context, 20).toFloat(), iconBackground)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        fontVariationSettings = "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
      }
    }
    tile.addView(iconBox, LinearLayout.LayoutParams(dp(context, 40), dp(context, 40)))

    val labelView = TextView(context).apply {
      text = label
      textSize = 12f
      gravity = Gravity.CENTER
      setTextColor(Color.parseColor("#565A6A"))
      setPadding(0, dp(context, 8), 0, 0)
      maxLines = 2
    }
    tile.addView(
      labelView,
      LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT),
    )

    return tile
  }

  private fun buildFallbackCategories(): JSONArray {
    val categories = listOf(
      arrayOf("food-dining", "Food & Dining", "restaurant", "#E6510022", "#E65100"),
      arrayOf("transport", "Transportation", "directions_car", "#1565C022", "#1565C0"),
      arrayOf("shopping", "Shopping", "shopping_bag", "#6A1B9A22", "#6A1B9A"),
      arrayOf("utilities", "Utilities", "receipt_long", "#1A237E22", "#1A237E"),
      arrayOf("entertainment", "Entertainment", "movie", "#8E24AA22", "#8E24AA"),
      arrayOf("groceries", "Groceries", "local_grocery_store", "#2E7D3222", "#2E7D32"),
      arrayOf("health", "Health", "medical_services", "#C6282822", "#C62828"),
      arrayOf("others", "Others", "more_horiz", "#546E7A22", "#546E7A"),
    )
    return JSONArray().apply {
      categories.forEach { entry ->
        put(JSONObject().apply {
          put("id", entry[0])
          put("name", entry[1])
          put("icon", entry[2])
          put("background", entry[3])
          put("foreground", entry[4])
        })
      }
    }
  }

  private fun roundedDrawable(radius: Float, color: Int): GradientDrawable {
    return GradientDrawable().apply {
      shape = GradientDrawable.RECTANGLE
      cornerRadius = radius
      setColor(color)
    }
  }

  private fun dp(context: Context, value: Int): Int {
    return (value * context.resources.displayMetrics.density).toInt()
  }

  private fun formatAmount(amount: Double): String {
    return if (amount % 1.0 == 0.0) {
      amount.toInt().toString()
    } else {
      String.format(Locale.ENGLISH, "%.2f", amount)
    }
  }

  private fun dismiss(windowManager: WindowManager) {
    currentView?.let { view ->
      runCatching { windowManager.removeView(view) }
      currentView = null
      Log.d(TAG, "Overlay dismissed")
    }
  }

  private fun parseColor(value: String?, fallback: String): Int {
    val normalized = normalizeColorHex(value)
      ?: normalizeColorHex(fallback)
      ?: "#000000"
    return runCatching { Color.parseColor(normalized) }
      .getOrElse { Color.parseColor("#000000") }
  }

  private fun normalizeColorHex(value: String?): String? {
    val trimmed = value?.trim().orEmpty()
    if (trimmed.isEmpty()) {
      return null
    }

    if (trimmed.matches(Regex("^#[0-9a-fA-F]{3}$"))) {
      return "#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}"
    }

    if (trimmed.matches(Regex("^#[0-9a-fA-F]{6}$"))) {
      return trimmed
    }

    if (trimmed.matches(Regex("^#[0-9a-fA-F]{8}$"))) {
      return "#${trimmed.substring(7, 9)}${trimmed.substring(1, 7)}"
    }

    return null
  }
}
