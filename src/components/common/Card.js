import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZING, TYPOGRAPHY, SHADOWS } from '../../utils/constants';

const VARIANT_STYLES = {
  default: { backgroundColor: COLORS.white },
  overlay: { backgroundColor: COLORS.overlay },
  primary: { backgroundColor: COLORS.lightBlue },
  success: { backgroundColor: COLORS.mint },
  warm: { backgroundColor: COLORS.warmYellow },
  peach: { backgroundColor: COLORS.peach },
  purple: { backgroundColor: COLORS.softPurple },
};

const BAND_COLORS = {
  sky: COLORS.skyDeep,
  grass: COLORS.grassDeep,
  path: COLORS.pathDeep,
  purple: COLORS.softPurpleDeep,
  mint: COLORS.mintDeep,
  peach: COLORS.peachDeep,
};

const Card = ({
  children,
  onPress,
  style,
  variant = 'default',
  padding = true,
  band,
  bandTitle,
  bandIcon,
}) => {
  const Container = onPress ? TouchableOpacity : View;
  const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.default;

  return (
    <Container
      style={[styles.card, variantStyle, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
    >
      {band && (
        <View style={[styles.band, { backgroundColor: BAND_COLORS[band] || band }]}>
          {bandIcon ? <Text style={styles.bandIcon}>{bandIcon}</Text> : null}
          {bandTitle ? <Text style={styles.bandTitle}>{bandTitle}</Text> : null}
        </View>
      )}
      <View style={padding ? styles.body : null}>{children}</View>
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZING.BORDER_RADIUS.large,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  body: {
    padding: SIZING.PADDING.large,
  },
  band: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZING.PADDING.large,
    paddingVertical: SIZING.PADDING.medium,
  },
  bandIcon: {
    fontSize: 26,
    marginRight: SIZING.MARGIN.small,
  },
  bandTitle: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    letterSpacing: 0.3,
  },
});

export default Card;
