import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SIZING, SHADOWS } from '../../utils/constants';

// White speech bubble with a directional tail (top | bottom | left).
// Used by the mascot-driven onboarding screens.
const SpeechBubble = ({ children, tailSide = 'bottom', style }) => {
  return (
    <View style={[styles.bubble, style]}>
      {children}
      {tailSide === 'bottom' && <View style={styles.tailBottom} />}
      {tailSide === 'top' && <View style={styles.tailTop} />}
      {tailSide === 'left' && <View style={styles.tailLeft} />}
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: COLORS.white,
    borderRadius: SIZING.BORDER_RADIUS.xlarge,
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderWidth: 2,
    borderColor: COLORS.lightBlue,
    maxWidth: 320,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  tailBottom: {
    position: 'absolute',
    bottom: -12,
    left: '50%',
    marginLeft: -14,
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderTopWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.white,
  },
  tailTop: {
    position: 'absolute',
    top: -14,
    left: '50%',
    marginLeft: -14,
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.white,
  },
  tailLeft: {
    position: 'absolute',
    left: -10,
    top: 22,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 12,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: COLORS.white,
  },
});

export default SpeechBubble;
