import React, {useState, useEffect, useMemo} from 'react';
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

import {appStyles} from '../styles/styles';
import ProfileHeader from '../components/ProfileHeader';
import AppContainer from '../components/AppContainer'; // Import the shared component
import Steps from '../../utils/icons/steps.svg';
import Sleep from '../../utils/icons/sleep.svg';
import Heart from '../../utils/icons/heart.svg';
import Mood from '../../utils/icons/mood.svg';
import Spo2 from '../../utils/icons/spo2.svg';
import AddCard from '../components/AddCard';
import {useAuth} from '../context/AuthContext';
import HealthMetricService from '../services/HealthMetricService';
import HealthMetricsLoadingScreen from '../styles/HealthMetricCardShimmer';
import HealthInitService from '../services/HealthInitService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = ({navigation}) => {
  const {user} = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [healthConnectAvailable, setHealthConnectAvailable] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // Step data states
  const [todaySteps, setTodaySteps] = useState(0);
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

  const latestHeartRate = useMemo(() => {
    const sorted = [...heartRateData.records].sort((a, b) => {
      const getTime = r =>
        new Date(r.time || r.endTime || r.startTime || 0).getTime();
      return getTime(b) - getTime(a);
    });
    const latest = sorted[0];
    const bpm =
      latest?.beatsPerMinute ??
      latest?.value ??
      latest?.samples?.[0]?.beatsPerMinute ??
      latest?.samples?.[0]?.value ??
      null;
    return latest ? {...latest, beatsPerMinute: bpm} : null;
  }, [heartRateData.records]);

  const latestSpO2 = useMemo(() => {
    const sorted = [...spo2Data.records].sort((a, b) => {
      const getTime = r =>
        new Date(r.time || r.endTime || r.startTime || 0).getTime();
      return getTime(b) - getTime(a);
    });
    const latest = sorted[0];
    let value =
      latest?.percentage ??
      latest?.value ??
      latest?.saturation ??
      latest?.samples?.[0]?.value ??
      null;
    if (value > 1.0) value = value / 100;
    return latest ? {...latest, percentage: value} : null;
  }, [spo2Data.records]);

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

  const handleMetricPress = (metricType, title, icon, unit) => {
    navigation.navigate('HealthMetricDetail', {
      metricType,
      title,
      icon,
      unit,
    });
  };

  const initHealthConnect = async () => {
    try {
      setIsLoading(true);

      // Use the existing service method
      const status = await HealthInitService.getHealthConnectStatus();

      setHealthConnectAvailable(status.available);
      setPermissionsGranted(status.hasPermissions);

      if (status.hasPermissions) {
        await fetchHealthData();
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Init error:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to initialize Health Services');
    }
  };

 const requestPermissions = async () => {
  try {
    setIsLoading(true);
    
    // Use the existing service method that handles both permissions and syncing
    const result = await HealthInitService.requestPermissionsAndSync();
    
    if (result.success) {
      console.log('Permissions granted, fetching health data...');
      
      // Update permission state
      setPermissionsGranted(true);
      
      // Fetch the data
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

  const uploadToBackend = async () => {
  try {
    const todayKey = new Date().toISOString().split('T')[0];

    // Check if already uploaded today
    const lastUploadKey = `healthUpload_${todayKey}`;
   const alreadyUploaded = await AsyncStorage.getItem(lastUploadKey);

    if (alreadyUploaded) {
      console.log('Health data already uploaded today');
      return;
    }

    const payload = {
      steps: { [todayKey]: todaySteps },
      heartRate: latestHeartRate ? { [todayKey]: latestHeartRate.beatsPerMinute } : {},
      spo2: latestSpO2 ? { [todayKey]: latestSpO2.percentage } : {},
      sleep: { [todayKey]: sleepData.duration },
    };

    await HealthMetricService.saveHealthData(payload);
    console.log('Data uploaded to backend successfully');

    // Mark today's upload done
    AsyncStorage.setItem(lastUploadKey, 'true');
  } catch (error) {
    console.error('Failed to upload to backend:', error);
  }
};


const fetchHealthData = async () => {
  try {
    setIsRefreshing(true);
    console.log('Fetching health data...');

    // Use Promise.all to fetch all data in parallel
    const [
      todayStepsData,
      heartRateRecords,
      spo2Records,
      sleepToday
    ] = await Promise.all([
      HealthService.getTodaySteps(),
      HealthService.getTodayHeartRate(),
      HealthService.getTodayOxygenSaturation(),
      HealthService.getTodaySleepData()
    ]);

    // Process steps data
    let todayTotal = 0;
    todayStepsData.forEach(record => {
      todayTotal += record.count || 0;
    });
    setTodaySteps(todayTotal);
    setStepRecords(todayStepsData);

    // Process heart rate data
    const sortedHR = [...heartRateRecords].sort((a, b) => {
      const getTime = record =>
        new Date(
          record.time || record.endTime || record.startTime || 0,
        ).getTime();
      return getTime(b) - getTime(a);
    });
    
    let latestHR = sortedHR[0] || null;
    let bpm =
      latestHR?.beatsPerMinute ??
      latestHR?.value ??
      latestHR?.samples?.[0]?.beatsPerMinute ??
      latestHR?.samples?.[0]?.value ??
      null;
      
    if (latestHR) latestHR = {...latestHR, beatsPerMinute: bpm};
    
    setHeartRateData({
      latest: latestHR,
      records: heartRateRecords.map(r => ({
        ...r,
        beatsPerMinute:
          r.beatsPerMinute ??
          r.value ??
          r.samples?.[0]?.beatsPerMinute ??
          r.samples?.[0]?.value ??
          null,
      })),
    });

    // Process SpO2 data
    const sortedSpO2 = [...spo2Records].sort((a, b) => {
      const getTime = record =>
        new Date(
          record.time || record.endTime || record.startTime || 0,
        ).getTime();
      return getTime(b) - getTime(a);
    });
    
    let latestSpO2 = sortedSpO2[0] || null;
    let spo2Value =
      latestSpO2?.percentage ??
      latestSpO2?.value ??
      latestSpO2?.saturation ??
      latestSpO2?.samples?.[0]?.value ??
      null;
      
    if (spo2Value > 1.0) spo2Value = spo2Value / 100;
    
    if (latestSpO2) latestSpO2 = {...latestSpO2, percentage: spo2Value};
    
    setSpo2Data({
      latest: latestSpO2,
      records: spo2Records.map(r => {
        let val =
          r.percentage ??
          r.value ??
          r.saturation ??
          r.samples?.[0]?.value ??
          null;
        if (val > 1.0) val = val / 100;
        return {...r, percentage: val};
      }),
    });

    // Process sleep data
    const todaySleepMinutes = HealthService.calculateTotalSleepDuration(
      sleepToday.sleepSessions,
    );
    const formattedTodaySleep =
      HealthService.formatSleepDuration(todaySleepMinutes);
      
    setSleepData({
      duration: todaySleepMinutes,
      formattedDuration: formattedTodaySleep,
      records: sleepToday.sleepSessions || [],
      stages: sleepToday.sleepStages || [],
    });

    console.log('✅ Health data fetch complete');
    
    // Use the existing service method for backend upload
    await uploadToBackend();

    setIsRefreshing(false);
  } catch (error) {
    console.error('❌ Health data fetch error:', error);
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
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 16,
              textAlign: 'center',
            }}>
            Health Connect Not Available
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: 'white',
              textAlign: 'center',
              marginBottom: 32,
            }}>
            Health Connect is required for this app to function.{'\n\n'}
            If you're using Android 14+, it's already built into your device.
            {'\n\n'}
            For older Android versions, please install Health Connect from the
            Google Play Store.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#E4C67F',
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 50,
            }}
            onPress={initHealthConnect}>
            <Text style={{color: 'black', fontWeight: '600', fontSize: 16}}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </AppContainer>
    );
  }

  // Permissions not granted UI
  if (!permissionsGranted) {
    return (
      <AppContainer>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 16,
              textAlign: 'center',
            }}>
            Permission Required
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#A3A3A3',
              textAlign: 'center',
              marginBottom: 32,
            }}>
            This app needs permission to access your health data through Health
            Connect.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#E4C67F',
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 50,
            }}
            onPress={requestPermissions}>
            <Text style={{color: 'black', fontWeight: '600', fontSize: 16}}>
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
          <ProfileHeader
            navigation={navigation}
            userName={user?.username}
            onCalendarPress={() => console.log('Calendar pressed')}
            onNotificationPress={() => console.log('Notification pressed')}
          />

          <StreakCard streakData={streak} />

          <View style={{marginBottom: 16}}>
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
                metricType="steps"
                onPress={() =>
                  handleMetricPress(
                    'steps',
                    'Steps',
                    <Steps width={20} height={20} />,
                    '/100',
                  )
                }
              />
              <HealthMetricCard
                title="Heart Rate"
                icon={<Heart width={24} height={24} />}
                value={latestHeartRate?.beatsPerMinute || '—'}
                unit="bpm"
                subtitle={latestHeartRate ? 'Good' : 'No data today'}
                metricType="heartRate"
                onPress={() =>
                  handleMetricPress(
                    'heartRate',
                    'Heart Rate',
                    <Heart width={20} height={20} />,
                    'bpm',
                  )
                }
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
                  latestSpO2?.percentage
                    ? `${Math.round(latestSpO2.percentage * 100)}`
                    : '—'
                }
                unit="%"
                subtitle={latestSpO2 ? 'Normal' : 'No data today'}
                metricType="spo2"
                onPress={() =>
                  handleMetricPress(
                    'spo2',
                    'SpO₂',
                    <Spo2 width={20} height={20} />,
                    '%',
                  )
                }
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
              <SleepCard
                sleepData={sleepData}
                metricType="sleep"
                onPress={() =>
                  handleMetricPress(
                    'sleep',
                    'Sleep',
                    <Sleep width={20} height={20} />,
                    '%',
                  )
                }
              />

              <AddCard />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AppContainer>
  );
};

export default Dashboard;
