import React from 'react';
import { View, Text } from 'react-native';
import { appStyles, colors } from '../styles/styles';

const StreakCard = ({ streakData }) => {
  return (
    <View style={[
      appStyles.card, 
      appStyles.mb4, 
      {
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
          <Text style={{ fontSize: 20 }}>⚡</Text>
        </View>
        <View>
          <Text style={[{ color: '#FFFFFF', fontSize: 16, fontWeight: '500' }]}>
            {streakData.days} Days Streak
          </Text>
          <Text style={[{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }]}>
            You're on a roll with your streak
          </Text>
        </View>
      </View>
      
      {/* Week Progress */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 8 }}>
        {Object.entries(streakData.weekStatus).map(([day, status], index) => (
          <View key={day} style={{ alignItems: 'center' }}>
            <View
              style={[
                {
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: status === true || status === 'today' 
                    ? 'rgba(227, 199, 127, 0.6)' 
                    : 'rgba(255, 255, 255, 0.1)',
                },
              ]}>
              {status === true && (
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>✓</Text>
              )}
              {status === 'today' && (
                <View style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#FFFFFF'
                }} />
              )}
            </View>
            <Text style={[{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 10, marginTop: 4 }]}>{day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default StreakCard;