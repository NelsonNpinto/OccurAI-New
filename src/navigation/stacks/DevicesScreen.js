import React from 'react';
import { View, Text } from 'react-native';
import AppContainer from '../../components/AppContainer';

export default function DevicesScreen({ navigation }) {
  return (
    <AppContainer>
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
      }}>
        <Text style={{color: '#fff', fontSize: 24}}>⌚ Devices</Text>
        <Text style={{color: '#aaa', fontSize: 16, marginTop: 8}}>
          Device connections coming soon!
        </Text>
        <Text style={{color: '#666', fontSize: 14, marginTop: 16, textAlign: 'center', paddingHorizontal: 20}}>
          Connect your fitness trackers, smartwatches, and health devices here.
        </Text>
      </View>
    </AppContainer>
  );
}