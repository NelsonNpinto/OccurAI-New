import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { appStyles } from '../styles/styles';
import AppContainer from '../components/AppContainer';
import JournalHeader from '../components/JournalHeader';
import HealthMetricService from '../services/HealthMetricService';
import HealthInitService from '../services/HealthInitService';
import HealthService from '../services/HealthService'; // Added import for direct device access

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 80;

const HealthMetricDetailScreen = ({ navigation, route }) => {
  const { metricType, title, icon, unit } = route.params;
  
  const [selectedPeriod, setSelectedPeriod] = useState('Day');
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [healthConnectStatus, setHealthConnectStatus] = useState(null);
  const [dataSource, setDataSource] = useState(null); // Track where data comes from

  const periods = ['Day', 'Week', 'Month', 'Year'];

  useEffect(() => {
    initializeHealthConnect();
    fetchMetricData();
  }, [selectedPeriod]);

  const initializeHealthConnect = async () => {
    try {
      await HealthInitService.initializeHealthServices();
      const status = await HealthInitService.getHealthConnectStatus();
      setHealthConnectStatus(status);
    } catch (error) {
      console.error('Failed to initialize Health Connect:', error);
    }
  }; 

const fetchMetricData = async () => {
  try {
    setIsLoading(true);
    let data = [];

    const periodMap = {
      'Day': 'daily',
      'Week': 'weekly',
      'Month': 'monthly',
      'Year': 'yearly'
    };

    if (metricType === 'heartRate') {
      const backendPeriod = periodMap[selectedPeriod];

      if (selectedPeriod === 'Day') {
        // First try to get today's heart rate from device
        const heartRateData = await HealthService.getTodayHeartRate();

        if (heartRateData && heartRateData.length > 0) {
          data = heartRateData.map(record => {
            const value = record.beatsPerMinute ??
                        record.value ??
                        record.samples?.[0]?.beatsPerMinute ??
                        record.samples?.[0]?.value ?? 0;

            const timestamp = new Date(record.time || record.endTime || record.startTime || new Date());
            const label = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return {
              value: value,
              label: label,
              source: record.source || 'device'
            };
          });

          data.sort((a, b) => {
            const timeA = new Date(a.time || a.endTime || a.startTime || 0).getTime();
            const timeB = new Date(b.time || b.endTime || b.startTime || 0).getTime();
            return timeA - timeB;
          });

          if (data.length > 24) {
            data = data.slice(data.length - 24);
          }

          setDataSource('device');
        } else {
          // Fallback to backend
          console.log('No device heart rate data, falling back to backend for daily');
          data = await HealthMetricService.getMetricData(metricType, backendPeriod);
          setDataSource('backend');
        }
      } else {
        // Week, Month, Year — always use backend
        data = await HealthMetricService.getMetricData(metricType, backendPeriod);
        setDataSource('backend');
      }
    } else {
      // All other metrics
      data = await HealthMetricService.getMetricData(metricType, selectedPeriod);
      setDataSource(data && data.length > 0 ? data[0]?.source || 'unknown' : 'none');
    }

    if (data && data.length > 0) {
      console.log(`Fetched ${data.length} data points for ${metricType} (${selectedPeriod})`);
      setChartData(data);
    } else {
      console.log(`No data available for ${metricType} (${selectedPeriod})`);
      setChartData([]);
    }

  } catch (error) {
    console.error('Error fetching metric data:', error);
    setChartData([]);
    setDataSource('error');
  } finally {
    setIsLoading(false);
  }
};


  const handleRequestHealthPermissions = async () => {
    try {
      const result = await HealthInitService.requestPermissionsAndSync();
      
      if (result.success) {
        const newStatus = await HealthInitService.getHealthConnectStatus();
        setHealthConnectStatus(newStatus);
        await fetchMetricData(); // Refetch data after permissions granted
        console.log(result.message);
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const getBarColor = (value, metricType) => {
    const thresholds = {
      steps: { high: 15000 },
      heartRate: { high: 100 },
      spo2: { low: 95 },
      sleep: { low: 6 },
    };

    const threshold = thresholds[metricType];
    if (!threshold) return '#E4C67F';

    if (threshold.high && value > threshold.high) return '#FF453A';
    if (threshold.low && value < threshold.low) return '#FF453A';
    
    return '#E4C67F';
  };

  const formatValue = (value, metricType) => {
    switch (metricType) {
      case 'steps':
        return Math.round(value).toLocaleString();
      case 'heartRate':
        return Math.round(value);
      case 'spo2':
        return `${Math.round(value)}%`;
      case 'sleep':
        // Handle both hours and minutes format consistently
        let hours, minutes;
        if (value > 24) {
          // Value is in minutes, convert to hours
          hours = Math.floor(value / 60);
          minutes = Math.round(value % 60);
        } else {
          // Value is already in hours
          hours = Math.floor(value);
          minutes = Math.round((value - hours) * 60);
        }
        return `${hours}h ${minutes}m`;
      default:
        return Math.round(value);
    }
  };

  const getMaxValue = () => {
    if (chartData.length === 0) return 100;
    const maxDataValue = Math.max(...chartData.map(item => item.value));
    return maxDataValue * 1.1;
  };

  const renderBarChart = () => {
    if (isLoading) {
      return (
        <View style={{ height: 320, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#E4C67F" />
        </View>
      );
    }

    if (chartData.length === 0) {
      return (
        <View style={{ height: 320, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 16, textAlign: 'center' }}>
            No data available{'\n'}
            <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.4)' }}>
              {healthConnectStatus?.hasPermissions 
                ? 'Try using your health apps to generate data'
                : 'Connect your health device to see real data'
              }
            </Text>
          </Text>
        </View>
      );
    }

    const maxValue = getMaxValue();
    const chartHeight = 180;
    
    // Fixed bar width for consistency
    const barWidth = 32;
    const barGap = 12;
    
    // Calculate total width needed for horizontal scrolling
    const totalBarsWidth = (chartData.length * barWidth) + ((chartData.length - 1) * barGap);
    const shouldScroll = totalBarsWidth > chartWidth - 40;

    return (
      <View style={{ 
        height: 320, 
        paddingTop: 20,
        paddingBottom: 20,
      }}>
      

        <ScrollView 
          horizontal={shouldScroll}
          showsHorizontalScrollIndicator={shouldScroll}
          contentContainerStyle={{
            paddingHorizontal: 20,
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'center',
          }}
          style={{ flex: 1 }}
        >
          <View style={{
            flexDirection: 'column',
            alignItems: 'center',
            width: shouldScroll ? totalBarsWidth : '100%',
            alignSelf: shouldScroll ? 'flex-start' : 'center',
          }}>
            {/* Top labels container */}
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'flex-end',
              height: 40,
              marginBottom: 10,
              width: '100%',
            }}>
              {chartData.map((item, index) => {
                return (
                  <View key={`label-${index}`} style={{ 
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: barWidth,
                    height: 40,
                    marginRight: index < chartData.length - 1 ? barGap : 0,
                  }}>
                    <Text style={{
                      color: '#FFFFFF',
                      fontSize: 10,
                      fontWeight: '500',
                      textAlign: 'center',
                    }}>
                      {formatValue(item.value, metricType)}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Chart bars container */}
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'flex-end', 
              height: chartHeight,
              marginBottom: 10,
              width: '100%',
            }}>
              {chartData.map((item, index) => {
                const normalizedValue = Math.max(item.value / maxValue, 0.05);
                const barHeight = normalizedValue * chartHeight;
                const barColor = getBarColor(item.value, metricType);
                
                return (
                  <View key={`bar-${index}`} style={{ 
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: barWidth,
                    height: chartHeight,
                    marginRight: index < chartData.length - 1 ? barGap : 0,
                  }}>
                    <View style={{
                      width: barWidth,
                      height: Math.max(barHeight, 12),
                      backgroundColor: barColor,
                      borderRadius: barWidth / 2,
                    }} />
                  </View>
                );
              })}
            </View>

            {/* Bottom labels container */}
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'flex-start',
              height: 40,
              width: '100%',
            }}>
              {chartData.map((item, index) => {
                return (
                  <View key={`bottom-label-${index}`} style={{ 
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: barWidth,
                    height: 40,
                    marginRight: index < chartData.length - 1 ? barGap : 0,
                  }}>
                    <Text style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: 9,
                      textAlign: 'center',
                      lineHeight: 12,
                    }}>
                      {item.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <AppContainer>
      <SafeAreaView style={appStyles.safeArea}>
        {/* Header using JournalHeader component */}
        <View style={{
          paddingHorizontal: 24,
          paddingTop: 10,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255, 255, 255, 0.08)',
        }}>
          <JournalHeader
            title={title}
            onBackPress={() => navigation.goBack()}
            onCalendarPress={() => {
              console.log('Calendar pressed');
            }}
          />
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Health Connect Status Banner */}
          {healthConnectStatus && healthConnectStatus.available && !healthConnectStatus.hasPermissions && (
            <View style={{
              marginHorizontal: 24,
              marginTop: 16,
              backgroundColor: 'rgba(228, 198, 127, 0.1)',
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: 'rgba(228, 198, 127, 0.3)',
            }}>
              <Text style={{
                color: '#E4C67F',
                fontSize: 14,
                fontWeight: '600',
                marginBottom: 8,
              }}>
                Enable Real Health Data
              </Text>
              <Text style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 12,
                marginBottom: 12,
                lineHeight: 16,
              }}>
                Connect to Health Connect to see your real {title.toLowerCase()} data from fitness apps and devices.
              </Text>
              <TouchableOpacity
                onPress={handleRequestHealthPermissions}
                style={{
                  backgroundColor: '#E4C67F',
                  borderRadius: 12,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  alignSelf: 'flex-start',
                }}>
                <Text style={{
                  color: '#000000',
                  fontSize: 12,
                  fontWeight: '600',
                }}>
                  Connect Health Data
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Period Selector */}
          <View style={{
            paddingHorizontal: 24,
            paddingVertical: 24,
          }}>
            <View style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 25,
              padding: 3,
              flexDirection: 'row',
              shadowColor: 'rgba(255, 255, 255, 0.1)',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 20,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}>
              {periods.map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => setSelectedPeriod(period)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 22,
                    backgroundColor: selectedPeriod === period ? '#E4C67F' : 'transparent',
                    alignItems: 'center',
                  }}>
                  <Text style={{
                    color: selectedPeriod === period ? '#000000' : 'rgba(255, 255, 255, 0.6)',
                    fontSize: 13,
                    fontWeight: selectedPeriod === period ? '600' : '500',
                  }}>
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Chart Container */}
          <View style={{
            marginHorizontal: 24,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 28,
            marginBottom: 32,
            shadowColor: 'rgba(255, 255, 255, 0.1)',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 32,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.12)',
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            elevation: 5,
          }}>
            {renderBarChart()}
          </View>
        </ScrollView>
      </SafeAreaView>
    </AppContainer>
  );
};

export default HealthMetricDetailScreen;