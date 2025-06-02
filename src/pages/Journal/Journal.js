import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { appStyles } from '../../styles/styles';
import JournalHeader from '../../components/JournalHeader';
import JournalReflection from './JournalReflection';
import AppContainer from '../../components/AppContainer';

const Journal = ({ navigation }) => {
  const handleContinue = () => {
    // Add your continue logic here
    console.log('Continue pressed');
    // For example: navigation.navigate('NextScreen');
  };

  return (
    <AppContainer>
      <SafeAreaView style={[appStyles.safeArea, { flex: 1 }]}>
        {/* Content area that will be scrollable */}
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[appStyles.scrollContent, { paddingBottom: 100 }]}
            showsVerticalScrollIndicator={false}>
            
            <JournalHeader 
              onBackPress={() => navigation.goBack()}
              onCalendarPress={() => console.log('Calendar pressed')}
            />
            
            {/* Pass navigation prop to JournalReflection */}
            <JournalReflection navigation={navigation} />
            
          </ScrollView>
        </View>

        {/* Fixed button at bottom */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  // Button Container
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  // Continue Button
  continueButton: {
    backgroundColor: '#E4C67F',
    borderRadius: 100,
    paddingHorizontal: 30,
    paddingVertical: 15,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
});

export default Journal;