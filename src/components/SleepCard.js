import React from 'react';
import { View, Text } from 'react-native';
import { appStyles, colors } from '../styles/styles';
import HealthService from '../services/HealthService';

const SleepCard = ({ sleepData, formatDate }) => {
  return (
    <View style={[
      appStyles.card, 
      { 
        marginTop: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 16,
        shadowColor: "#FFFFFF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.04,
        shadowRadius: 32,
        borderWidth: 0,
      }
    ]}>
      {/* Top section with icon and title */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <View style={[
          { 
            backgroundColor: 'rgba(227, 199, 127, 0.6)',
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10
          }
        ]}>
          <Text style={{ fontSize: 20 }}>😴</Text>
        </View>
        <View>
          <Text style={[{ color: '#FFFFFF', fontSize: 16, fontWeight: '500' }]}>Sleep</Text>
          <Text style={[{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }]}>
            {sleepData.duration > 0 ? 'Last Night' : 'No Data'}
          </Text>
        </View>
      </View>
      
      {/* Main sleep duration display */}
      <View style={{ alignSelf: 'flex-end', marginBottom: 12 }}>
        <Text style={[{ color: '#FFFFFF', fontSize: 32, fontWeight: 'bold' }]}>
          {sleepData.duration > 0 ? sleepData.formattedDuration : '---'}
        </Text>
      </View>
      
      {sleepData.records.length > 0 && (
        <View style={{
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          paddingTop: 12,
        }}>
          <Text style={[{ color: '#FFFFFF', fontWeight: '600', marginBottom: 8 }]}>
            Sleep Sessions
          </Text>
          {sleepData.records.slice(0, 2).map((record, index) => (
            <View
              key={`sleep-${index}`}
              style={[
                {
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: 12,
                  marginBottom: 8,
                  padding: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }
              ]}>
              <Text style={[{ color: '#FFFFFF', fontSize: 12 }]}>
                {formatDate(record.startTime)} -{' '}
                {formatDate(record.endTime)}
              </Text>
              <Text style={[{ color: 'rgba(227, 199, 127, 0.9)', fontSize: 12, fontWeight: '500' }]}>
                {HealthService.formatSleepDuration(
                  HealthService.calculateTotalSleepDuration([record]),
                )}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default SleepCard;