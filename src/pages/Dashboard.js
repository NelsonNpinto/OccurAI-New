import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  BackHandler,
} from 'react-native';
import HealthService from '../services/HealthService';
import StreakCard from '../components/StreakCard';
import HealthMetricCard from '../components/HealthMetricCard';
import SleepCard from '../components/SleepCard';
import { appStyles } from '../styles/styles';
import HealthMetricsLoadingScreen from '../styles/HealthMetricCardShimmer';
import BottomNavBar from '../components/BottomNavBar';
import ProfileHeader from '../components/ProfileHeader';
import AppContainer from '../components/AppContainer'; // Import the shared component
import Steps from '../../utils/icons/steps.svg';
import Heart from '../../utils/icons/heart.svg';
import Mood from '../../utils/icons/mood.svg';
import Spo2 from '../../utils/icons/spo2.svg';
import AddCard from '../components/AddCard';

// Debug utility function
const debugObject = (obj, label = 'Debug') => {
  console.log(`${label}:`, JSON.stringify(obj, null, 2));
};

const Dashboard = ({ navigation }) => {
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
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
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

  // Calculate step goal completion percentage
  const stepGoal = 10000; // Example step goal
  const stepPercentage = Math.min(
    100,
    Math.round((todaySteps / stepGoal) * 100),
  );

  // Loading state UI
  if (isLoading) {
    return (
      <AppContainer>
        <HealthMetricsLoadingScreen />
      </AppContainer>
    );
  }

  // Health Connect not available UI
  if (!healthConnectAvailable) {
    return (
      <AppContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 16, textAlign: 'center' }}>
            Health Connect Not Available
          </Text>
          <Text style={{ fontSize: 16, color: 'white', textAlign: 'center', marginBottom: 32 }}>
            Health Connect is required for this app to function.{'\n\n'}
            If you're using Android 14+, it's already built into your device.
            {'\n\n'}
            For older Android versions, please install Health Connect from the
            Google Play Store.
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#E4C67F', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 50 }}
            onPress={initHealthConnect}>
            <Text style={{ color: 'black', fontWeight: '600', fontSize: 16 }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </AppContainer>
    );
  }

  // Permissions not granted UI
  if (!permissionsGranted) {
    return (
      <AppContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 16, textAlign: 'center' }}>
            Permission Required
          </Text>
          <Text style={{ fontSize: 16, color: '#A3A3A3', textAlign: 'center', marginBottom: 32 }}>
            This app needs permission to access your health data through Health
            Connect.
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#E4C67F', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 50 }}
            onPress={requestPermissions}>
            <Text style={{ color: 'black', fontWeight: '600', fontSize: 16 }}>
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
          style={{ flex: 1 }}
          contentContainerStyle={appStyles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
            />
          }>
          
          <ProfileHeader />
          
          <StreakCard streakData={streak} />
          
          <View style={{ marginBottom: 16 }}>
            {/* First Row */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}>
              <HealthMetricCard
                title="Steps"
                icon={<Steps width={24} height={24} />}
                value={todaySteps.toLocaleString()}
                unit="steps"
                subtitle={`${stepPercentage}% of goal`}
              />
              <HealthMetricCard
                title="Heart Rate"
                icon={<Heart width={24} height={24} />}
                value={heartRateData.latest?.beatsPerMinute || '—'}
                unit="bpm"
                subtitle={heartRateData.latest ? 'Good' : 'No data today'}
              />
            </View>
            
            {/* Second Row */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}>
              <HealthMetricCard
                title="SpO₂"
                icon={<Spo2 width={24} height={24} />}
                value={
                  spo2Data.latest?.percentage
                    ? `${Math.round(spo2Data.latest.percentage * 100)}`
                    : '—'
                }
                unit="%"
                subtitle={spo2Data.latest ? 'Normal' : 'No data today'}
              />
              <HealthMetricCard
                title="Mood"
                icon={<Mood width={24} height={24} />}
                value={mood.score}
                unit="/100"
                subtitle={mood.status}
              />
            </View>
            
            {/* Additional cards */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}>
              <SleepCard sleepData={sleepData} />
              <AddCard />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AppContainer>
  );
};

export default Dashboard;