import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressIndicator = ({ currentPage, totalPages }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalPages }, (_, index) => {
        const isActive = index < currentPage;
        const isCurrent = index === currentPage - 1;
        
        return (
          <View key={index} style={styles.dashContainer}>
            {/* Dashed line segments */}
            <View style={styles.dashGroup}>
              {Array.from({ length: 8 }, (_, dashIndex) => (
                <View
                  key={dashIndex}
                  style={[
                    styles.dash,
                    isActive || isCurrent 
                      ? styles.activeDash 
                      : styles.inactiveDash
                  ]}
                />
              ))}
            </View>
            
            {/* Connection line between segments (except for last one) */}
            {index < totalPages - 1 && (
              <View style={[
                styles.connectionLine,
                isActive ? styles.activeConnection : styles.inactiveConnection
              ]} />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  dashContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dashGroup: {
    flexDirection: 'row',
    gap: 2,
    flex: 1,
  },
  dash: {
    width: 6,
    height: 2,
    borderRadius: 1,
    flex: 1,
  },
  activeDash: {
    backgroundColor: '#E4C67F',
  },
  inactiveDash: {
    backgroundColor: 'rgba(228, 198, 127, 0.3)',
  },
  connectionLine: {
    width: 8,
    height: 2,
    marginHorizontal: 4,
  },
  activeConnection: {
    backgroundColor: '#E4C67F',
  },
  inactiveConnection: {
    backgroundColor: 'rgba(228, 198, 127, 0.3)',
  },
});

export default ProgressIndicator;