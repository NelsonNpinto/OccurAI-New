import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Animated, {useSharedValue, withSpring} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../styles/styles';

// Import your SVG icons
import HomeIcon from '../../utils/bottom navigation/home.svg';
import Journal from '../../utils/bottom navigation/journal-btn.svg';
import Meditation from '../../utils/bottom navigation/meditation-btn.svg';
import Chat from '../../utils/bottom navigation/chat-btn.svg';
import Devices from '../../utils/bottom navigation/devices-btn.svg';

const BottomNavBar = ({state, descriptors, navigation}) => {
  // Get current route name from React Navigation
  const currentRouteName = state.routes[state.index].name;
  const [activeTab, setActiveTab] = useState(currentRouteName);

  // Update active tab when route changes
  useEffect(() => {
    setActiveTab(currentRouteName);
  }, [currentRouteName]);

  const tabs = [
    {key: 'Home', icon: 'HomeIcon'},
    {key: 'Journal', icon: 'JournalIcon'},
    {key: 'Meditation', icon: 'MeditationIcon'},
    {key: 'Chat', icon: 'AtomIcon'},
    {key: 'Devices', icon: 'WatchIcon'},
  ];

  // Create a single animated value for the active tab
  const activeTabIndex = useSharedValue(
    tabs.findIndex(tab => tab.key === activeTab),
  );

  const handleTabPress = tabKey => {
    const newIndex = tabs.findIndex(tab => tab.key === tabKey);
    activeTabIndex.value = withSpring(newIndex, {
      damping: 15,
      stiffness: 120,
    });

    setActiveTab(tabKey);

    // Navigate using React Navigation
    navigation.navigate(tabKey);
  };

  // Render the appropriate icon based on tab and active state
  const renderIcon = (iconName, isActive) => {
    const iconColor = colors.buttonText;
    const iconSize = 24; // Slightly smaller for better centering

    switch (iconName) {
      case 'HomeIcon':
        return (
          <View style={styles.iconContainer}>
            <HomeIcon width={iconSize} height={iconSize} fill={iconColor} />
          </View>
        );
      case 'JournalIcon':
        return (
          <View style={styles.iconContainer}>
            <Journal
              width={iconSize}
              height={iconSize}
              fill={iconColor}
              stroke={isActive ? colors.buttonText : 'transparent'}
            />
          </View>
        );
      case 'MeditationIcon':
        // Add a stroke to ensure the meditation icon is visible when active
        return (
          <View style={styles.iconContainer}>
            <Meditation
              width={iconSize}
              height={iconSize}
              fill={iconColor}
              stroke={isActive ? colors.buttonText : 'transparent'}
            />
          </View>
        );
      case 'AtomIcon':
        return (
          <View style={styles.iconContainer}>
            <Chat width={iconSize} height={iconSize} fill={iconColor} />
          </View>
        );
      case 'WatchIcon':
        return (
          <View style={styles.iconContainer}>
            <Devices width={iconSize} height={iconSize} fill={iconColor} />
          </View>
        );
      default:
        return (
          <View style={styles.iconContainer}>
            <View
              style={[
                styles.iconPlaceholder,
                {
                  backgroundColor: 'transparent',
                  borderColor: iconColor,
                  borderWidth: 1.5,
                  width: iconSize,
                  height: iconSize,
                },
              ]}
            />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabButton}
              onPress={() => handleTabPress(tab.key)}
              activeOpacity={0.7}>
              {isActive ? (
                <LinearGradient
                  colors={[colors.primary, colors.primary]}
                  style={styles.activeButtonGradient}>
                  {renderIcon(tab.icon, isActive)}
                </LinearGradient>
              ) : (
                <View style={styles.inactiveButtonContainer}>
                  {renderIcon(tab.icon, isActive)}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 90, // Increased height
    paddingHorizontal: 8,
    paddingBottom: 10,
    backgroundColor: '#0A0A0A', // Darker background
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)', // Subtle border to distinguish the nav bar
  },
  innerContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: '#050505', // Darker background
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabButton: {
    height: 48, // Increased height for better touch targets
    width: 48, // Fixed width for inactive state
    borderRadius: 100,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabButton: {
    width: 130, // Fixed width for active state
  },
  activeButtonGradient: {
    paddingLeft: 12,
    width: '100%',
    height: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  inactiveButtonContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.7)', // Darker background for better contrast
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tabLabel: {
    color: colors.buttonText,
    fontWeight: '600',
    fontSize: 15, // Slightly larger font
  },
  iconPlaceholder: {
    borderRadius: 14,
  },
});

export default BottomNavBar;
