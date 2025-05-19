import React from 'react';
import { View, Text } from 'react-native';
import { appStyles, colors } from '../styles/styles';

const StreakCard = ({ streakData }) => {
  return (
    <View style={[appStyles.card, appStyles.mb4]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <View style={[appStyles.cardIcon, { width: 48, height: 48 }, appStyles.mr3]}>
          <Text style={{ fontSize: 24 }}>⚡</Text>
        </View>
        <View>
          <Text style={[appStyles.textPrimary, appStyles.textXl, appStyles.textBold]}>
            {streakData.days} Days Streak
          </Text>
          <Text style={[appStyles.textSecondary, appStyles.textSm]}>
            You're on a roll with your streak
          </Text>
        </View>
      </View>

      {/* Week Progress */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, marginBottom: 8 }}>
        {Object.entries(streakData.weekStatus).map(([day, status], index) => (
          <View key={day} style={{ alignItems: 'center' }}>
            <View
              style={[
                appStyles.streakDot,
                status === true ? appStyles.streakDotActive : null,
                status === 'today' ? appStyles.streakDotToday : null,
              ]}>
              {status === true && (
                <Text style={{ color: colors.buttonText, fontWeight: 'bold' }}>✓</Text>
              )}
            </View>
            <Text style={[appStyles.textSecondary, appStyles.textXs, appStyles.mt1]}>{day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default StreakCard;