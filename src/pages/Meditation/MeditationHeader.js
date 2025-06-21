import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ArrowLeft from '../../../utils/icons/leftArrow.svg';
import { colors } from '../../styles/styles';


const MeditationHeader = ({ title, onBackPress }) => {
  return (
    <View style={styles.header}>
       <TouchableOpacity 
          style={styles.iconButton}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <ArrowLeft 
            width={20} 
            height={20} 
            stroke={colors.primary} 
            strokeWidth={2} 
            fill="none" 
          />
        </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(255, 255, 255, 0.04)',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 32,
  },
  backIcon: {
    color: '#E4C782',
    fontSize: 20,
    fontWeight: '400',
    marginLeft: -2,
  },
  title: {
    color: '#E4C782',
    fontSize: 18,
    fontFamily: 'Urbanist',
    fontWeight: '500',
  },
  placeholder: {
    width: 40,
  },
});

export default MeditationHeader