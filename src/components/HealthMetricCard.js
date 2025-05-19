import React from 'react';
import { View, Text } from 'react-native';
import { appStyles } from '../styles/styles';

const HealthMetricCard = ({ 
  title, 
  emoji, 
  value, 
  unit, 
  subtitle, 
  customStyles = {} 
}) => {
  return (
    <View
      style={[appStyles.card, { width: '48%' }, customStyles]}>
      <View style={{ alignItems: 'center', marginBottom: 8 }}>
        <View style={[appStyles.cardIcon, appStyles.mb1]}>
          <Text style={{ fontSize: 20 }}>{emoji}</Text>
        </View>
        <Text style={[appStyles.textPrimary, appStyles.textMedium]}>{title}</Text>
        <Text style={[appStyles.textSecondary, appStyles.textSm]}>{subtitle}</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={[appStyles.textPrimary, appStyles.text4Xl, appStyles.textBold]}>
          {value || '---'}
        </Text>
        {unit && <Text style={[appStyles.textSecondary, appStyles.textXs]}>{unit}</Text>}
      </View>
    </View>
  );
};

export default HealthMetricCard;