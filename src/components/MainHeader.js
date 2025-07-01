import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {colors, appStyles} from '../styles/styles';
import MenuModal from './MenuModal';

// Import your SVG icons
import Calendar from '../../utils/icons/calender.svg';
import CalendarIcon from '../../utils/icons/CalenderIcon.svg';
import Bell from '../../utils/icons/bell.svg';
import ArrowLeft from '../../utils/icons/leftArrow.svg';

const MainHeader = ({
  // Header type
  type = 'profile', // 'profile', 'journal', or 'chat'

  // Profile mode props
  userName = 'Nelson Pinto',
  greeting = null,
  avatarUri = null,
  onProfilePress,
  onNotificationPress,

  // Journal mode props
  title = 'Journal',
  subtitle = null,
  date = null,
  onBackPress,
  hideCalendar = false,

  // Chat mode props - Updated for MenuModal
  onNewChat,
  onPreviousChat,

  // Common props
  onCalendarPress,
  isCalendarVisible = false,
  navigation,
}) => {
  // State for MenuModal
  const [showMenuModal, setShowMenuModal] = useState(false);

  // Get time-based greeting for profile mode
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Format date for journal mode
  const getFormattedDate = () => {
    const targetDate = date ? new Date(date) : new Date();
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };

    const formatted = targetDate.toLocaleDateString('en-GB', options);

    // Add ordinal suffix to day
    const day = targetDate.getDate();
    let suffix = 'th';
    if (day % 10 === 1 && day !== 11) suffix = 'st';
    else if (day % 10 === 2 && day !== 12) suffix = 'nd';
    else if (day % 10 === 3 && day !== 13) suffix = 'rd';

    return formatted.replace(/^\d+/, day + suffix);
  };

  // Handle profile press
  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else if (navigation) {
      navigation.navigate('MainTabs', {
        screen: 'Profile',
      });
    }
  };

  // Handle back press
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    }
  };

  // Handle calendar press
  const handleCalendarPress = () => {
    if (onCalendarPress) {
      onCalendarPress();
    }
  };

  // Handle notification press
  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    }
  };

  // Handle menu modal actions
  const handleNewChat = () => {
    setShowMenuModal(false);
    if (onNewChat) {
      onNewChat();
    }
  };

  const handlePreviousChat = () => {
    setShowMenuModal(false);
    if (onPreviousChat) {
      onPreviousChat();
    }
  };

  // Render left content based on type
  const renderLeftContent = () => {
    if (type === 'profile') {
      // Safe handling of userName
      const safeUserName = userName || 'User';
      const displayName = safeUserName.split(/[\s@]/)[0];
      const avatarInitial = safeUserName.charAt(0).toUpperCase();

      return (
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={handleProfilePress}
          activeOpacity={0.7}>
          <View style={styles.avatarContainer}>
            {avatarUri ? (
              <Image source={{uri: avatarUri}} style={styles.avatar} />
            ) : (
              <View style={styles.defaultAvatar}>
                <Text style={styles.avatarInitial}>{avatarInitial}</Text>
              </View>
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.primaryText}>{displayName}</Text>
            <Text style={styles.secondaryText}>
              {greeting || getTimeBasedGreeting()}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else if (type === 'journal') {
      // Journal type - Left side with back button and title
      return (
        <View style={styles.journalContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleBackPress}
            activeOpacity={0.7}>
            <ArrowLeft
              width={20}
              height={20}
              stroke={colors.primary}
              strokeWidth={2}
              fill="none"
            />
          </TouchableOpacity>

          <View style={styles.textContainer}>
            <Text style={styles.journalTitle}>{title}</Text>
            {!hideCalendar && (
              <Text style={styles.journalSubtitle}>
                {subtitle || getFormattedDate()}
              </Text>
            )}
          </View>
        </View>
      );
    } else if (type === 'chat') {
      // Chat type - Left side with back button and title
      return (
        <View style={styles.chatContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleBackPress}
            activeOpacity={0.7}>
            <ArrowLeft
              width={20}
              height={20}
              stroke={colors.primary}
              strokeWidth={2}
              fill="none"
            />
          </TouchableOpacity>

          <View style={styles.textContainer}>
            <Text style={styles.chatTitle}>{title}</Text>
          </View>
        </View>
      );
    }
  };

  // Render right content based on type
  const renderRightContent = () => {
    if (type === 'profile') {
      return (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              isCalendarVisible && styles.iconButtonActive,
            ]}
            onPress={handleCalendarPress}
            activeOpacity={0.7}>
            <Calendar
              width={20}
              height={20}
              stroke={isCalendarVisible ? '#0A0A0A' : colors.primary}
              strokeWidth={2}
              fill="none"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleNotificationPress}
            activeOpacity={0.7}>
            <Bell
              width={20}
              height={20}
              stroke={colors.primary}
              strokeWidth={2}
              fill="none"
            />
          </TouchableOpacity>
        </View>
      );
    } else if (type === 'journal') {
      // Journal type - only calendar if not hidden
      return !hideCalendar ? (
        <TouchableOpacity
          style={[
            styles.iconButton,
            isCalendarVisible && styles.iconButtonActive,
          ]}
          onPress={handleCalendarPress}
          activeOpacity={0.7}>
          <CalendarIcon
            width={20}
            height={20}
            stroke={isCalendarVisible ? '#0A0A0A' : colors.primary}
            strokeWidth={2}
            fill="none"
          />
        </TouchableOpacity>
      ) : null;
    } else if (type === 'chat') {
      // Chat type - Menu button instead of three dots
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowMenuModal(true)}
          activeOpacity={0.7}>
          <View style={styles.threeDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <>
      <View style={styles.headerContainer}>
        {renderLeftContent()}
        {renderRightContent()}
      </View>
      
      {/* MenuModal for chat type */}
      {type === 'chat' && (
        <MenuModal
          visible={showMenuModal}
          onClose={() => setShowMenuModal(false)}
          onNewChat={handleNewChat}
          onPreviousChat={handlePreviousChat}
        />
      )}
    </>
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

  // Profile-specific styles
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    padding: 4,
    marginLeft: -4,
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
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Journal-specific styles
  journalContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // Chat-specific styles
  chatContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginLeft: 10,
  },

  // Common text container
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  // Profile text styles
  primaryText: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'Urbanist',
    fontWeight: '600',
    lineHeight: 28,
  },
  secondaryText: {
    color: 'rgba(255, 255, 255, 0.56)',
    fontSize: 12,
    fontFamily: 'Urbanist',
    fontWeight: '400',
    lineHeight: 16,
  },

  // Journal text styles
  journalTitle: {
    color: colors.primary,
    fontSize: 24,
    fontFamily: 'Urbanist',
    fontWeight: '600',
    lineHeight: 28,
    textAlign: 'left',
  },
  journalSubtitle: {
    color: 'rgba(228, 198, 127, 0.56)',
    fontSize: 12,
    fontFamily: 'Urbanist',
    fontWeight: '400',
    lineHeight: 16,
    textAlign: 'left',
  },

  // Chat text styles - Updated to match journal styles
  chatTitle: {
    color: colors.primary,
    fontSize: 24, // Increased from 18 to match journal
    fontFamily: 'Urbanist',
    fontWeight: '600',
    lineHeight: 28, // Added consistent line height
    textAlign: 'left', // Added consistent alignment
  },

  // Common action styles
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    padding: 10,
    backgroundColor: 'rgba(127.50, 127.50, 127.50, 0.30)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  iconButtonActive: {
    backgroundColor: colors.primary,
  },

  threeDots: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});

export default MainHeader;