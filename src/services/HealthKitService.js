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
  async init() {
    if (Platform.OS !== 'ios') return false;
    return new Promise((resolve, reject) => {
      AppleHealthKit.initHealthKit(permissions, (error) => {
        if (error) {
          console.error('HealthKit init error:', error);
          return reject(error);
        }
        resolve(true);
      });
    });
  }

  async getTodaySteps() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return new Promise((resolve, reject) => {
      AppleHealthKit.getStepCount({ startDate: start.toISOString() }, (err, res) => {
        if (err) return reject(err);
        resolve([{ count: res.value || 0 }]);
      });
    });
  }

  async getWeeklySteps() {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDailyStepCountSamples(
        { startDate: start.toISOString(), includeManuallyAdded: false },
        (err, res) => {
          if (err) return reject(err);
          resolve(res.map(day => ({ count: day.value || 0 })));
        }
      );
    });
  }

  async getTodayHeartRate() {
    const now = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return new Promise((resolve, reject) => {
      AppleHealthKit.getHeartRateSamples({ startDate: start.toISOString(), endDate: now.toISOString() }, (err, res) => {
        if (err) return reject(err);
        resolve(res || []);
      });
    });
  }

  async getTodayOxygenSaturation() {
    const now = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return new Promise((resolve, reject) => {
      AppleHealthKit.getOxygenSaturationSamples({ startDate: start.toISOString(), endDate: now.toISOString() }, (err, res) => {
        if (err) return reject(err);
        resolve(res || []);
      });
    });
  }

  async getTodaySleepData() {
    const now = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 1);
    start.setHours(20, 0, 0, 0);
    return new Promise((resolve, reject) => {
      AppleHealthKit.getSleepSamples({ startDate: start.toISOString(), endDate: now.toISOString() }, (err, res) => {
        if (err) return reject(err);
        return resolve({
          sleepSessions: res || [],
          sleepStages: [], // not provided by HealthKit by default
        });
      });
    });
  }

  calculateTotalSleepDuration(sessions) {
    let total = 0;
    sessions.forEach(s => {
      if (s.startDate && s.endDate) {
        total += (new Date(s.endDate) - new Date(s.startDate)) / (1000 * 60);
      }
    });
    return total;
  }

  formatSleepDuration(minutes) {
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    return `${h}h ${m}m`;
  }

  async requestAllPermissions() {
    return true; // Permissions handled during `init`
  }

  async checkAllPermissions() {
    return true; // HealthKit permissions are not queryable post-init
  }
}

export default new HealthKitService();
