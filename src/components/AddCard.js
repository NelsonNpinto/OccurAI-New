import React from 'react';
import { View, Text } from 'react-native';
import { appStyles } from '../styles/styles';
import Add from '../../utils/icons/addStreaks.svg';

const AddCard = () => {
  return (
    <View
      style={[
        appStyles.card,
        {
          width: '48%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 20,
          padding: 16,
          shadowColor: '#FFFFFF',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.04,
          shadowRadius: 32,
          borderWidth: 0,
          height: 180, // consistent height
          justifyContent: 'center',
          alignItems: 'center', 
        },
      ]}>
      
      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            backgroundColor: 'rgba(227, 199, 127, 0.6)',
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
          }}>
          <Add width={20} height={20} color="#FFFFFF" />
        </View>
        <Text
          style={[
            appStyles.textMedium,
            { color: '#FFFFFF', fontSize: 16, textAlign: 'center' },
          ]}>
          Add
        </Text>
      </View>
    </View>
  );
};

export default AddCard;