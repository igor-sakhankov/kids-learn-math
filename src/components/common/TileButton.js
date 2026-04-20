import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, SIZING, TYPOGRAPHY } from '../../utils/constants';

// "lip" is the darker block that sits offset behind the face, giving a 3D
// stacked-block read. "face" sits on top and translates down/right on press
// to reveal less of the lip — matches the chunky-plastic look of the design.
const PALETTES = {
  sky:      { face: COLORS.skyDeep,        lip: COLORS.skyLip,         text: COLORS.white },
  grass:    { face: COLORS.grassDeep,      lip: COLORS.grassLip,       text: COLORS.white },
  path:     { face: COLORS.path,           lip: COLORS.pathDeep,       text: COLORS.white },
  purple:   { face: COLORS.softPurpleDeep, lip: COLORS.softPurpleLip,  text: COLORS.white },
  mint:     { face: COLORS.mintDeep,       lip: COLORS.mintLip,        text: COLORS.white },
  yellow:   { face: COLORS.warmYellowDeep, lip: COLORS.warmYellowLip,  text: COLORS.text  },
  peach:    { face: COLORS.peachDeep,      lip: COLORS.peachLip,       text: COLORS.white },
  red:      { face: COLORS.softRedDeep,    lip: COLORS.errorDeep,      text: COLORS.white },
};

const OFFSET = 8; // block offset — large enough to read as a shadow block

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
        <View style={[styles.stack, styles[`stack_${size}`]]}>
          <View style={[styles.lip, { backgroundColor: p.lip }]} />
          <View
            style={[
              styles.face,
              styles[`face_${size}`],
              {
                backgroundColor: p.face,
                transform: [
                  { translateX: pressed ? OFFSET - 2 : 0 },
                  { translateY: pressed ? OFFSET - 2 : 0 },
                ],
              },
            ]}
          >
            {icon ? <Text style={styles[`icon_${size}`]}>{icon}</Text> : null}
            <Text
              style={[styles[`title_${size}`], { color: p.text }]}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={[styles.subtitle, { color: p.text }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // wrapper pads out to fit the offset so the lip never clips siblings
    paddingRight: OFFSET,
    paddingBottom: OFFSET,
  },
  stack: {
    position: 'relative',
  },
  stack_small: { height: 120 + OFFSET, width: '100%' },
  stack_medium: { height: 150 + OFFSET, width: '100%' },
  stack_large: { height: 190 + OFFSET, width: '100%' },
  lip: {
    position: 'absolute',
    top: OFFSET,
    left: OFFSET,
    right: 0,
    bottom: 0,
    borderRadius: SIZING.BORDER_RADIUS.xlarge,
  },
  face: {
    borderRadius: SIZING.BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZING.PADDING.medium,
    position: 'absolute',
    top: 0,
    left: 0,
    right: OFFSET,
    bottom: OFFSET,
  },
  face_small: {
    paddingVertical: SIZING.PADDING.medium,
  },
  face_medium: {
    paddingVertical: SIZING.PADDING.large,
  },
  face_large: {
    paddingVertical: SIZING.PADDING.xlarge,
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
    marginTop: 6,
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    opacity: 0.95,
    textAlign: 'center',
  },
});

export default TileButton;
