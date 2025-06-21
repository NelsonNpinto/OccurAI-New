import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import StopIcon from '../../../utils/icons/cross.svg';
import PlayIcon from '../../../utils/icons/play.svg';
import PauseIcon from '../../../utils/icons/pause.svg';
import ResetIcon from '../../../utils/icons/reset.svg';

const MeditationFooter = ({ 
  isPlaying, 
  onPlayPause, 
  onStop, 
  onRestart 
}) => {
  return (
    <View style={styles.footer}>
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={onStop} style={styles.controlButtonLeft}>
          <View style={styles.iconContainer}>
            <StopIcon color="#E4C782" size={20} />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onPlayPause} style={styles.controlButton}>
          <View style={styles.iconContainer}>
            {isPlaying ? (
              <PauseIcon color="#E4C67F" size={24} />
            ) : (
              <PlayIcon color="#E4C67F" size={24} />
            )}
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onRestart} style={styles.controlButtonRight}>
          <View style={styles.iconContainer}>
            <ResetIcon color="#E4C782" size={20} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  controlsContainer: {
    flexDirection: 'row', 
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
    shadowColor: 'rgba(255, 255, 255, 0.04)',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 32,
  },
  controlButton: {
    flex: 1,
    alignItems: 'center',
  },
  controlButtonLeft: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  controlButtonRight: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(255, 255, 255, 0.04)',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 32,
  },
});

export default MeditationFooter;