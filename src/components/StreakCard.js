import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Light from '../../utils/icons/light.svg';

const StreakCard = ({ streakData, navigation }) => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const handleJournalPress = () => {
    if (navigation) {
      navigation.navigate('Journal');
    }
  };
  
  return (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.10)', 'rgba(0, 0, 0, 0)']}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={[
        {
          width: '100%',
          padding: 12,
          borderRadius: 32,
          shadowColor: "#FFFFFF",
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 32,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 8,
          marginBottom: 23,
        }
      ]}
    >
      
      {/* Streak Info Section */}
      <View style={{
        alignSelf: 'stretch',
        padding: 12,
        backgroundColor: 'rgba(94.35, 94.35, 94.35, 0.18)',
        borderRadius: 24,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
      }}>
        {/* Lightning Icon Container with exact Figma styling */}
        <View style={{
          padding: 10,
          backgroundColor: '#615100',
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Light width={23} height={23}  />
        </View>
        
        {/* Text Content */}
        <View style={{
          width: 200,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}>
          <Text style={{
            alignSelf: 'stretch',
            color: 'white',
            fontSize: 18,
            fontWeight: '600',
            lineHeight: 24,
          }}>
            {streakData.days} Days Streak
          </Text>
          <Text style={{
            alignSelf: 'stretch',
            color: '#A3A3A3',
            fontSize: 12,
            fontWeight: '400',
            lineHeight: 16,
          }}>
            You're on a roll with your streak
          </Text>
        </View>
      </View>

      {/* Week Progress Section */}
      <View style={{
        alignSelf: 'stretch',
        height: 80,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: 'rgba(94.35, 94.35, 94.35, 0.18)',
        borderRadius: 24,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}>
        <View style={{
          alignSelf: 'stretch',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          position: 'relative',
        }}>
          {weekDays.map((day, index) => {
            const status = streakData.weekStatus[day];
            const isLast = index === weekDays.length - 1;
            
            return (
              <React.Fragment key={day}>
                {/* Day Column */}
                <View style={{
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  {/* Day Circle */}
                  <View style={{
                    width: 24,
                    height: 24,
                    backgroundColor: status === true ? '#E4C67F' : 'transparent',
                    borderRadius: 12,
                    borderWidth: status === 'today' ? 1.5 : (status === false ? 1 : 0),
                    borderColor: '#E4C67F',
                    borderStyle: status === 'today' ? 'dashed' : 'solid',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {/* Checkmark for completed days */}
                    {status === true && (
                      <Text style={{
                        color: '#0A0A0A',
                        fontSize: 12,
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}>✓</Text>
                    )}
                    {/* Plus icon for today */}
                    {status === 'today' && (
                      <Text style={{
                        color: '#E4C67F',
                        fontSize: 16,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        lineHeight: 16,
                      }}>+</Text>
                    )}
                    {/* Minus icon for future days */}
                    {status === false && (
                      <Text style={{
                        color: '#E4C67F',
                        fontSize: 16,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        lineHeight: 16,
                      }}>−</Text>
                    )}
                  </View>
                  
                  {/* Day Label */}
                  <Text style={{
                    alignSelf: 'stretch',
                    textAlign: 'center',
                    color: '#A3A3A3',
                    fontSize: 10,
                    fontWeight: '600',
                    lineHeight: 12,
                  }}>
                    {day}
                  </Text>
                </View>
                
                {/* Connecting Line (except after last day) */}
                {!isLast && (
                  <View style={{
                    flex: 1,
                    height: 2,
                    marginTop: 11, // Half of circle height to center the line
                    backgroundColor: '#E4C67F',
                    alignSelf: 'flex-start',
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </View>
      </View>

      {/* Journal My Day Button */}
      <TouchableOpacity 
        style={{
          alignSelf: 'stretch',
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 4,
          paddingBottom: 4,
          backgroundColor: '#E4C67F',
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          height: 32,
        }}
        onPress={handleJournalPress}
        activeOpacity={0.8}
      >
        <Text style={{
          textAlign: 'center',
          color: '#0A0A0A',
          fontSize: 14,
          fontWeight: '600',
          lineHeight: 24,
        }}>
          Journal My Day
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default StreakCard;