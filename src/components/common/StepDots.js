import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';

const StepDots = ({ total, current }) => {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current;
        const isPast = i < current;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: isActive ? 28 : 10,
                backgroundColor: isActive
                  ? COLORS.pathDeep
                  : isPast
                  ? COLORS.grassDeep
                  : 'rgba(42,53,71,0.18)',
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 999,
  },
});

export default StepDots;
