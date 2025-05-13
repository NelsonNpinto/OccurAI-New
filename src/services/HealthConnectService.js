import {
  initialize,
  requestPermission,
  readRecords,
} from 'react-native-health-connect';

// ✅ Supported Health Connect data types
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

  async checkAllPermissions() {
    try {
      const permissions = SUPPORTED_RECORD_TYPES.map(type => ({
        accessType: 'read',
        recordType: type,
      }));
      const result = await requestPermission(permissions);
      return !!result;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }

  async fetchStepsData(startDate, endDate) {
    try {
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

  async getWeeklySteps() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 7);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    return this.fetchStepsData(startOfWeek, endOfDay);
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

  async getTodaySleepData() {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Look for sleep data from yesterday too (sleep often starts before midnight)
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(20, 0, 0, 0); // from 8 PM yesterday

    const sleepSessions = await this.fetchSleepSessionData(yesterday, endOfDay);
    const sleepStages = []; // Placeholder for future use

    return {
      sleepSessions,
      sleepStages,
    };
  }

  calculateTotalSleepDuration(sleepSessions) {
    if (!sleepSessions || sleepSessions.length === 0) return 0;

    let totalMinutes = 0;
    sleepSessions.forEach(session => {
      if (session && session.startTime && session.endTime) {
        const startTime = new Date(session.startTime);
        const endTime = new Date(session.endTime);
        const durationMs = endTime - startTime;
        totalMinutes += durationMs / (1000 * 60);
      }
    });

    return totalMinutes;
  }

  formatSleepDuration(totalMinutes) {
    if (isNaN(totalMinutes) || totalMinutes < 0) return '0h 0m';

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours}h ${minutes}m`;
  }
}

export default new HealthConnectService();
