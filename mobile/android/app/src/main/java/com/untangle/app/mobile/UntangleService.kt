package com.untangle.app.mobile

import android.app.Service
import android.content.Intent
import android.os.IBinder

class UntangleService : Service() {
    companion object {
        const val PREF_NAME = "UntanglePrefs"
        const val KEY_SERVICE_RUNNING = "service_running"
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Save state in SharedPreferences
        getSharedPreferences(PREF_NAME, MODE_PRIVATE)
            .edit()
            .putBoolean(KEY_SERVICE_RUNNING, true)
            .apply()
        
        // TODO: Implement actual service functionality
        
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        // Update state in SharedPreferences
        getSharedPreferences(PREF_NAME, MODE_PRIVATE)
            .edit()
            .putBoolean(KEY_SERVICE_RUNNING, false)
            .apply()
    }
}