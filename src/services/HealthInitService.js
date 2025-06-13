import HealthService from './HealthService';
import HealthMetricService from './HealthMetricService';

class HealthInitService {
  constructor() {
    this.isInitialized = false;
    this.isInitializing = false;
  }

  async initializeHealthServices() {
    if (this.isInitialized || this.isInitializing) {
      return this.isInitialized;
    }

    this.isInitializing = true;

    try {
      console.log('Initializing Health Device services...');

      const healthDeviceInitialized = await HealthService.init();

      if (!healthDeviceInitialized) {
        console.log('Health Device not available on this device');
        this.isInitialized = true;
        this.isInitializing = false;
        return true;
      }

      const hasPermissions = await HealthService.checkAllPermissions();

      if (!hasPermissions) {
        console.log('Health Device permissions not granted');
      } else {
        console.log('Health Device permissions already granted');

        // ✅ Only upload if data changed
        if (HealthMetricService.shouldUploadHealthDeviceData()) {
          const uploadSuccess =
            await HealthMetricService.uploadHealthDeviceData();
          if (uploadSuccess) {
            console.log('Initial Health Device data uploaded successfully');
          }
        } else {
          console.log('No new data to upload');
        }
      }

      this.isInitialized = true;
      console.log('Health services initialization completed');
      return true;
    } catch (error) {
      console.error('Failed to initialize health services:', error);
      this.isInitialized = false;
      return false;
    } finally {
      this.isInitializing = false;
    }
  }

  async requestPermissionsAndSync() {
    try {
      // Request all permissions
      const permissionResult = await HealthService.requestAllPermissions();

      if (permissionResult) {
        console.log('Health Device permissions granted');

        // Upload existing data
        const uploadSuccess =
          await HealthMetricService.uploadHealthDeviceData();

        if (uploadSuccess) {
          console.log('Health Device data synced successfully');
          return {
            success: true,
            message: 'Health data permissions granted and synced',
          };
        } else {
          return {
            success: true,
            message: 'Permissions granted, but no data to sync yet',
          };
        }
      } else {
        console.log('Health Device permissions denied');
        return {success: false, message: 'Health data permissions denied'};
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return {success: false, message: 'Failed to request permissions'};
    }
  }

  async getHealthConnectStatus() {
    try {
      const isInitialized = await HealthService.init();
      if (!isInitialized) {
        return {
          available: false,
          hasPermissions: false,
          message: 'Health Device not available on this device',
        };
      }

      const hasPermissions = await HealthService.checkAllPermissions();

      return {
        available: true,
        hasPermissions: hasPermissions,
        message: hasPermissions
          ? 'Health Device available and permissions granted'
          : 'Health Device available but permissions needed',
      };
    } catch (error) {
      console.error('Error checking Health Device status:', error);
      return {
        available: false,
        hasPermissions: false,
        message: 'Error checking Health Device status',
      };
    }
  }

  // Call this method periodically to sync data
  async syncHealthDataIfNeeded() {
    try {
      const status = await this.getHealthConnectStatus();

      if (status.available && status.hasPermissions) {
        if (HealthMetricService.shouldUploadHealthDeviceData()) {
          await HealthMetricService.uploadHealthDeviceData();
        }
      }
    } catch (error) {
      console.error('Error in periodic sync:', error);
    }
  }
}

export default new HealthInitService();
