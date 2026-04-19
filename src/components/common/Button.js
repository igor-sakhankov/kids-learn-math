import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { COLORS, SIZING, TYPOGRAPHY, SHADOWS } from '../../utils/constants';

const VARIANT_COLORS = {
  primary:   { face: COLORS.path,           lip: COLORS.pathDeep,       text: COLORS.white },
  secondary: { face: COLORS.grass,          lip: COLORS.grassDeep,      text: COLORS.white },
  success:   { face: COLORS.success,        lip: COLORS.successDeep,    text: COLORS.white },
  error:     { face: COLORS.error,          lip: COLORS.errorDeep,      text: COLORS.white },
  purple:    { face: COLORS.softPurpleDeep, lip: COLORS.softPurpleLip,  text: COLORS.white },
  sky:       { face: COLORS.skyDeep,        lip: COLORS.skyLip,         text: COLORS.white },
  outline:   { face: COLORS.white,          lip: COLORS.path,           text: COLORS.path, outline: true },
};

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const v = VARIANT_COLORS[variant] || VARIANT_COLORS.primary;

  return (
    <Pressable
      onPress={disabled || loading ? undefined : onPress}
      disabled={disabled || loading}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.wrapper, disabled && styles.disabled, style]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.face,
            styles[`face_${size}`],
            {
              backgroundColor: v.face,
              borderBottomColor: v.lip,
              borderBottomWidth: pressed ? 1 : 5,
              transform: [{ translateY: pressed ? 4 : 0 }],
            },
            v.outline && styles.outlineFace,
            v.outline && { borderColor: v.lip },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={v.text} />
          ) : (
            <View style={styles.content}>
              {icon ? (
                <Text style={[styles.icon, styles[`icon_${size}`]]}>{icon}</Text>
              ) : null}
              <Text
                style={[
                  styles.text,
                  styles[`text_${size}`],
                  { color: v.text },
                  textStyle,
                ]}
              >
                {title}
              </Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...SHADOWS.soft,
    borderRadius: SIZING.BORDER_RADIUS.pill,
  },
  disabled: {
    opacity: 0.5,
  },
  face: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZING.BORDER_RADIUS.pill,
    minHeight: SIZING.MIN_TOUCH_TARGET,
    paddingHorizontal: SIZING.PADDING.large,
  },
  outlineFace: {
    borderWidth: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  face_small: {
    paddingVertical: SIZING.PADDING.small,
    paddingHorizontal: SIZING.PADDING.medium,
    minHeight: SIZING.SECONDARY_TARGET,
  },
  face_medium: {
    paddingVertical: SIZING.PADDING.medium,
    paddingHorizontal: SIZING.PADDING.large,
    minHeight: SIZING.MIN_TOUCH_TARGET,
  },
  face_large: {
    paddingVertical: SIZING.PADDING.large,
    paddingHorizontal: SIZING.PADDING.xlarge,
    minHeight: SIZING.PRIMARY_TARGET,
  },
  text: {
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    letterSpacing: 0.3,
  },
  text_small: { fontSize: TYPOGRAPHY.SIZES.body },
  text_medium: { fontSize: TYPOGRAPHY.SIZES.subtitle },
  text_large: { fontSize: TYPOGRAPHY.SIZES.title },
  icon: { marginRight: 10 },
  icon_small: { fontSize: 18 },
  icon_medium: { fontSize: 22 },
  icon_large: { fontSize: 28 },
});

export default Button;
