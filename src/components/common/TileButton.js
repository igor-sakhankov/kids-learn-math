import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, SIZING, TYPOGRAPHY, SHADOWS } from '../../utils/constants';

const PALETTES = {
  sky:      { face: COLORS.skyDeep,        lip: '#4FA6CE',      text: COLORS.white },
  grass:    { face: COLORS.grassDeep,      lip: '#3E9A40',      text: COLORS.white },
  path:     { face: COLORS.path,           lip: COLORS.pathDeep, text: COLORS.white },
  purple:   { face: COLORS.softPurpleDeep, lip: '#8A5FB8',      text: COLORS.white },
  mint:     { face: COLORS.mintDeep,       lip: '#3FA07F',      text: COLORS.white },
  yellow:   { face: COLORS.warmYellowDeep, lip: '#C99A1F',      text: COLORS.text  },
  peach:    { face: COLORS.peachDeep,      lip: '#E08848',      text: COLORS.white },
  red:      { face: COLORS.softRedDeep,    lip: COLORS.errorDeep, text: COLORS.white },
};

const TileButton = ({
  title,
  icon,
  subtitle,
  color = 'sky',
  onPress,
  size = 'medium',
  style,
  disabled = false,
}) => {
  const p = PALETTES[color] || PALETTES.sky;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[styles.wrapper, style, disabled && { opacity: 0.5 }]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.face,
            styles[`face_${size}`],
            {
              backgroundColor: p.face,
              borderBottomColor: p.lip,
              borderBottomWidth: pressed ? 2 : 6,
              transform: [{ translateY: pressed ? 4 : 0 }],
            },
          ]}
        >
          {icon ? <Text style={styles[`icon_${size}`]}>{icon}</Text> : null}
          <Text style={[styles[`title_${size}`], { color: p.text }]} numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: p.text }]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...SHADOWS.card,
    borderRadius: SIZING.BORDER_RADIUS.xlarge,
  },
  face: {
    borderRadius: SIZING.BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZING.PADDING.medium,
  },
  face_small: {
    paddingVertical: SIZING.PADDING.medium,
    minHeight: 90,
  },
  face_medium: {
    paddingVertical: SIZING.PADDING.large,
    minHeight: 130,
  },
  face_large: {
    paddingVertical: SIZING.PADDING.xlarge,
    minHeight: 170,
  },
  icon_small: { fontSize: 36, marginBottom: 6 },
  icon_medium: { fontSize: 48, marginBottom: 10 },
  icon_large: { fontSize: 64, marginBottom: 14 },
  title_small: {
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    textAlign: 'center',
  },
  title_medium: {
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    textAlign: 'center',
  },
  title_large: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 4,
    fontSize: TYPOGRAPHY.SIZES.small,
    opacity: 0.9,
    textAlign: 'center',
  },
});

export default TileButton;
