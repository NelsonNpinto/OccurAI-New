import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {appStyles} from '../styles/styles';

const HealthMetricCard = ({
  title,
  icon,
  value,
  unit,
  subtitle,
  customStyles = {},
  onPress,
  metricType,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        appStyles.card,
        {
          width: '48%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 20,
          padding: 16,
          shadowColor: '#FFFFFF',
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.04,
          shadowRadius: 32,
          borderWidth: 0,
          height: 180, // consistent height
          justifyContent: 'space-between',
        },
        customStyles,
      ]}>
      {/* Top left icon + title + subtitle */}
      <View style={{alignItems: 'flex-start'}}>
        <View
          style={{
            backgroundColor: 'rgba(227, 199, 127, 0.6)',
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
          }}>
          <Text style={{fontSize: 20}}>{icon}</Text>
        </View>
        <Text
          style={[
            appStyles.textMedium,
            {color: '#FFFFFF', fontSize: 16, marginBottom: 2},
          ]}>
          {title}
        </Text>
        <Text
          style={[
            appStyles.textSm,
            {color: 'rgba(255, 255, 255, 0.6)', fontSize: 12},
          ]}>
          {subtitle}
        </Text>
      </View>

      {/* Bottom right value + unit */}
      <View style={{alignSelf: 'flex-end', alignItems: 'flex-end'}}>
        <Text
          style={[
            appStyles.textBold,
            {color: '#FFFFFF', fontSize: 32, lineHeight: 36},
          ]}>
          {value || '---'}
        </Text>
        {unit && (
          <Text
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: 12,
              marginTop: -4,
            }}>
            {unit}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default HealthMetricCard;