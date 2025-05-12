import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Alert,
  BackHandler,
  StatusBar,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HealthService from './src/services/HealthService';
import './global.css';

// Debug utility function
const debugObject = (obj, label = 'Debug') => {
  console.log(`${label}:`, JSON.stringify(obj, null, 2));
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [healthConnectAvailable, setHealthConnectAvailable] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // Step data states
  const [todaySteps, setTodaySteps] = useState(0);
  const [weeklySteps, setWeeklySteps] = useState(0);
  const [stepRecords, setStepRecords] = useState([]);

  // Health data states
  const [heartRateData, setHeartRateData] = useState({
    latest: null,
    records: [],
  });

  const [spo2Data, setSpo2Data] = useState({
    latest: null,
    records: [],
  });

  const [sleepData, setSleepData] = useState({
    duration: 0,
    formattedDuration: '0h 0m',
    records: [],
    stages: [],
  });

  // Mock mood data (since this isn't in Health Connect)
  const [mood, setMood] = useState({
    score: 82,
    status: 'Happy',
  });

  // Streak data
  const [streak, setStreak] = useState({
    days: 19,
    weekStatus: {
      Mon: true,
      Tue: true,
      Wed: true,
      Thu: 'today',
      Fri: false,
      Sat: false,
      Sun: false,
    },
  });

  // Prevent app from closing with back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);

  // Initialize on app load
  useEffect(() => {
    initHealthConnect();
  }, []);

  const initHealthConnect = async () => {
    try {
      setIsLoading(true);
      console.log('Initializing Health Connect...');

      const isInitialized = await HealthService.init();
      console.log('Health Connect initialization result:', isInitialized);
      setHealthConnectAvailable(isInitialized);

      if (isInitialized) {
        console.log('Requesting Health Connect permissions...');
        const permissions = await HealthService.requestAllPermissions();
        console.log('Permissions result:', permissions);
        setPermissionsGranted(!!permissions);

        if (permissions) {
          console.log('Permissions granted, fetching health data...');
          await fetchHealthData();
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Init error:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to initialize Health Connect');
    }
  };

  const requestPermissions = async () => {
    try {
      setIsLoading(true);
      console.log('Requesting Health Connect permissions...');

      const permissions = await HealthService.requestAllPermissions();
      console.log('Permission result:', permissions);

      const hasPermission = await HealthService.checkAllPermissions();
      console.log('Has all permissions after request:', hasPermission);

      setPermissionsGranted(hasPermission);

      if (hasPermission) {
        console.log('Permissions granted, fetching health data...');
        await fetchHealthData();
      } else {
        console.log('Permissions denied by user');
        Alert.alert(
          'Permissions Required',
          'Health data access permissions are required for this app to function. Please grant these permissions in Health Connect settings.',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        );
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Permission error:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to request permissions: ' + error.message);
    }
  };

  const fetchHealthData = async () => {
    try {
      setIsRefreshing(true);
      console.log('Fetching health data...');

      // STEPS DATA
      console.log('Fetching step data...');
      const todayData = await HealthService.getTodaySteps();
      console.log(`Found ${todayData.length} step records for today`);
      debugObject(todayData, 'Today Step Records');

      let todayTotal = 0;
      todayData.forEach(record => {
        console.log('Step record:', record.count || 0, 'steps');
        todayTotal += record.count || 0;
      });
      setTodaySteps(todayTotal);
      console.log("Today's total steps:", todayTotal);

      // Weekly steps
      const weeklyData = await HealthService.getWeeklySteps();
      console.log(`Found ${weeklyData.length} step records for the week`);

      let weeklyTotal = 0;
      weeklyData.forEach(record => {
        weeklyTotal += record.count || 0;
      });
      setWeeklySteps(weeklyTotal);
      console.log('Weekly total steps:', weeklyTotal);

      // Store step records for display
      setStepRecords(weeklyData);

      // HEART RATE DATA
      console.log('Fetching heart rate data...');
      const heartRateRecords = await HealthService.getTodayHeartRate();
      console.log(
        `Found ${heartRateRecords.length} heart rate records for today`,
      );

      if (heartRateRecords.length > 0) {
        debugObject(heartRateRecords[0], 'First Heart Rate Record');
      }

      let latestHeartRate = null;

      if (heartRateRecords && heartRateRecords.length > 0) {
        // Sort by time to get the latest
        const sortedHR = [...heartRateRecords].sort((a, b) => {
          const getTime = record => {
            if (record.time) return new Date(record.time).getTime();
            if (record.endTime) return new Date(record.endTime).getTime();
            if (record.startTime) return new Date(record.startTime).getTime();
            return 0;
          };

          return getTime(b) - getTime(a);
        });

        latestHeartRate = sortedHR[0];
        console.log('Latest heart rate record:', latestHeartRate);

        // FIXED EXTRACTION: Properly handle samples array
        let heartRateValue = null;

        // Check direct properties first
        if (latestHeartRate.beatsPerMinute !== undefined) {
          heartRateValue = latestHeartRate.beatsPerMinute;
        } else if (latestHeartRate.value !== undefined) {
          heartRateValue = latestHeartRate.value;
        }
        // Then check samples array - THIS IS THE KEY FIX
        else if (
          latestHeartRate.samples &&
          latestHeartRate.samples.length > 0
        ) {
          if (latestHeartRate.samples[0].beatsPerMinute !== undefined) {
            heartRateValue = latestHeartRate.samples[0].beatsPerMinute;
          } else if (latestHeartRate.samples[0].value !== undefined) {
            heartRateValue = latestHeartRate.samples[0].value;
          }
        }

        console.log('Extracted heart rate value:', heartRateValue);

        // Create a normalized object with consistent properties
        latestHeartRate = {
          ...latestHeartRate,
          beatsPerMinute: heartRateValue,
        };
      }

      // Update heart rate state
      setHeartRateData({
        latest: latestHeartRate,
        records:
          heartRateRecords.map(record => {
            // Apply the same extraction logic to all records
            let bpm = null;

            // Direct properties
            if (record.beatsPerMinute !== undefined) {
              bpm = record.beatsPerMinute;
            } else if (record.value !== undefined) {
              bpm = record.value;
            }
            // Samples array
            else if (record.samples && record.samples.length > 0) {
              if (record.samples[0].beatsPerMinute !== undefined) {
                bpm = record.samples[0].beatsPerMinute;
              } else if (record.samples[0].value !== undefined) {
                bpm = record.samples[0].value;
              }
            }

            return {
              ...record,
              beatsPerMinute: bpm,
            };
          }) || [],
      });

      // SPO2 DATA
      console.log('Fetching SpO2 data...');
      const spo2Records = await HealthService.getTodayOxygenSaturation();
      console.log(`Found ${spo2Records.length} SpO2 records for today`);

      if (spo2Records.length > 0) {
        debugObject(spo2Records[0], 'First SpO2 Record');
      }

      let latestSpo2 = null;

      if (spo2Records && spo2Records.length > 0) {
        // Sort by time to get the latest
        const sortedSpo2 = [...spo2Records].sort((a, b) => {
          const getTime = record => {
            if (record.time) return new Date(record.time).getTime();
            if (record.endTime) return new Date(record.endTime).getTime();
            if (record.startTime) return new Date(record.startTime).getTime();
            return 0;
          };

          return getTime(b) - getTime(a);
        });

        latestSpo2 = sortedSpo2[0];
        console.log('Latest SpO2 record:', latestSpo2);

        // Extract the percentage value based on the structure of your data
        let spo2Value =
          latestSpo2.percentage ||
          latestSpo2.value ||
          latestSpo2.saturation ||
          latestSpo2.samples?.[0]?.value ||
          null;

        console.log('Raw extracted SpO2 value:', spo2Value);

        // FIX: Determine if the value is already a percentage or a decimal
        // If value is > 1.0, it's likely already a percentage (like 96.0)
        // If value is ≤ 1.0, it's likely a decimal (like 0.96)
        if (spo2Value !== null) {
          if (spo2Value > 1.0) {
            // Value is already a percentage (e.g., 96.0), store as decimal
            spo2Value = spo2Value / 100;
            console.log(
              'SpO2 value was in percentage form, converted to decimal:',
              spo2Value,
            );
          }

          // Ensure value is in valid range (0-1)
          if (spo2Value > 1.0) {
            console.log('SpO2 value still too large, forcing to valid range');
            spo2Value = Math.min(1.0, spo2Value / 100);
          }
        }

        // Create a normalized object with consistent properties
        latestSpo2 = {
          ...latestSpo2,
          percentage: spo2Value,
        };
      }

      // Update SpO2 state
      setSpo2Data({
        latest: latestSpo2,
        records:
          spo2Records.map(record => {
            // Extract value
            let percentage =
              record.percentage ||
              record.value ||
              record.saturation ||
              record.samples?.[0]?.value ||
              null;

            // Apply the same normalization to all records
            if (percentage !== null) {
              if (percentage > 1.0) {
                percentage = percentage / 100;
              }
              if (percentage > 1.0) {
                percentage = Math.min(1.0, percentage / 100);
              }
            }

            return {
              ...record,
              percentage: percentage,
            };
          }) || [],
      });

      // SLEEP DATA
      console.log('Fetching sleep data...');
      const sleepResult = await HealthService.getTodaySleepData();
      console.log(
        `Found ${
          sleepResult.sleepSessions?.length || 0
        } sleep sessions for today`,
      );

      if (sleepResult.sleepSessions?.length > 0) {
        debugObject(sleepResult.sleepSessions[0], 'First Sleep Session');
      }

      const totalSleepMinutes = HealthService.calculateTotalSleepDuration(
        sleepResult.sleepSessions,
      );
      console.log('Total sleep minutes:', totalSleepMinutes);

      const formattedSleepDuration =
        HealthService.formatSleepDuration(totalSleepMinutes);
      console.log('Formatted sleep duration:', formattedSleepDuration);

      setSleepData({
        duration: totalSleepMinutes,
        formattedDuration: formattedSleepDuration,
        records: sleepResult.sleepSessions || [],
        stages: sleepResult.sleepStages || [],
      });

      console.log('Health data fetch complete!');
      setIsRefreshing(false);
    } catch (error) {
      console.error('Data fetch error:', error);
      setIsRefreshing(false);
      Alert.alert('Error', 'Failed to fetch health data');
    }
  };

  const onRefresh = () => {
    if (permissionsGranted) {
      fetchHealthData();
    }
  };

  // Format date for display
  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString() +
        ' ' +
        date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
      );
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date';
    }
  };

  // Function for sleep stage name
  const getSleepStageName = stage => {
    if (!stage) return 'Unknown';

    const stageMap = {
      unknown: 'Unknown',
      awake: 'Awake',
      sleeping: 'Sleeping',
      out_of_bed: 'Out of Bed',
      light: 'Light Sleep',
      deep: 'Deep Sleep',
      rem: 'REM Sleep',
    };
    return stageMap[stage] || stage;
  };

  // Calculate step goal completion percentage
  const stepGoal = 10000; // Example step goal
  const stepPercentage = Math.min(
    100,
    Math.round((todaySteps / stepGoal) * 100),
  );

  // Main App Container
  const AppContainer = ({children}) => {
    return (
      <View style={{flex: 1, backgroundColor: '#1E1E1E'}}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <LinearGradient
          colors={['#1E1E1E', '#2A2A2A', '#303030']}
          style={{flex: 1, paddingTop: StatusBar.currentHeight || 0}}>
          {children}
        </LinearGradient>
      </View>
    );
  };

  // Loading state UI
  if (isLoading) {
    return (
      <AppContainer>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#E5C990" />
          <Text className="mt-4 text-lg text-gray-300">
            Initializing Health Connect...
          </Text>
        </View>
      </AppContainer>
    );
  }

  // Health Connect not available UI
  if (!healthConnectAvailable) {
    return (
      <AppContainer>
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-2xl font-bold text-white mb-4">
            Health Connect Not Available
          </Text>
          <Text className="text-base text-gray-300 text-center mb-8">
            Health Connect is required for this app to function.{'\n\n'}
            If you're using Android 14+, it's already built into your device.
            {'\n\n'}
            For older Android versions, please install Health Connect from the
            Google Play Store.
          </Text>
          <TouchableOpacity
            className="bg-amber-400 py-3 px-6 rounded-full"
            onPress={initHealthConnect}>
            <Text className="text-black font-semibold text-base">Retry</Text>
          </TouchableOpacity>
        </View>
      </AppContainer>
    );
  }

  // Permissions not granted UI
  if (!permissionsGranted) {
    return (
      <AppContainer>
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-2xl font-bold text-white mb-4">
            Permission Required
          </Text>
          <Text className="text-base text-gray-300 text-center mb-8">
            This app needs permission to access your health data through Health
            Connect.
          </Text>
          <TouchableOpacity
            className="bg-amber-400 py-3 px-6 rounded-full"
            onPress={requestPermissions}>
            <Text className="text-black font-semibold text-base">
              Grant Permissions
            </Text>
          </TouchableOpacity>
        </View>
      </AppContainer>
    );
  }

  // Main app UI with permissions granted
  return (
    <AppContainer>
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{padding: 16}}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#E5C990"
            />
          }>
          {/* Streak Card */}
          <View className="bg-neutral-800/80 rounded-3xl p-4 mb-4 overflow-hidden">
            <View className="flex-row items-center mb-2">
              <View className="w-12 h-12 rounded-full bg-amber-400/25 justify-center items-center mr-3">
                <Text className="text-amber-400 text-2xl">⚡</Text>
              </View>
              <View>
                <Text className="text-white text-xl font-bold">
                  {streak.days} Days Streak
                </Text>
                <Text className="text-gray-400 text-sm">
                  You're on a roll with your streak
                </Text>
              </View>
            </View>

            {/* Week Progress */}
            <View className="flex-row justify-between mt-4 mb-2">
              {Object.entries(streak.weekStatus).map(([day, status], index) => (
                <View key={day} className="items-center">
                  <View
                    className={`w-8 h-8 rounded-full justify-center items-center
                    ${
                      status === true
                        ? 'bg-amber-400'
                        : status === 'today'
                        ? 'border-2 border-gray-400 bg-neutral-700'
                        : 'bg-neutral-700'
                    }`}>
                    {status === true && (
                      <Text className="text-black font-bold">✓</Text>
                    )}
                  </View>
                  <Text className="text-gray-400 text-xs mt-1">{day}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Journal Button */}
          <TouchableOpacity className="bg-amber-400 rounded-full py-3 mb-4">
            <Text className="text-black text-center font-semibold">
              Journal My Day
            </Text>
          </TouchableOpacity>

          {/* Top Health Metrics Row */}
          <View className="flex-row justify-between mb-4">
            {/* Mood Card */}
            <View
              className="bg-neutral-800/80 rounded-3xl p-4"
              style={{width: '48%'}}>
              <View className="items-center mb-2">
                <View className="w-10 h-10 rounded-full bg-amber-400/25 justify-center items-center mb-1">
                  <Text className="text-xl">😊</Text>
                </View>
                <Text className="text-white font-medium">Mood</Text>
                <Text className="text-gray-400 text-sm">{mood.status}</Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-4xl font-bold">
                  {mood.score}
                </Text>
                <Text className="text-gray-400 text-xs">/100</Text>
              </View>
            </View>

            {/* Heart Rate Card */}
            <View
              className="bg-neutral-800/80 rounded-3xl p-4"
              style={{width: '48%'}}>
              <View className="items-center mb-2">
                <View className="w-10 h-10 rounded-full bg-amber-400/25 justify-center items-center mb-1">
                  <Text className="text-xl">❤️</Text>
                </View>
                <Text className="text-white font-medium">Heart Rate</Text>
                <Text className="text-gray-400 text-sm">
                  {heartRateData.latest?.beatsPerMinute ? 'Latest' : 'No Data'}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-4xl font-bold">
                  {heartRateData.latest?.beatsPerMinute || '---'}
                </Text>
                <Text className="text-gray-400 text-xs">bpm</Text>
              </View>
            </View>
          </View>

          {/* Bottom Health Metrics Row */}
          <View className="flex-row justify-between">
            {/* Steps Card */}
            <View
              className="bg-neutral-800/80 rounded-3xl p-4"
              style={{width: '48%'}}>
              <View className="items-center mb-2">
                <View className="w-10 h-10 rounded-full bg-amber-400/25 justify-center items-center mb-1">
                  <Text className="text-xl">👣</Text>
                </View>
                <Text className="text-white font-medium">Steps</Text>
                <Text className="text-gray-400 text-sm">
                  {stepPercentage}% Completed
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-4xl font-bold">
                  {todaySteps}
                </Text>
              </View>
            </View>

            {/* SpO2 Card */}
            <View
              className="bg-neutral-800/80 rounded-3xl p-4"
              style={{width: '48%'}}>
              <View className="items-center mb-2">
                <View className="w-10 h-10 rounded-full bg-amber-400/25 justify-center items-center mb-1">
                  <Text className="text-xl">💧</Text>
                </View>
                <Text className="text-white font-medium">SpO2</Text>
                <Text className="text-gray-400 text-sm">
                  {spo2Data.latest?.percentage ? 'Normal' : 'No Data'}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-4xl font-bold">
                  {spo2Data.latest?.percentage
                    ? `${Math.round(spo2Data.latest.percentage * 100)}`
                    : '---'}
                </Text>
                <Text className="text-gray-400 text-xs">%</Text>
              </View>
            </View>
          </View>

          {/* Sleep Section */}
          <View className="bg-neutral-800/80 rounded-3xl p-4 mt-4">
            <View className="items-center mb-2">
              <View className="w-10 h-10 rounded-full bg-amber-400/25 justify-center items-center mb-1">
                <Text className="text-xl">😴</Text>
              </View>
              <Text className="text-white font-medium">Sleep</Text>
              <Text className="text-gray-400 text-sm">
                {sleepData.duration > 0 ? 'Last Night' : 'No Data'}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-3xl font-bold">
                {sleepData.duration > 0 ? sleepData.formattedDuration : '---'}
              </Text>
            </View>

            {sleepData.records.length > 0 && (
              <View className="mt-4 pt-3 border-t border-neutral-700">
                <Text className="text-white font-semibold mb-2">
                  Sleep Sessions
                </Text>
                {sleepData.records.slice(0, 2).map((record, index) => (
                  <View
                    key={`sleep-${index}`}
                    className="bg-neutral-700/50 rounded-lg p-3 mb-2">
                    <Text className="text-gray-200 text-sm">
                      {formatDate(record.startTime)} -{' '}
                      {formatDate(record.endTime)}
                    </Text>
                    <Text className="text-amber-400 text-sm">
                      {HealthService.formatSleepDuration(
                        HealthService.calculateTotalSleepDuration([record]),
                      )}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </AppContainer>
  );
};

export default App;