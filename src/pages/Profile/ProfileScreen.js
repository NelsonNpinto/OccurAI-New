// src/screens/profile/ProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { appStyles, colors } from '../../styles/styles';
import JournalHeader from '../../components/JournalHeader';
import BottomNavBar from '../../components/BottomNavBar';

// Import icons for menu items
import Bell from '../../../utils/icons/bell.svg';
import Calendar from '../../../utils/icons/calender.svg';
import Heart from '../../../utils/icons/heart.svg';
import ArrowRight from '../../../utils/icons/rightArrow.svg'; // Assuming you have this icon

const ProfileScreen = ({ navigation }) => {
  const { user, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Menu items for quick actions
  const menuItems = [
    {
      id: 'edit-profile',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: Heart,
      onPress: () => Alert.alert('Coming Soon', 'Profile editing will be available in the next update!'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      icon: Bell,
      onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon!'),
    },
    {
      id: 'journal-settings',
      title: 'Journal Settings',
      subtitle: 'Customize your journaling experience',
      icon: Calendar,
      onPress: () => Alert.alert('Coming Soon', 'Journal settings will be available soon!'),
    },
  ];

  const AppContainer = ({ children }) => {
    return (
      <View style={[appStyles.container, { backgroundColor: '#000000' }]}>
        {/* Background with glow effects */}
        <View style={StyleSheet.absoluteFill}>
          <View
            style={{
              position: 'absolute',
              top: -170,
              left: '50%',
              marginLeft: -300,
              width: 600,
              height: 600,
              borderRadius: 600,
              backgroundColor: 'transparent',
            }}>
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -75,
                marginLeft: -75,
                width: 150,
                height: 150,
                borderRadius: 150,
                backgroundColor: '#FFDF9E',
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -150,
                marginLeft: -150,
                width: 300,
                height: 300,
                borderRadius: 300,
                backgroundColor: '#E4C67F99',
                shadowColor: '#E4C67F',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 50,
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 600,
                backgroundColor: '#E4C67F33',
                shadowColor: '#E4C67F',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.95,
                shadowRadius: 900,
              }}
            />
          </View>

          <View
            style={{
              position: 'absolute',
              bottom: -170,
              left: '50%',
              marginLeft: -300,
              width: 600,
              height: 600,
              borderRadius: 600,
              backgroundColor: 'transparent',
            }}>
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -75,
                marginLeft: -75,
                width: 150,
                height: 150,
                borderRadius: 150,
                backgroundColor: '#FFDF9E',
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -150,
                marginLeft: -150,
                width: 300,
                height: 300,
                borderRadius: 300,
                backgroundColor: '#E4C67F99',
                shadowColor: '#E4C67F',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 50,
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 600,
                backgroundColor: '#E4C67F33',
                shadowColor: '#E4C67F',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.95,
                shadowRadius: 900,
              }}
            />
          </View>

          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={30}
          />
        </View>

        <SafeAreaView
          style={[
            appStyles.safeArea,
            { paddingTop: StatusBar.currentHeight || 0 },
          ]}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          {children}
        </SafeAreaView>
      </View>
    );
  };

  return (
    <AppContainer>
      <SafeAreaView style={appStyles.safeArea}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={appStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <JournalHeader 
            title="Profile"
            date=""
            onBackPress={() => navigation.goBack()}
            onCalendarPress={() => console.log('Calendar pressed')}
          />

          <LinearGradient
            colors={['rgba(255, 255, 255, 0.10)', 'rgba(0, 0, 0, 0)']}
            style={styles.container}
          >
            {/* Profile Avatar */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </View>
              <Text style={styles.username}>{user?.username || 'Unknown User'}</Text>
              <Text style={styles.email}>{user?.email || 'No email'}</Text>
            </View>

            {/* Quick Actions Menu */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIconContainer}>
                      <item.icon width={20} height={20} stroke={colors.primary} strokeWidth={2} fill="none" />
                    </View>
                    <View style={styles.menuTextContainer}>
                      <Text style={styles.menuItemTitle}>{item.title}</Text>
                      <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                  {/* You can add ArrowRight icon here if you have it */}
                  <View style={styles.menuItemRight}>
                    <Text style={styles.menuArrow}>›</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Profile Information */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Profile Information</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Username</Text>
                <Text style={styles.infoValue}>{user?.username || 'N/A'}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{user?.age || 'Not specified'}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>
                  {user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified'}
                </Text>
              </View>
              
              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>{formatDate(user?.created_at)}</Text>
              </View>
            </View>

            {/* Logout Button */}
            <View style={styles.actionSection}>
              <TouchableOpacity
                style={[styles.logoutButton, (isLoggingOut || isLoading) && styles.logoutButtonDisabled]}
                onPress={handleLogout}
                disabled={isLoggingOut || isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.logoutButtonText}>
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* App Info */}
            <View style={styles.appInfoSection}>
              <Text style={styles.appInfoText}>Wellness App v1.0.0</Text>
              <Text style={styles.appInfoSubtext}>Your mindful journey companion</Text>
            </View>
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>

    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    borderRadius: 32,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 32,
    gap: 20,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0A0A0A',
  },
  username: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Urbanist',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Urbanist',
  },
  menuSection: {
    backgroundColor: 'rgba(94, 94, 94, 0.18)',
    borderRadius: 24,
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(228, 198, 127, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Urbanist',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'Urbanist',
  },
  menuItemRight: {
    marginLeft: 8,
  },
  menuArrow: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: 'rgba(94, 94, 94, 0.18)',
    borderRadius: 24,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'Urbanist',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Urbanist',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Urbanist',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  actionSection: {
    gap: 12,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    borderRadius: 100,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.5)',
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
  appInfoSection: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  appInfoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Urbanist',
    fontWeight: '500',
  },
  appInfoSubtext: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.3)',
    fontFamily: 'Urbanist',
    fontWeight: '400',
    marginTop: 4,
  },
});

export default ProfileScreen;