import AppleHealthKit from 'react-native-health';
import { Platform } from 'react-native';

const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.OxygenSaturation,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
    ],
  },
};

class HealthKitService {
  constructor() {
    this.isInitialized = false;
  }

  async init() {
    if (Platform.OS !== 'ios') {
      console.log('HealthKit is only available on iOS');
      return false;
    }

    return new Promise((resolve) => {
      AppleHealthKit.initHealthKit(permissions, (error) => {
        if (error) {
          console.error('HealthKit init error:', error);
          this.isInitialized = false;
          return resolve(false);
        }
        console.log('HealthKit initialized successfully');
        this.isInitialized = true;
        resolve(true);
      });
    });
  }

  async requestAllPermissions() {
    // HealthKit permissions are requested during initialization
    if (!this.isInitialized) {
      return await this.init();
    }
    return true;
  }

  async checkAllPermissions() {
    // HealthKit doesn't provide a direct way to check all permissions
    // We assume if initialization was successful, we have permissions
    return this.isInitialized;
  }

  // ✅ ALIGNED: Match HealthConnect interface
  async fetchStepsData(startDate, endDate) {
    if (!this.isInitialized) {
      console.warn('HealthKit not initialized');
      return [];
    }

    // ✅ Add date validation like HealthConnect
    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date parameters');
    }

    return new Promise((resolve) => {
      const options = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        includeManuallyAdded: false,
      };

      AppleHealthKit.getDailyStepCountSamples(options, (err, results) => {
        if (err) {
          console.error('Error getting daily step samples:', err);
          return resolve([]);
        }
        
        // ✅ ALIGNED: Transform to match HealthConnect structure
        const transformedData = (results || []).map(sample => ({
          count: sample.value || 0,
          startTime: sample.startDate,
          endTime: sample.endDate,
          timestamp: sample.startDate,
          // Add metadata to match HealthConnect logging
          metadata: {
            dataOrigin: {
              packageName: 'com.apple.health'
            }
          }
        }));
        
        // ✅ Add logging like HealthConnect
        transformedData.forEach(record => {
          console.log('Step data from:', record.metadata?.dataOrigin?.packageName || 'Unknown');
        });
        
        resolve(transformedData);
      });
    });
  }

  // ✅ ALIGNED: Match HealthConnect interface
  async fetchHeartRateData(startDate, endDate) {
    if (!this.isInitialized) {
      

      console.warn('HealthKit not initialized');
      return [];
    }

    // ✅ Add date validation like HealthConnect
    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date parameters');
    }

    return new Promise((resolve) => {
      const options = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      AppleHealthKit.getHeartRateSamples(options, (err, results) => {
        if (err) {
          console.error('Error getting heart rate data:', err);
          return resolve([]);
        }
        
        // ✅ ALIGNED: Transform to match HealthConnect structure
        const transformedData = (results || []).map(sample => ({
          beatsPerMinute: sample.value,
          value: sample.value,
          time: sample.startDate,
          startTime: sample.startDate,
          endTime: sample.endDate,
          timestamp: sample.startDate,
          metadata: {
            dataOrigin: {
              packageName: 'com.apple.health'
            }
          }
        }));
        
        // ✅ Add logging like HealthConnect
        transformedData.forEach(record => {
          console.log('Heart rate data from:', record.metadata?.dataOrigin?.packageName || 'Unknown');
        });
        
        resolve(transformedData);
      });
    });
  }

  // ✅ ALIGNED: Match HealthConnect interface
  async fetchOxygenSaturationData(startDate, endDate) {
    if (!this.isInitialized) {
      console.warn('HealthKit not initialized');
      return [];
    }

    // ✅ Add date validation like HealthConnect
    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date parameters');
    }

    return new Promise((resolve) => {
      const options = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      AppleHealthKit.getOxygenSaturationSamples(options, (err, results) => {
        if (err) {
          console.error('Error getting oxygen saturation data:', err);
          return resolve([]);
        }
        
        // ✅ ALIGNED: Transform to match HealthConnect structure
        const transformedData = (results || []).map(sample => ({
          percentage: sample.value, // HealthKit returns as decimal (0.98)
          value: sample.value,
          time: sample.startDate,
          startTime: sample.startDate,
          endTime: sample.endDate,
          timestamp: sample.startDate,
          metadata: {
            dataOrigin: {
              packageName: 'com.apple.health'
            }
          }
        }));
        
        // ✅ Add logging like HealthConnect
        transformedData.forEach(record => {
          console.log('SpO₂ data from:', record.metadata?.dataOrigin?.packageName || 'Unknown');
        });
        
        resolve(transformedData);
      });
    });
  }

  // ✅ ALIGNED: Match HealthConnect interface
  async fetchSleepSessionData(startDate, endDate) {
    if (!this.isInitialized) {
      console.warn('HealthKit not initialized');
      return [];
    }

    // ✅ Add date validation like HealthConnect
    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date parameters');
    }

    return new Promise((resolve) => {
      const options = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      AppleHealthKit.getSleepSamples(options, (err, results) => {
        if (err) {
          console.error('Error getting sleep session data:', err);
          return resolve([]);
        }
        
        // ✅ ALIGNED: Transform to match HealthConnect structure
        const sleepSessions = (results || [])
          .filter(sample => sample.value === 'ASLEEP')
          .map(sample => ({
            startTime: sample.startDate,
            endTime: sample.endDate,
            value: sample.value,
            timestamp: sample.startDate,
            metadata: {
              dataOrigin: {
                packageName: 'com.apple.health'
              }
            }
          }));
        
        // ✅ Add logging like HealthConnect
        sleepSessions.forEach(record => {
          console.log('Sleep data from:', record.metadata?.dataOrigin?.packageName || 'Unknown');
        });
        
        resolve(sleepSessions);
      });
    });
  }

  // ✅ ALIGNED: Match HealthConnect convenience methods
  async getTodaySteps() {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    return this.fetchStepsData(startOfDay, endOfDay);
  }

  async getTodayHeartRate() {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    return this.fetchHeartRateData(startOfDay, endOfDay);
  }

  async getTodayOxygenSaturation() {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    return this.fetchOxygenSaturationData(startOfDay, endOfDay);
  }

  // ✅ ALIGNED: Better date handling and error handling like HealthConnect
  async getTodaySleepData() {
    try {
      const today = new Date();
      
      // Validate today's date
      if (isNaN(today.getTime())) {
        throw new Error('Invalid current date');
      }

      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      // More reliable way to get yesterday
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      yesterday.setHours(20, 0, 0, 0); // from 8 PM yesterday

      const sleepSessions = await this.fetchSleepSessionData(yesterday, endOfDay);
      const sleepStages = []; // HealthKit doesn't provide detailed sleep stages

      return {
        sleepSessions,
        sleepStages,
      };
    } catch (error) {
      console.error('Error getting today sleep data:', error);
      return {
        sleepSessions: [],
        sleepStages: [],
      };
    }
  }

  // ✅ ALIGNED: Better validation and error handling like HealthConnect
  calculateTotalSleepDuration(sleepSessions) {
    if (!Array.isArray(sleepSessions) || sleepSessions.length === 0) {
      return 0;
    }

    let totalMinutes = 0;
    
    sleepSessions.forEach(session => {
      if (session && session.startTime && session.endTime) {
        const startTime = new Date(session.startTime);
        const endTime = new Date(session.endTime);
        
        // Validate dates
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
          console.warn('Invalid sleep session dates:', session);
          return;
        }
        
        const durationMs = endTime - startTime;
        if (durationMs > 0) { // Only add positive durations
          totalMinutes += durationMs / (1000 * 60);
        } else {
          console.warn('Invalid sleep duration (negative):', session);
        }
      }
    });

    return Math.max(0, totalMinutes); // Ensure non-negative result
  }

  formatSleepDuration(totalMinutes) {
    if (isNaN(totalMinutes) || totalMinutes < 0) return '0h 0m';

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours}h ${minutes}m`;
  }

  // ✅ Additional methods for platform compatibility
  isAvailable() {
    return Platform.OS === 'ios' && AppleHealthKit.isAvailable();
  }

  async getAuthorizationStatus(permission) {
    if (!this.isInitialized) {
      return 'notDetermined';
    }

    return new Promise((resolve) => {
      AppleHealthKit.getAuthorizationStatusForType(permission, (err, result) => {
        if (err) {
          console.error('Error getting authorization status:', err);
          return resolve('notDetermined');
        }
        resolve(result);
      });
    });
  }
}

export default new HealthKitService();