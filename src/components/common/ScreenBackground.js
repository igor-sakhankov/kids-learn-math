import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';

const TINTS = {
  sky: {
    bg: COLORS.bgSky,
    bubbles: ['#FFFFFF', COLORS.warmYellow, COLORS.mint, COLORS.softPurple],
  },
  mint: {
    bg: COLORS.bgMint,
    bubbles: ['#FFFFFF', COLORS.warmYellow, COLORS.lightBlue, COLORS.peach],
  },
  sunrise: {
    bg: COLORS.bgSunrise,
    bubbles: ['#FFFFFF', COLORS.peach, COLORS.softRed, COLORS.mint],
  },
  lavender: {
    bg: COLORS.bgLavender,
    bubbles: ['#FFFFFF', COLORS.softPurple, COLORS.warmYellow, COLORS.mint],
  },
  teal: {
    bg: COLORS.bgTeal,
    bubbles: ['#FFFFFF', COLORS.mint, COLORS.sky, COLORS.warmYellow],
  },
  rose: {
    bg: COLORS.bgRose,
    bubbles: ['#FFFFFF', COLORS.softRed, COLORS.peach, COLORS.softPurple],
  },
  lemon: {
    bg: COLORS.bgLemon,
    bubbles: ['#FFFFFF', COLORS.warmYellow, COLORS.peach, COLORS.mint],
  },
};

const BUBBLES = [
  { size: 180, top: -50,  left: -60,  opacity: 0.75 },
  { size: 120, top: 80,   right: -40, opacity: 0.6  },
  { size: 90,  bottom: 140, left: -30, opacity: 0.65 },
  { size: 140, bottom: -60, right: -50, opacity: 0.7  },
];

const ScreenBackground = ({ tint = 'sky', children, style }) => {
  const { bg, bubbles } = TINTS[tint] || TINTS.sky;

  return (
    <View style={[styles.root, { backgroundColor: bg }, style]}>
      <StatusBar barStyle="dark-content" backgroundColor={bg} />
      {BUBBLES.map((b, i) => (
        <View
          key={i}
          pointerEvents="none"
          style={[
            styles.bubble,
            {
              width: b.size,
              height: b.size,
              borderRadius: b.size / 2,
              top: b.top,
              left: b.left,
              right: b.right,
              bottom: b.bottom,
              backgroundColor: bubbles[i % bubbles.length],
              opacity: b.opacity,
            },
          ]}
        />
      ))}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
  },
  content: {
    flex: 1,
  },
});

export default ScreenBackground;
