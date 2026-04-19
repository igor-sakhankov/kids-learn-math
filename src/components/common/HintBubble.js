import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { t } from '../../utils/i18n';
import { COLORS, SIZING, TYPOGRAPHY, SHADOWS } from '../../utils/constants';

// Gentle hint card shown after repeated wrong attempts (see useAttemptCounter).
// Robot-voiced, warm yellow — never framed as punishment.
const HintBubble = ({ text, label }) => (
  <View style={styles.wrap}>
    <Text style={styles.emoji}>🤖</Text>
    <View style={styles.body}>
      <Text style={styles.label}>{label || `💡 ${t('common.hint')}`}</Text>
      <Text style={styles.text}>{text || t('robot.hint_1')}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warmYellow,
    borderRadius: SIZING.BORDER_RADIUS.large,
    padding: SIZING.PADDING.medium,
    marginVertical: SIZING.MARGIN.small,
    borderWidth: 2,
    borderColor: COLORS.warmYellowDeep,
    ...SHADOWS.soft,
  },
  emoji: {
    fontSize: 40,
    marginRight: SIZING.MARGIN.small,
  },
  body: {
    flex: 1,
  },
  label: {
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  text: {
    fontSize: TYPOGRAPHY.SIZES.body,
    color: COLORS.text,
    lineHeight: 26,
  },
});

export default HintBubble;
