import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/styles';

const NavigationButtons = ({ 
  currentPage, 
  totalPages, 
  onNext, 
  onPrevious, 
  onSubmit,
  isSubmitting = false 
}) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <View style={styles.container}>
      {!isFirstPage && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onPrevious}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity
        style={[
          styles.nextButton,
          isSubmitting && styles.nextButtonDisabled
        ]}
        onPress={isLastPage ? onSubmit : onNext}
        disabled={isSubmitting}
        activeOpacity={0.7}
      >
        <Text style={styles.nextButtonText}>
          {isSubmitting ? 'Saving...' : isLastPage ? 'Submit' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
  },
  backButton: {
    backgroundColor: 'rgba(94, 94, 94, 0.18)',
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(228, 198, 127, 0.3)',
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    marginLeft: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    color: '#0A0A0A',
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
});

export default NavigationButtons;