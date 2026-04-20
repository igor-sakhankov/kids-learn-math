import React from 'react';
import { View, Text, Modal, StyleSheet, Pressable } from 'react-native';
import Button from './Button';
import { t } from '../../utils/i18n';
import { COLORS, SIZING, TYPOGRAPHY, SHADOWS } from '../../utils/constants';

// Reusable end-of-lesson celebration, shown by any learning/game flow that
// reports a score out of a total. Medal bucket mirrors the bronze/silver/gold
// read from the design; +1 Leaf chip echoes the Tree of Reason reward.
//
// Intentionally a modal, not a navigation target, so every flow can drop it in
// without plumbing extra routes.

const medalFor = (pct) => (pct >= 0.9 ? '🏆' : pct >= 0.6 ? '🥈' : '🥉');

const LessonCompleteModal = ({
  visible,
  score = 0,
  total = 10,
  color = 'grass',
  onAgain,
  onContinue,
}) => {
  const pct = total > 0 ? score / total : 0;
  const medal = medalFor(pct);
  const subtitleKey =
    pct >= 0.9
      ? 'lesson_complete.perfect'
      : pct >= 0.6
      ? 'lesson_complete.great'
      : 'lesson_complete.keep_growing';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onContinue}>
      <Pressable style={styles.backdrop} onPress={onContinue}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.medal}>{medal}</Text>
          <Text style={styles.title}>{t('lesson_complete.title')}</Text>
          <Text style={styles.score}>
            {score} / {total}
          </Text>
          <Text style={styles.subtitle}>{t(subtitleKey)}</Text>

          <View style={styles.leafPill}>
            <Text style={styles.leafIcon}>🍃</Text>
            <Text style={styles.leafText}>{t('lesson_complete.leaf_earned')}</Text>
          </View>

          <View style={styles.buttons}>
            <Button
              title={t('lesson_complete.again')}
              onPress={onAgain}
              variant="outline"
              size="medium"
              style={styles.btn}
            />
            <Button
              title={t('common.continue')}
              onPress={onContinue}
              variant={color === 'path' ? 'primary' : 'secondary'}
              size="medium"
              style={styles.btn}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 42, 68, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZING.PADDING.large,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZING.BORDER_RADIUS.xlarge,
    padding: SIZING.PADDING.xlarge,
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
    ...SHADOWS.pop,
  },
  medal: {
    fontSize: 84,
    marginBottom: SIZING.MARGIN.small,
  },
  title: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
  },
  score: {
    fontSize: TYPOGRAPHY.SIZES.heading,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.grassDeep,
    marginTop: 6,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.SIZES.body,
    color: COLORS.textSoft,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: SIZING.MARGIN.medium,
  },
  leafPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgMint,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: SIZING.BORDER_RADIUS.pill,
    marginBottom: SIZING.MARGIN.large,
    ...SHADOWS.soft,
  },
  leafIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  leafText: {
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
  },
  buttons: {
    flexDirection: 'row',
    gap: SIZING.MARGIN.medium,
  },
  btn: {
    minWidth: 130,
  },
});

export default LessonCompleteModal;
