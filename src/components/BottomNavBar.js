import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../styles/styles'; 

// Import your SVG icons
import HomeIcon from '../../utils/bottom navigation/home.svg';
import Journal from '../../utils/bottom navigation/journal-btn.svg';
import Meditation from '../../utils/bottom navigation/meditation-btn.svg';
import Chat from '../../utils/bottom navigation/chat-btn.svg';
import Devices from '../../utils/bottom navigation/devices-btn.svg';

const BottomNavBar = ({ state, descriptors, navigation, currentScreen }) => {
  // Get current route name from React Navigation or fallback to prop
  const currentRouteName = state?.routes?.[state.index]?.name || currentScreen || 'Home';
  
  // Check if we're on a nested screen that should hide the bottom nav
  const getCurrentScreenName = () => {
    if (!state || !state.routes || !state.routes[state.index]) {
      return currentRouteName;
    }
    
    const currentRoute = state.routes[state.index];
    
    // Check if there's a nested navigator state
    if (currentRoute.state && currentRoute.state.routes) {
      const nestedRoute = currentRoute.state.routes[currentRoute.state.index];
      return nestedRoute.name;
    }
    
    return currentRoute.name;
  };
  
  const actualCurrentScreen = getCurrentScreenName();
  
  // Define screens where bottom nav should be hidden
   const hideOnScreens = ['GuidedMeditation', 'Breathing442', 'Breathing444', 'Breathing666','Breathing4444'];
  
  // Check if we should hide the bottom nav bar
  const shouldHideBottomNav = hideOnScreens.includes(actualCurrentScreen);
  
  console.log('BottomNavBar - Current screen:', actualCurrentScreen, 'Should hide:', shouldHideBottomNav);
  
  // Return null to completely hide the bottom nav bar
  if (shouldHideBottomNav) {
    return null;
  }
  
  const tabs = [
    { key: 'Home', icon: 'HomeIcon', route: 'Home', isTab: true },
    { key: 'Journal', icon: 'JournalIcon', route: 'Journal', isTab: true }, 
    { key: 'Meditation', icon: 'MeditationIcon', route: 'Meditation', isTab: true },
    { key: 'Chat', icon: 'AtomIcon', route: 'Chat', isTab: true },
    { key: 'Devices', icon: 'WatchIcon', route: 'Devices', isTab: true },
  ];

  // Find current tab index with fallback
  const currentTabIndex = tabs.findIndex(
    tab => tab.key === currentRouteName || tab.route === currentRouteName
  );
  
  // Fallback to first tab if not found
  const safeCurrentIndex = currentTabIndex !== -1 ? currentTabIndex : 0;

  // Create animated value for the active tab
  const activeTabIndex = useSharedValue(safeCurrentIndex);

  // Update animation when route changes
  useEffect(() => {
    const newIndex = tabs.findIndex(
      tab => tab.key === currentRouteName || tab.route === currentRouteName
    );
    const safeNewIndex = newIndex !== -1 ? newIndex : 0;
    
    if (safeNewIndex !== activeTabIndex.value) {
      activeTabIndex.value = withSpring(safeNewIndex, {
        damping: 15,
        stiffness: 120,
      });
    }
  }, [currentRouteName, activeTabIndex, tabs]);

  const handleTabPress = (tab) => {
    if (tab.route === currentRouteName) {
      return; // Don't navigate if already on this screen
    }

    try {
      if (tab.isTab) {
        // Navigate to tab screen
        if (navigation && state && descriptors) {
          navigation.navigate(tab.route);
        }
      } else {
        // Navigate to stack screen (like Journal)
        if (navigation) {
          // Get the parent navigator (the main stack navigator)
          const parentNavigation = navigation.getParent();
          if (parentNavigation) {
            parentNavigation.navigate(tab.route);
          } else {
            // Fallback: try direct navigation
            navigation.navigate(tab.route);
          }
        }
      }
    } catch (error) {
      console.warn('Navigation error:', error);
     
      try {
        navigation?.navigate(tab.route);
      } catch (fallbackError) {
        console.warn('Fallback navigation failed:', fallbackError);
      }
    }
  };

  // Render the appropriate icon based on tab and active state
  const renderIcon = (iconName, isActive) => {
    const iconColor = colors.buttonText;
    const iconSize = 24;

    const IconComponent = (() => {
      switch (iconName) {
        case 'HomeIcon':
          return HomeIcon;
        case 'JournalIcon':
          return Journal;
        case 'MeditationIcon':
          return Meditation;
        case 'AtomIcon':
          return Chat;
        case 'WatchIcon':
          return Devices;
        default:
          return null;
      }
    })();

    if (!IconComponent) {
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
                borderRadius: 14,
              },
            ]}
          />
        </View>
      );
    }

    return (
      <View style={styles.iconContainer}>
        <IconComponent
          width={iconSize}
          height={iconSize}
          fill={iconColor}
          stroke={isActive ? colors.buttonText : 'transparent'}
          strokeWidth={isActive ? 1 : 0}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {tabs.map((tab, index) => {
          const isActive = currentRouteName === tab.key || currentRouteName === tab.route;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabButton}
              onPress={() => handleTabPress(tab)}
              activeOpacity={0.7}
              accessibilityLabel={`${tab.key} tab`}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}>
              
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
    height: 90,
    paddingHorizontal: 8,
    paddingBottom: 10,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  innerContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: '#050505',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabButton: {
    height: 48,
    width: 48,
    borderRadius: 100,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveButtonContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    // Placeholder styles are now inline for better maintainability
  },
});

export default BottomNavBar;