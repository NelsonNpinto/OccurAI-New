import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const JournalSummaryScreen = ({ visible, onEditJournal, onClose }) => {
  if (!visible) return null;

  return (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        
        <Text style={styles.summaryTitle}>
          Great Work! You completed your journal
        </Text>
        
        <Text style={styles.summarySubtitle}>
          You're on a roll with your 19 day streak 🔥
        </Text>
        
        <TouchableOpacity 
          style={styles.editJournalButton}
          onPress={onEditJournal}
        >
          <Text style={styles.editJournalText}>Edit Journal</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Aarya's Insight</Text>
        
        <LinearGradient
          colors={['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4']}
          style={styles.insightOrb}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        >
          {/* Colorful gradient orb effect */}
          <View style={styles.innerOrb}>
            <View style={styles.glowEffect} />
          </View>
        </LinearGradient>
        
        <Text style={styles.insightText}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book when an unknown printer of type and
        </Text>
      </View>
      
      {/* Close button or navigate back option */}
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={onClose}
      >
        <Text style={styles.closeButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
    justifyContent: 'center',
    gap: 20,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  summaryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E4C67F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkmark: {
    color: '#1A1A1A',
    fontSize: 30,
    fontWeight: 'bold',
  },
  summaryTitle: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Urbanist',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  summarySubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 20,
  },
  editJournalButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E4C67F',
    borderRadius: 100,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  editJournalText: {
    color: '#E4C67F',
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
  insightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  insightTitle: {
    color: '#E4C67F',
    fontSize: 18,
    fontFamily: 'Urbanist',
    fontWeight: '600',
    marginBottom: 20,
  },
  insightOrb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E4C67F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  innerOrb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowEffect: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  insightText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: '#E4C67F',
    borderRadius: 100,
    paddingHorizontal: 30,
    paddingVertical: 15,
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
});

export default JournalSummaryScreen;