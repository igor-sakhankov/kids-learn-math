import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, SIZING, TYPOGRAPHY, SHADOWS } from '../../utils/constants';

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['delete', '0', 'submit'],
];

const PadKey = ({ label, kind = 'digit', onPress, disabled }) => {
  const palette =
    kind === 'submit'
      ? { face: COLORS.success, lip: COLORS.successDeep, text: COLORS.white }
      : kind === 'delete'
      ? { face: COLORS.softRed, lip: COLORS.softRedDeep, text: COLORS.errorDeep }
      : { face: COLORS.white, lip: COLORS.skyDeep, text: COLORS.text };

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={styles.keyWrap}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.key,
            {
              backgroundColor: palette.face,
              borderBottomColor: palette.lip,
              borderBottomWidth: pressed ? 1 : 4,
              transform: [{ translateY: pressed ? 3 : 0 }],
              opacity: disabled ? 0.4 : 1,
            },
          ]}
        >
          <Text style={[styles.keyText, { color: palette.text }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
};

const NumberPad = ({ value, onChange, onSubmit, disabled = false, maxLength = 3 }) => {
  const handleDigit = (d) => {
    if (disabled) return;
    if ((value || '').length >= maxLength) return;
    onChange(((value || '') + d).slice(0, maxLength));
  };

  const handleDelete = () => {
    if (disabled) return;
    onChange((value || '').slice(0, -1));
  };

  const handleSubmit = () => {
    if (disabled) return;
    if (!value) return;
    onSubmit && onSubmit();
  };

  return (
    <View style={styles.pad}>
      {KEYS.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((k) => {
            if (k === 'delete') {
              return (
                <PadKey
                  key={k}
                  label="⌫"
                  kind="delete"
                  onPress={handleDelete}
                  disabled={disabled || !value}
                />
              );
            }
            if (k === 'submit') {
              return (
                <PadKey
                  key={k}
                  label="✓"
                  kind="submit"
                  onPress={handleSubmit}
                  disabled={disabled || !value}
                />
              );
            }
            return (
              <PadKey
                key={k}
                label={k}
                kind="digit"
                onPress={() => handleDigit(k)}
                disabled={disabled}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  pad: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  keyWrap: {
    flex: 1,
    ...SHADOWS.soft,
    borderRadius: SIZING.BORDER_RADIUS.large,
  },
  key: {
    minHeight: 60,
    borderRadius: SIZING.BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: TYPOGRAPHY.SIZES.heading,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
  },
});

export default NumberPad;
