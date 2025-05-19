import React from 'react';
import { View, Text } from 'react-native';
import { appStyles, colors } from '../styles/styles';
import HealthService from '../services/HealthService';

const SleepCard = ({ sleepData, formatDate }) => {
  return (
    <View style={[appStyles.card, { marginTop: 16 }]}>
      <View style={{ alignItems: 'center', marginBottom: 8 }}>
        <View style={[appStyles.cardIcon, appStyles.mb1]}>
          <Text style={{ fontSize: 20 }}>😴</Text>
        </View>
        <Text style={[appStyles.textPrimary, appStyles.textMedium]}>Sleep</Text>
        <Text style={[appStyles.textSecondary, appStyles.textSm]}>
          {sleepData.duration > 0 ? 'Last Night' : 'No Data'}
        </Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={[appStyles.textPrimary, appStyles.text3Xl, appStyles.textBold]}>
          {sleepData.duration > 0 ? sleepData.formattedDuration : '---'}
        </Text>
      </View>

      {sleepData.records.length > 0 && (
        <View style={{ 
          marginTop: 16, 
          paddingTop: 12, 
          borderTopWidth: 1, 
          borderTopColor: 'rgba(70, 70, 70, 1)' 
        }}>
          <Text style={[appStyles.textPrimary, appStyles.textSemibold, appStyles.mb2]}>
            Sleep Sessions
          </Text>
          {sleepData.records.slice(0, 2).map((record, index) => (
            <View
              key={`sleep-${index}`}
              style={appStyles.sessionCard}>
              <Text style={[appStyles.textPrimary, appStyles.textSm]}>
                {formatDate(record.startTime)} -{' '}
                {formatDate(record.endTime)}
              </Text>
              <Text style={[appStyles.textAccent, appStyles.textSm]}>
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