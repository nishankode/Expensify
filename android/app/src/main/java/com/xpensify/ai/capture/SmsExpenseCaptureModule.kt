package com.xpensify.ai.capture

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.util.Log

class SmsExpenseCaptureModule(
  reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  init {
    appContext = reactContext
  }

  override fun getName(): String = "SmsExpenseCapture"

  @ReactMethod
  fun configure(configJson: String, promise: Promise) {
    Log.d("SmsExpenseCapture", "configure called")
    ExpenseCaptureStore.saveConfiguration(reactApplicationContext, configJson)
    promise.resolve(null)
  }

  @ReactMethod
  fun clearConfiguration(promise: Promise) {
    Log.d("SmsExpenseCapture", "clearConfiguration called")
    ExpenseCaptureStore.clearConfiguration(reactApplicationContext)
    promise.resolve(null)
  }

  @ReactMethod
  fun getPendingTransactions(promise: Promise) {
    promise.resolve(ExpenseCaptureStore.getPendingTransactions(reactApplicationContext).toString())
  }

  @ReactMethod
  fun removePendingTransactions(ids: com.facebook.react.bridge.ReadableArray, promise: Promise) {
    val values = mutableListOf<String>()
    for (index in 0 until ids.size()) {
      values.add(ids.getString(index).orEmpty())
    }
    ExpenseCaptureStore.removePendingTransactions(reactApplicationContext, values)
    promise.resolve(null)
  }

  @ReactMethod
  fun hasOverlayPermission(promise: Promise) {
    promise.resolve(ExpenseOverlayManager.hasPermission(reactApplicationContext))
  }

  @ReactMethod
  fun hasNotificationAccess(promise: Promise) {
    promise.resolve(PaymentNotificationListenerService.hasNotificationAccess(reactApplicationContext))
  }

  @ReactMethod
  fun openOverlayPermissionSettings(promise: Promise) {
    ExpenseOverlayManager.openPermissionSettings(reactApplicationContext)
    promise.resolve(null)
  }

  @ReactMethod
  fun openNotificationAccessSettings(promise: Promise) {
    PaymentNotificationListenerService.openNotificationSettings(reactApplicationContext)
    promise.resolve(null)
  }

  companion object {
    @Volatile private var appContext: ReactApplicationContext? = null

    fun emitPendingChanged() {
      val context = appContext ?: return
      if (!context.hasActiveReactInstance()) {
        return
      }
      context
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit("SmsExpenseCapturePendingChanged", null)
    }
  }
}
