import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  StatusBar,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';

// Import your logo SVG - you'll need to replace this import
import SuccessLogo from '../../../utils/icons/SuccessLogo.svg'; // Replace with your actual logo path

const JournalSuccessModal = ({visible, onDone, onClose, streakDays = 19}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}>
      <StatusBar
        backgroundColor="rgba(0, 0, 0, 0.9)"
        barStyle="light-content"
      />

      <View style={styles.modalOverlay}>
        <View style={StyleSheet.absoluteFill}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={30}
          />
        </View>

        {/* Main content container */}
        <View style={styles.contentContainer}>
          <View style={styles.mainContent}>
            <View style={styles.successIconContainer}>
              <View style={styles.successIconOuter}>
                <View style={styles.successIconInner}>
                  <SuccessLogo width={60} height={60} />
                </View>
              </View>
            </View>

            {/* Text content */}
            <View style={styles.textContainer}>
              <Text style={styles.successTitle}>
                You have successfully journaled your day
              </Text>
              <Text style={styles.successSubtitle}>
                Keep this streak on! You are on {streakDays}th day roll.
              </Text>
            </View>
          </View>

          {/* Done button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={onDone}
            activeOpacity={0.8}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 76,
    paddingBottom: 88,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  mainContent: {
    width: 320,
    alignItems: 'center',
    marginTop: 200, // Optional: space from top
  },

  // Success icon container - matching Figma design exactly
  successIconContainer: {
    width: 180,
    height: 180,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconOuter: {
    width: 180,
    height: 180,
    backgroundColor: 'rgba(228, 198, 127, 0.32)',
    borderRadius: 90,
    borderWidth: 12.73,
    borderColor: '#E4C67F',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  successIconInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Fallback checkmark if no logo
  checkmark: {
    color: '#E4C67F',
    fontSize: 60,
    fontWeight: 'bold',
  },

  textContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 4,
  },
  successTitle: {
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    fontFamily: 'Urbanist',
    fontWeight: '800',
    lineHeight: 28,
  },
  successSubtitle: {
    width: '100%',
    textAlign: 'center',
    color: '#7A7A7A',
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontWeight: '400',
    lineHeight: 16,
  },

  doneButton: {
    width: '100%',
    backgroundColor: '#E4C67F',
    borderRadius: 100,
    paddingHorizontal: 40,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default JournalSuccessModal;