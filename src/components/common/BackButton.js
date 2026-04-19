import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import LeaveConfirmModal from './LeaveConfirmModal';
import { COLORS, SIZING, TYPOGRAPHY, SHADOWS } from '../../utils/constants';

// Top-left pill-shaped back button used across every non-root screen.
// Pass `confirm` on lesson/game screens so a stray tap doesn't nuke a child's
// in-progress session.
const BackButton = ({ onPress, confirm = false, label }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePress = () => {
    if (confirm) {
      setShowConfirm(true);
    } else {
      onPress();
    }
  };

  return (
    <>
      <View style={styles.anchor}>
        <Pressable
          onPress={handlePress}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.wrap}
          accessibilityRole="button"
          accessibilityLabel={label || 'Back'}
        >
          {({ pressed }) => (
            <View
              style={[
                styles.pill,
                {
                  transform: [{ translateY: pressed ? 2 : 0 }],
                  borderBottomWidth: pressed ? 1 : 3,
                },
              ]}
            >
              <Text style={styles.arrow}>←</Text>
              {label ? <Text style={styles.label}>{label}</Text> : null}
            </View>
          )}
        </Pressable>
      </View>
      {confirm && (
        <LeaveConfirmModal
          visible={showConfirm}
          onStay={() => setShowConfirm(false)}
          onLeave={() => {
            setShowConfirm(false);
            onPress();
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    top: SIZING.PADDING.medium,
    left: SIZING.PADDING.medium,
    zIndex: 10,
  },
  wrap: {
    ...SHADOWS.soft,
    borderRadius: SIZING.BORDER_RADIUS.pill,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZING.BORDER_RADIUS.pill,
    minHeight: SIZING.SECONDARY_TARGET,
    minWidth: SIZING.SECONDARY_TARGET,
    paddingHorizontal: SIZING.PADDING.medium,
    borderBottomColor: COLORS.pressShadow,
    borderBottomWidth: 3,
  },
  arrow: {
    fontSize: 28,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    lineHeight: 30,
  },
  label: {
    marginLeft: 8,
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
  },
});

export default BackButton;
