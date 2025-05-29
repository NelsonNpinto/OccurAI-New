import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { colors, appStyles } from '../styles/styles';

// Import your SVG icons
import Calendar from '../../utils/icons/calender.svg';
import Bell from '../../utils/icons/bell.svg';

const ProfileHeader = ({ 
  userName = 'Nelson Pinto', 
  greeting = 'Good Morning',
  avatarUri = null,
  onCalendarPress,
  onNotificationPress,
  onProfilePress, // New prop for profile navigation
  navigation // Add navigation prop
}) => {
  // Get time of day to adjust greeting if not provided
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const timeGreeting = greeting || getTimeBasedGreeting();

  // Handle profile press - navigate to Profile screen
  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else if (navigation) {
      // Navigate to Profile screen within the main stack
      navigation.navigate('MainTabs', { 
        screen: 'Profile'
      });
    }
  };

  return (
    <View style={styles.headerContainer}>
      {/* Left side - Avatar and greeting - Now clickable */}
      <TouchableOpacity 
        style={styles.profileContainer}
        onPress={handleProfilePress}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Text style={styles.avatarInitial}>{userName.charAt(0)}</Text>
            </View>
          )}
        </View>
        <View style={styles.greetingContainer}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.greeting}>{timeGreeting}</Text>
        </View>
      </TouchableOpacity>

      {/* Right side - Action icons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onCalendarPress}
          activeOpacity={0.7}
        >
          <Calendar width={20} height={20} stroke={colors.primary} strokeWidth={2} fill="none" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <Bell width={20} height={20} stroke={colors.primary} strokeWidth={2} fill="none" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingTop: 2,
    width: '100%',
    gap: 10,
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    // Add visual feedback for touchable area
    borderRadius: 12,
    padding: 4,
    marginLeft: -4, // Compensate for padding
  },
  avatarContainer: {
    width: 44,
    height: 44,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 100,
  },
  defaultAvatar: {
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: '#FF5722', // Orange background as shown in the image
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  greetingContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  userName: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Urbanist',
    fontWeight: '600',
    lineHeight: 28,
  },
  greeting: {
    color: 'rgba(255, 255, 255, 0.56)',
    fontSize: 12,
    fontFamily: 'Urbanist',
    fontWeight: '400',
    lineHeight: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    padding: 12,
    backgroundColor: 'rgba(127.50, 127.50, 127.50, 0.30)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
});

export default ProfileHeader;