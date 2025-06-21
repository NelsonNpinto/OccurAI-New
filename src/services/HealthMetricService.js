import apiClient from './api/apiClient';
import HealthService from './HealthService';

class HealthMetricService {
  constructor() {}

  // Map frontend periods to backend modes
  mapPeriodToMode(period) {
    const periodMap = {
      Day: 'daily',
      Week: 'weekly',
      Month: 'monthly',
      Year: 'yearly',
    };
    return periodMap[period] || 'daily';
  }

  // Map frontend metric types to backend metric names
  mapMetricType(metricType) {
    const metricMap = {
      steps: 'steps',
      heartRate: 'heartRate',
      spo2: 'spo2',
      sleep: 'sleep',
      mood: 'mood',
      calories: 'calories',
    };
    return metricMap[metricType] || metricType;
  }

  // Get metric data for charts - Main method used by the detail screen
  async getMetricData(metricType, period) {
    try {
      // STEP 1: Try backend first (aggregated data)
      const mode = this.mapPeriodToMode(period);
      const metric = this.mapMetricType(metricType);

      // Skip mood entirely as it's not implemented yet
      if (metricType === 'mood') {
        console.log('Mood tracking not implemented yet');
        return [];
      }

      const response = await apiClient.get(
        '/api/v1/health_data/health/graph-data',
        {
          params: {
            metric: metric,
            mode: mode,
          },
        },
      );

      if (response.data.graph && response.data.graph.length > 0) {
        console.log(`Using backend data for ${metricType}`);
        return response.data.graph.map(item => ({
          label: item.x, // ✅ Use backend's formatted label directly
          value: item.y,
        }));
      }

      // STEP 2: Try Health Device data if backend is empty
      console.log(`Backend data empty, trying Health Device for ${metricType}`);
      const healthDeviceData = await this.getHealthDeviceData(
        metricType,
        period,
      );

      if (healthDeviceData && healthDeviceData.length > 0) {
        console.log(`Using Health Device data for ${metricType}`);

        // Trigger background upload for future backend use
        this.triggerBackgroundUpload();

        return healthDeviceData;
      }

      // STEP 3: Return empty array instead of mock data
      console.log(`No real data available for ${metricType}`);
      return [];
    } catch (error) {
      console.error('Error fetching metric data:', error);

      // Try Health Device as fallback on API error
      try {
        const healthDeviceData = await this.getHealthDeviceData(
          metricType,
          period,
        );
        if (healthDeviceData && healthDeviceData.length > 0) {
          console.log(`API failed, using Health Device data for ${metricType}`);
          return healthDeviceData;
        }
      } catch (hcError) {
        console.error('Health Device also failed:', hcError);
      }

      // Return empty array instead of mock data
      console.log(`No data sources available for ${metricType}`);
      return [];
    }
  }

  // Get Health Device data and format for charts
  async getHealthDeviceData(metricType, period) {
    try {
      const {startDate, endDate} = this.calculateDateRange(period);

      let rawData = [];
      switch (metricType) {
        case 'steps':
          rawData = await HealthService.fetchStepsData(startDate, endDate);
          break;
        case 'heartRate':
          rawData = await HealthService.fetchHeartRateData(startDate, endDate);
          break;
        case 'spo2':
          rawData = await HealthService.fetchOxygenSaturationData(
            startDate,
            endDate,
          );
          break;
        case 'sleep':
          const sleepData = await HealthService.fetchSleepSessionData(
            startDate,
            endDate,
          );
          rawData = this.transformSleepSessions(sleepData);
          break;
        default:
          console.log(`Unsupported metric type: ${metricType}`);
          return [];
      }

      if (!rawData || rawData.length === 0) {
        console.log(`No Health Device data found for ${metricType}`);
        return [];
      }

      return this.transformHealthDeviceToChart(rawData, period, metricType);
    } catch (error) {
      console.error(
        `Error fetching Health Device data for ${metricType}:`,
        error,
      );
      return [];
    }
  }

  // Calculate date range based on period
  calculateDateRange(period) {
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'Day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'Week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'Month':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'Year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setHours(0, 0, 0, 0);
    }

    return {startDate, endDate: now};
  }

  // Transform Health Device data to chart format
  transformHealthDeviceToChart(rawData, period, metricType) {
    // Group data by time intervals
    const grouped = this.groupDataByPeriod(rawData, period);

    // Convert to chart format
    const chartData = [];

    for (const [timeKey, values] of Object.entries(grouped)) {
      if (values.length === 0) continue;

      let aggregatedValue;

      // Apply aggregation based on metric type
      switch (metricType) {
        case 'steps':
        case 'sleep':
          // Sum for cumulative metrics
          aggregatedValue = values.reduce((sum, val) => sum + val, 0);
          break;
        case 'heartRate':
        case 'spo2':
          // Average for rate/percentage metrics
          aggregatedValue =
            values.reduce((sum, val) => sum + val, 0) / values.length;
          aggregatedValue =
            Math.round(aggregatedValue * (metricType === 'spo2' ? 1000 : 1)) /
            (metricType === 'spo2' ? 1000 : 1);
          break;
        default:
          aggregatedValue = values[0];
      }

      chartData.push({
        label: this.formatTimeKey(timeKey, period),
        value: aggregatedValue,
        timestamp: timeKey,
      });
    }

    // Sort by timestamp
    return chartData.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    );
  }

  // Group data points by time period
  groupDataByPeriod(rawData, period) {
    const grouped = {};

    rawData.forEach(record => {
      let timeKey;
      // Handle both HealthKit and HealthConnect timestamp formats
      const timestamp = new Date(
        record.startTime || record.time || record.timestamp || record.startDate,
      );

      switch (period) {
        case 'Day':
          // Group by hour
          timeKey = new Date(
            timestamp.getFullYear(),
            timestamp.getMonth(),
            timestamp.getDate(),
            timestamp.getHours(),
          ).toISOString();
          break;
        case 'Week':
        case 'Month':
          // Group by day
          timeKey = new Date(
            timestamp.getFullYear(),
            timestamp.getMonth(),
            timestamp.getDate(),
          ).toISOString();
          break;
        case 'Year':
          // Group by month
          timeKey = new Date(
            timestamp.getFullYear(),
            timestamp.getMonth(),
            1,
          ).toISOString();
          break;
        default:
          timeKey = timestamp.toISOString();
      }

      if (!grouped[timeKey]) {
        grouped[timeKey] = [];
      }

      // Extract value based on record structure
      const value = this.extractValueFromRecord(record);
      if (value !== null && value !== undefined) {
        grouped[timeKey].push(value);
      }
    });

    return grouped;
  }

  extractValueFromRecord(record) {
    // HealthConnect format
    if (record.count !== undefined) return record.count;
    if (record.beatsPerMinute !== undefined) return record.beatsPerMinute;
    if (record.percentage !== undefined) return record.percentage;

    // HealthKit format (also works with transformed HealthKit data)
    if (record.value !== undefined) return record.value;

    // Sleep duration (calculated from start/end times) - works for both platforms
    if (record.startTime && record.endTime) {
      const start = new Date(record.startTime);
      const end = new Date(record.endTime);
      return (end - start) / (1000 * 60); // Duration in minutes
    }

    return null;
  }

  // Format time key for display
  formatTimeKey(timeKey, period) {
    const date = new Date(timeKey);

    switch (period) {
      case 'Day':
        return date.getHours().toString().padStart(2, '0');
      case 'Week':
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
      case 'Month':
        return date.getDate().toString();
      case 'Year':
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
        return months[date.getMonth()];
      default:
        return timeKey;
    }
  }

  // Transform sleep sessions to duration records
  transformSleepSessions(sleepSessions) {
    if (!sleepSessions || !Array.isArray(sleepSessions)) {
      return [];
    }

    return sleepSessions.map(session => ({
      startTime: session.startTime,
      endTime: session.endTime,
      value: HealthService.calculateTotalSleepDuration([session]),
    }));
  }

  // Upload Health Device data to backend
  async uploadHealthDeviceData() {
    try {
      console.log('Starting Health Device data upload...');

      // Check permissions first
      const hasPermissions = await HealthService.checkAllPermissions();
      if (!hasPermissions) {
        console.log('No Health Device permissions available');
        return false;
      }

      // Get data from last 7 days
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Fetch all available data
      const [stepsData, heartRateData, spo2Data, sleepData] = await Promise.all(
        [
          HealthService.fetchStepsData(startDate, endDate).catch(() => []),
          HealthService.fetchHeartRateData(startDate, endDate).catch(() => []),
          HealthService.fetchOxygenSaturationData(startDate, endDate).catch(
            () => [],
          ),
          HealthService.fetchSleepSessionData(startDate, endDate).catch(
            () => [],
          ),
        ],
      );

      // Transform to backend format
      const payload = {
        steps: this.transformToBackendFormat(stepsData, 'steps'),
        heartRate: this.transformToBackendFormat(heartRateData, 'heartRate'),
        spo2: this.transformToBackendFormat(spo2Data, 'spo2'),
        sleep: this.transformToBackendFormat(sleepData, 'sleep'),
      };

      // Only upload if we have some data
      const hasAnyData = Object.values(payload).some(
        data => Object.keys(data).length > 0,
      );

      if (!hasAnyData) {
        console.log('No Health Device data to upload');
        return false;
      }

      // Upload to backend
      const response = await this.saveHealthData(payload);
      console.log('Health Device data uploaded successfully');

      // Update last upload time (only if localStorage is available)
      try {
        if (typeof localStorage !== 'undefined' && localStorage) {
          localStorage.setItem('lastHealthDeviceUpload', Date.now().toString());
        }
      } catch (storageError) {
        console.log('localStorage not available, skipping upload time storage');
      }

      return true;
    } catch (error) {
      console.error('Failed to upload Health Device data:', error);
      return false;
    }
  }

  // Transform Health Device data to backend's expected format
  transformToBackendFormat(rawData, metricType) {
    const result = {};

    if (!rawData || !Array.isArray(rawData)) {
      return result;
    }

    rawData.forEach(record => {
      try {
        const timestamp = new Date(
          record.startTime ||
            record.time ||
            record.timestamp ||
            record.startDate,
        );

        const utcYear = timestamp.getUTCFullYear();
        const utcMonth = String(timestamp.getUTCMonth() + 1).padStart(2, '0');
        const utcDay = String(timestamp.getUTCDate()).padStart(2, '0');
        const dateKey = `${utcYear}-${utcMonth}-${utcDay}`; // YYYY-MM-DD in UTC

        let value;
        switch (metricType) {
          case 'steps':
            value = record.count || record.value || 0;
            break;
          case 'heartRate':
            value = record.beatsPerMinute || record.value || 0;
            break;
          case 'spo2':
            value = record.percentage || record.value || 0;
            break;
          case 'sleep':
            if (record.startTime && record.endTime) {
              const start = new Date(record.startTime);
              const end = new Date(record.endTime);
              value = Math.round((end - start) / (1000 * 60)); // Duration in minutes
            } else {
              value = record.value || 0;
            }
            break;
          default:
            value = record.value || 0;
        }

        // Aggregate values for the same date
        if (result[dateKey]) {
          if (metricType === 'steps' || metricType === 'sleep') {
            result[dateKey] += value; // Sum for cumulative metrics
          } else {
            result[dateKey] = (result[dateKey] + value) / 2; // Average for rate metrics
          }
        } else {
          result[dateKey] = value;
        }
      } catch (error) {
        console.error(`Error processing ${metricType} record:`, error);
      }
    });

    return result;
  }

  // Check if upload is needed
  shouldUploadHealthDeviceData() {
    try {
      if (typeof localStorage === 'undefined' || !localStorage) return true;

      const lastUpload = localStorage.getItem('lastHealthDeviceUpload');
      if (!lastUpload) return true;

      const timeSinceUpload = Date.now() - parseInt(lastUpload);
      const UPLOAD_INTERVAL = 4 * 60 * 60 * 1000; // 4 hours

      return timeSinceUpload > UPLOAD_INTERVAL;
    } catch (error) {
      console.log('localStorage not available, assuming upload needed');
      return true;
    }
  }

  // Trigger background upload if needed
  async triggerBackgroundUpload() {
    if (this.shouldUploadHealthDeviceData()) {
      // Don't await to avoid blocking the main flow
      this.uploadHealthDeviceData().catch(error => {
        console.error('Background upload failed:', error);
      });
    }
  }

 formatLabel(label, period) {
    try {
      if (typeof label !== 'string') return label;

      if (period === 'Month' && label.startsWith('W')) {
        return `Week ${label.slice(1)}`;
      }

      if (period === 'Year') {
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ];
       return label;

      }

      if (period === 'Week') {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days.includes(label) ? label : label;
      }

      if (period === 'Day') {
        return label; // Time string like "10:00"
      }

      return label;
    } catch (error) {
      console.error('Error formatting label:', label, error);
      return label;
    }
  }


  // Get metric summary
  async getMetricSummary(metricType, period) {
    try {
      const mode = this.mapPeriodToMode(period);
      const metric = this.mapMetricType(metricType);

      const response = await apiClient.get('/health_data/health/summary', {
        params: {
          metric: metric,
          mode: mode,
        },
      });

      return response.data.summary || null;
    } catch (error) {
      console.error('Error fetching metric summary:', error);
      return null;
    }
  }

  // Save health data
  async saveHealthData(healthData) {
    try {
      const payload = {
        steps: healthData.steps || {},
        heartRate: healthData.heartRate || {},
        spo2: healthData.spo2 || {},
        sleep: healthData.sleep || {},
      };

      const response = await apiClient.post(
        '/api/v1/health_data/health/save',
        payload,
      );
      return response.data;
    } catch (error) {
      console.error('Error saving health data:', error);
      throw error;
    }
  }

  // Individual metric endpoints (for backward compatibility)
  async getStepsData(period) {
    return await this.getMetricData('steps', period);
  }

  async getHeartRateData(period) {
    return await this.getMetricData('heartRate', period);
  }

  async getSpO2Data(period) {
    return await this.getMetricData('spo2', period);
  }

  async getSleepData(period) {
    return await this.getMetricData('sleep', period);
  }

  async getMoodData(period) {
    return await this.getMetricData('mood', period);
  }

  async getCaloriesData(period) {
    return await this.getMetricData('calories', period);
  }

  // Get user's health goals
  async getHealthGoals() {
    try {
      const response = await apiClient.get('/user/health-goals');
      return response.data;
    } catch (error) {
      console.error('Error fetching health goals:', error);
      throw error;
    }
  }

  // Update user's health goals
  async updateHealthGoals(goals) {
    try {
      const response = await apiClient.put('/user/health-goals', goals);
      return response.data;
    } catch (error) {
      console.error('Error updating health goals:', error);
      throw error;
    }
  }
}

export default new HealthMetricService();
