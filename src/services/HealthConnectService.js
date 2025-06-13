import {
  initialize,
  requestPermission,
  readRecords,
  getGrantedPermissions, // ✅ Add this import
} from 'react-native-health-connect';

const SUPPORTED_RECORD_TYPES = [
  'Steps',
  'HeartRate',
  'OxygenSaturation',
  'SleepSession',
];

class HealthConnectService {
  async init() {
    try {
      const isInitialized = await initialize();
      console.log("Health Connect initialization status:", isInitialized);
      return isInitialized;
    } catch (error) {
      console.error('Error initializing Health Connect:', error);
      return false;
    }
  }

  async requestAllPermissions() {
    try {
      const permissions = SUPPORTED_RECORD_TYPES.map(type => ({
        accessType: 'read',
        recordType: type,
      }));
      return await requestPermission(permissions);
    } catch (error) {
      console.error('Error requesting all permissions:', error);
      return null;
    }
  }

  // ✅ FIXED: Now correctly checks existing permissions instead of requesting them
  async checkAllPermissions() {
    try {
      const grantedPermissions = await getGrantedPermissions();
      
      // Check if all required permissions are granted
      const requiredPermissions = SUPPORTED_RECORD_TYPES.map(type => ({
        accessType: 'read',
        recordType: type,
      }));

      // Check if every required permission is in the granted permissions
      const hasAllPermissions = requiredPermissions.every(required => 
        grantedPermissions.some(granted => 
          granted.accessType === required.accessType && 
          granted.recordType === required.recordType
        )
      );

      console.log('Granted permissions:', grantedPermissions);
      console.log('Has all required permissions:', hasAllPermissions);
      
      return hasAllPermissions;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }

  async fetchStepsData(startDate, endDate) {
    try {
      // ✅ Add date validation
      if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date parameters');
      }

      const result = await readRecords('Steps', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      result.records?.forEach(record => {
        console.log('Step data from:', record.metadata?.dataOrigin?.packageName || 'Unknown');
      });

      return result.records || [];
    } catch (error) {
      console.error('Error fetching steps data:', error);
      return [];
    }
  }

  async fetchHeartRateData(startDate, endDate) {
    try {
      // ✅ Add date validation
      if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date parameters');
      }

      const result = await readRecords('HeartRate', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      result.records?.forEach(record => {
        console.log('Heart rate data from:', record.metadata?.dataOrigin?.packageName || 'Unknown');
      });

      return result.records || [];
    } catch (error) {
      console.error('Error fetching heart rate data:', error);
      return [];
    }
  }

  async fetchOxygenSaturationData(startDate, endDate) {
    try {
      // ✅ Add date validation
      if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date parameters');
      }

      const result = await readRecords('OxygenSaturation', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      result.records?.forEach(record => {
        console.log('SpO₂ data from:', record.metadata?.dataOrigin?.packageName || 'Unknown');
      });

      return result.records || [];
    } catch (error) {
      console.error('Error fetching SpO₂ data:', error);
      return [];
    }
  }

  async fetchSleepSessionData(startDate, endDate) {
    try {
      // ✅ Add date validation
      if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date parameters');
      }

      const result = await readRecords('SleepSession', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      result.records?.forEach(record => {
        console.log('Sleep data from:', record.metadata?.dataOrigin?.packageName || 'Unknown');
      });

      return result.records || [];
    } catch (error) {
      console.error('Error fetching sleep session data:', error);
      return [];
    }
  }

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

  // ✅ FIXED: Better date handling and error handling
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
      const sleepStages = []; // placeholder for future

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

  // ✅ FIXED: Better validation and error handling
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
}

export default new HealthConnectService();