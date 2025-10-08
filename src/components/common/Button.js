import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SIZING, TYPOGRAPHY } from '../../utils/constants';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    disabled && styles.button_disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${size}`],
    disabled && styles.text_disabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZING.BORDER_RADIUS.medium,
    paddingVertical: SIZING.PADDING.medium,
    paddingHorizontal: SIZING.PADDING.large,
    minHeight: SIZING.MIN_TOUCH_TARGET,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  button_primary: {
    backgroundColor: COLORS.path,
  },
  button_secondary: {
    backgroundColor: COLORS.grass,
  },
  button_success: {
    backgroundColor: COLORS.success,
  },
  button_error: {
    backgroundColor: COLORS.error,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.path,
  },
  button_small: {
    paddingVertical: SIZING.PADDING.small,
    paddingHorizontal: SIZING.PADDING.medium,
  },
  button_medium: {
    paddingVertical: SIZING.PADDING.medium,
    paddingHorizontal: SIZING.PADDING.large,
  },
  button_large: {
    paddingVertical: SIZING.PADDING.large,
    paddingHorizontal: SIZING.PADDING.large + 10,
  },
  button_disabled: {
    opacity: 0.5,
  },
  text: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
  },
  text_small: {
    fontSize: TYPOGRAPHY.SIZES.body,
  },
  text_medium: {
    fontSize: TYPOGRAPHY.SIZES.subtitle,
  },
  text_large: {
    fontSize: TYPOGRAPHY.SIZES.title,
  },
  text_disabled: {
    color: COLORS.white,
  },
});

export default Button;

