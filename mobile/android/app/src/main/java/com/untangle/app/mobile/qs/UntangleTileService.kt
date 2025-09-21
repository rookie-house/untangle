package com.untangle.app.mobile.qs

import android.content.Intent
import android.service.quicksettings.Tile
import android.service.quicksettings.TileService
import com.untangle.app.mobile.UntangleService

class UntangleTileService : TileService() {
    
    override fun onStartListening() {
        super.onStartListening()
        updateTileState()
    }
    
    override fun onClick() {
        super.onClick()
        
        val isServiceRunning = getSharedPreferences(UntangleService.PREF_NAME, MODE_PRIVATE)
            .getBoolean(UntangleService.KEY_SERVICE_RUNNING, false)
            
        if (isServiceRunning) {
            // Stop service
            stopService(Intent(this, UntangleService::class.java))
            qsTile.state = Tile.STATE_INACTIVE
        } else {
            // Start service
            startService(Intent(this, UntangleService::class.java))
            qsTile.state = Tile.STATE_ACTIVE
        }
        
        qsTile.updateTile()
    }
    
    private fun updateTileState() {
        val isServiceRunning = getSharedPreferences(UntangleService.PREF_NAME, MODE_PRIVATE)
            .getBoolean(UntangleService.KEY_SERVICE_RUNNING, false)
            
        qsTile.state = if (isServiceRunning) Tile.STATE_ACTIVE else Tile.STATE_INACTIVE
        qsTile.updateTile()
    }
}