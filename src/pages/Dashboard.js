import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Alert,
  BackHandler,
  StatusBar,
  Platform,
} from 'react-native';
import HealthService from '../services/HealthService';
import LinearGradient from 'react-native-linear-gradient';
import BGImg from '../../utils/BgImg.svg';
import StreakCard from '../components/StreakCard';
import HealthMetricCard from '../components/HealthMetricCard';
import SleepCard from '../components/SleepCard';
import {appStyles, colors} from '../styles/styles';
import {BlurView} from '@react-native-community/blur';
// Import the new component files

// Debug utility function
const debugObject = (obj, label = 'Debug') => {
  console.log(`${label}:`, JSON.stringify(obj, null, 2));
};

const Dashboard = () => {
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

  const AppContainer = ({children}) => {
    return (
      <View style={[appStyles.container, {backgroundColor: '#000000'}]}>
        {/* Black background with absolute positioned elements */}
        <View style={StyleSheet.absoluteFill}>
          {/* TOP CIRCLE: Main container for top glow effect */}
          <View
            style={{
              position: 'absolute',
              top: -170,
              left: '50%',
              marginLeft: -300,
              width: 600,
              height: 600,
              borderRadius: 600,
              backgroundColor: 'transparent',
            }}>
            {/* TOP INNER: Bright core circle in center */}
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -75,
                marginLeft: -75,
                width: 150,
                height: 150,
                borderRadius: 150,
                backgroundColor: '#FFDF9E', // Brighter center
              }}
            />

            {/* TOP MIDDLE: Medium glow circle with shadow */}

            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -150,
                marginLeft: -150,
                width: 300,
                height: 300,
                borderRadius: 300,
                backgroundColor: '#E4C67F99', // Semi-transparent gold
                shadowColor: '#E4C67F',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0.8,
                shadowRadius: 50,
              }}
            />

            {/* TOP OUTER: Large diffuse glow with extensive shadow radius */}

            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 600,
                backgroundColor: '#E4C67F33', // Very transparent gold
                shadowColor: '#E4C67F',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0.95,
                shadowRadius: 900,
              }}
            />
          </View>

          {/* BOTTOM CIRCLE: Main container for bottom glow effect */}

          <View
            style={{
              position: 'absolute',
              bottom: -170,
              left: '50%',
              marginLeft: -300,
              width: 600,
              height: 600,
              borderRadius: 600,
              backgroundColor: 'transparent',
            }}>
            {/* BOTTOM INNER: Bright core circle in center */}

            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -75,
                marginLeft: -75,
                width: 150,
                height: 150,
                borderRadius: 150,
                backgroundColor: '#FFDF9E', // Brighter center
              }}
            />

            {/* BOTTOM MIDDLE: Medium glow circle with shadow */}

            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -150,
                marginLeft: -150,
                width: 300,
                height: 300,
                borderRadius: 300,
                backgroundColor: '#E4C67F99', // Semi-transparent gold
                shadowColor: '#E4C67F',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0.8,
                shadowRadius: 50,
              }}
            />

            {/* BOTTOM OUTER: Large diffuse glow with extensive shadow radius */}

            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 600,
                backgroundColor: '#E4C67F33', // Very transparent gold
                shadowColor: '#E4C67F',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0.95,
                shadowRadius: 900,
              }}
            />
          </View>

          {/* BLUR LAYER: Applies blur effect over the entire background */}

          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={30}
          />
        </View>

        {/* CONTENT CONTAINER: SafeAreaView for app content */}

        <SafeAreaView
          style={[
            appStyles.safeArea,
            {paddingTop: StatusBar.currentHeight || 0},
          ]}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          {children}
        </SafeAreaView>
      </View>
    );
  };

  // Loading state UI
  if (isLoading) {
    return (
      <AppContainer>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
          <Text
            className="mt-4"
            style={[appStyles.textPrimary, appStyles.textMedium]}>
            Initializing{' '}
            {Platform.OS === 'ios' ? 'HealthKit' : 'Health Connect  '}
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
          <Text className="text-base text-center mb-8">
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
      <SafeAreaView style={appStyles.safeArea}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={appStyles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
            />
          }>
          {/* Streak Card Component */}
          <StreakCard streakData={streak} />

          {/* Journal Button */}
          <TouchableOpacity
            style={[
              appStyles.button,
              {

                backgroundColor: '#E4C67F',
                borderRadius: 30,
                padding: 14,
                marginVertical: 16,
                shadowColor: '#FFFFFF',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0.04,
                shadowRadius: 32,
                borderWidth: 0,
              },
            ]}
            onPress={() => console.log('Journal pressed')}>
            <Text
              style={[
                appStyles.buttonText,
                {
                  color: 'black',
                  fontSize: 16,
                  fontWeight: '600',
                  textAlign: 'center',
                },
              ]}>
              Journal My Day
            </Text>
          </TouchableOpacity>

          {/* Top Health Metrics Row */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
            {/* Steps Metric Card */}
            <HealthMetricCard
              title="Steps"
              emoji="👣"
              value={todaySteps.toLocaleString()}
              unit="steps"
              subtitle={`${stepPercentage}% of goal`}
            />

            {/* Heart Rate Metric Card */}
            <HealthMetricCard
              title="Heart Rate"
              emoji="❤️"
              value={heartRateData.latest?.beatsPerMinute || '—'}
              unit="bpm"
              subtitle={heartRateData.latest ? 'Good' : 'No data today'}
            />
          </View>

          {/* Second Health Metrics Row */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
            {/* SpO2 Metric Card */}
            <HealthMetricCard
              title="SpO₂"
              emoji="🫁"
              value={
                spo2Data.latest?.percentage
                  ? `${Math.round(spo2Data.latest.percentage * 100)}`
                  : '—'
              }
              unit="%"
              subtitle={spo2Data.latest ? 'Normal' : 'No data today'}
            />

            {/* Mood Metric Card (using the mock data you already have) */}
            <HealthMetricCard
              title="Mood"
              emoji="😊"
              value={mood.score}
              unit="/100"
              subtitle={mood.status}
            />
            
          </View>
          

          {/* Sleep Section */}
          <SleepCard sleepData={sleepData} formatDate={formatDate} />
        </ScrollView>
      </SafeAreaView>
    </AppContainer>
  );
};

export default Dashboard;
