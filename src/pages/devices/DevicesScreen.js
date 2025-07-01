import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {Svg, Path} from 'react-native-svg';

// Import your assets (replace with actual paths)
import WatchImage from '../../../utils/icons/watch.svg';
import DrumSVG from '../../../utils/icons/device/Stage.svg';
import WatchLogo from '../../../utils/icons/device/watchlogo.svg';
import BatteryLogo from '../../../utils/icons/device/battrey.svg';
import AppContainer from '../../components/AppContainer';
import MainHeader from '../../components/MainHeader';

const DeviceScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Your Device');

  const BackArrowIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke="#E4C67F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const LocationIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.029 7.029 1 12 1S21 5.029 21 10Z"
        stroke="#E4C67F"
        strokeWidth="2"
      />
      <Path
        d="M12 13C13.657 13 15 11.657 15 10C15 8.343 13.657 7 12 7C10.343 7 9 8.343 9 10C9 11.657 10.343 13 12 13Z"
        stroke="#E4C67F"
        strokeWidth="2"
      />
    </Svg>
  );

  return (
    <AppContainer>
      {/* Header */}
      <MainHeader
        type="journal"
        title="Device"
        subtitle="Occur Watch S1"
        hideCalendar={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Watch Display */}
        <View style={styles.watchContainer}>
          {/* Circular platform */}
          <View style={styles.platformContainer}>
            <View style={styles.platform}>
              {/* Add your DrumSVG component here */}
              <View style={styles.drumContainer}>
                <DrumSVG width={280} height={60} />
                <View style={styles.drumPlaceholder} />
              </View>
            </View>

            {/* Watch Image */}
            <View style={styles.watchImageContainer}>
              <WatchImage />
              {/* Fallback placeholder if image doesn't load */}
              <View style={styles.watchImagePlaceholder} />
            </View>
          </View>
        </View>

        {/* Tab Buttons */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'Your Device' && styles.activeTab,
            ]}
            onPress={() => setSelectedTab('Your Device')}>
            <Text
              style={[
                styles.tabText,
                selectedTab === 'Your Device' && styles.activeTabText,
              ]}>
              Your Device
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'Explore Watch' && styles.activeTab,
            ]}
            onPress={() => setSelectedTab('Explore Watch')}>
            <Text
              style={[
                styles.tabText,
                selectedTab === 'Explore Watch' && styles.activeTabText,
              ]}>
              Explore Watch
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Cards */}
        <View style={styles.cardsContainer}>
          {/* Watch Status Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <WatchLogo width={24} height={24} />
                <View style={styles.iconPlaceholder} />
              </View>
            </View>
            <Text style={styles.cardTitle}>Occur Watch</Text>
            <Text style={styles.cardSubtitle}>Connected</Text>
          </View>

          {/* Battery Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <BatteryLogo width={24} height={24} />
                <View style={styles.iconPlaceholder} />
              </View>
            </View>
            <Text style={styles.cardTitle}>Watch Battery</Text>
            <Text style={styles.cardSubtitle}>Fully Charged</Text>
            <Text style={styles.batteryPercentage}>100%</Text>
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.locationContainer}>
          <Text style={styles.locationTitle}>Watch Location</Text>
          <Text style={styles.locationSubtitle}>
            Vile Parle, Mumbai Suburban
          </Text>

          {/* Map Container */}
          <View style={styles.mapContainer}>
            {/* Placeholder for map - you can integrate actual map component */}
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapText}>Map View</Text>
              <View style={styles.locationPin}>
                <LocationIcon />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E4C67F',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  watchContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 20,
  },
  platformContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  platform: {
    width: 280,
    height: 60,
    borderRadius: 140,
    backgroundColor: 'rgba(68, 68, 68, 0.8)',
    borderWidth: 1,
    borderColor: '#E4C67F',
    shadowColor: '#E4C67F',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  drumContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drumPlaceholder: {
    width: 260,
    height: 40,
    borderRadius: 130,
    backgroundColor: 'rgba(34, 34, 34, 0.8)',
  },
  watchImageContainer: {
    position: 'absolute',
    top: -120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchImage: {
    width: 200,
    height: 200,
  },
  watchImagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 20,
    backgroundColor: 'rgba(228, 198, 127, 0.1)',
    borderWidth: 2,
    borderColor: '#E4C67F',
    position: 'absolute',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    borderRadius: 100,
    padding: 4,
    marginBottom: 30,
    // Note: backdropFilter not directly supported in React Native
    // You may need to use a BlurView component for the blur effect
  },
  tabButton: {
    width: 120,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#765A19',
    // Note: Linear gradients would need react-native-linear-gradient
    // Using solid color as fallback
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'DM Sans', // Make sure this font is available in your app
    lineHeight: 20,
  },
  activeTabText: {
    color: 'white',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 15,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(68, 68, 68, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(228, 198, 127, 0.2)',
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(228, 198, 127, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  batteryPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E4C67F',
    textAlign: 'right',
  },
  locationContainer: {
    backgroundColor: 'rgba(68, 68, 68, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(228, 198, 127, 0.2)',
    marginBottom: 30,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  locationSubtitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
  },
  mapContainer: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(34, 34, 34, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapText: {
    color: '#888',
    fontSize: 14,
  },
  locationPin: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default DeviceScreen;
