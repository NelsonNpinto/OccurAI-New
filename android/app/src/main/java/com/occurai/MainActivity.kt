package com.occurai

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import dev.matinzd.healthconnect.permissions.HealthConnectPermissionDelegate

class MainActivity : ReactActivity() {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "OccurAI"

    /**
     * React Navigation requires onCreate to be called with null to avoid crashes
     * related to View state being not persisted consistently across Activity restarts.
     * 
     * We also need to set up HealthConnect permission delegate here.
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        // IMPORTANT: Pass null to super.onCreate for React Navigation
        super.onCreate(null)
        
        // Set up HealthConnect permission delegate
        HealthConnectPermissionDelegate.setPermissionDelegate(this)
    }

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}