import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../utils/i18n';
import ScreenBackground from '../components/common/ScreenBackground';
import StepDots from '../components/common/StepDots';
import {
  COLORS,
  SIZING,
  TYPOGRAPHY,
  SHADOWS,
  STORAGE_KEYS,
} from '../utils/constants';
import { saveData } from '../utils/storage';

const PLACEMENT_QUESTIONS = [
  {
    promptKey: 'onboarding.placement_q1',
    emoji: '🍎',
    tint: 'mint',
    options: [
      { n: 2, correct: false },
      { n: 4, correct: true },
    ],
  },
  {
    promptKey: 'onboarding.placement_q2',
    tint: 'sunrise',
    options: [
      { label: '4', correct: false },
      { label: '5', correct: true },
      { label: '6', correct: false },
    ],
  },
  {
    promptKey: 'onboarding.placement_q3',
    tint: 'lavender',
    options: [
      { label: '7', correct: false },
      { label: '8', correct: true },
      { label: '10', correct: false },
    ],
  },
];

const TOTAL = PLACEMENT_QUESTIONS.length;

const PileCard = ({ n, emoji, state, onPress }) => {
  const [pressed, setPressed] = useState(false);
  const rows = n <= 3 ? 1 : 2;
  const perRow = Math.ceil(n / rows);
  const face =
    state === 'right'
      ? COLORS.mint
      : state === 'wrong'
      ? COLORS.softRed
      : COLORS.white;

  const items = [];
  for (let r = 0; r < rows; r++) {
    const rowItems = [];
    for (let c = 0; c < perRow && r * perRow + c < n; c++) {
      rowItems.push(
        <Text key={`${r}-${c}`} style={styles.pileEmoji}>
          {emoji}
        </Text>
      );
    }
    items.push(
      <View key={r} style={styles.pileRow}>
        {rowItems}
      </View>
    );
  }

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      disabled={state !== 'idle'}
      style={[
        styles.pile,
        {
          backgroundColor: face,
          borderBottomWidth: pressed ? 2 : 6,
          transform: [{ translateY: pressed ? 4 : 0 }],
          opacity: state === 'dim' ? 0.55 : 1,
        },
      ]}
    >
      <View style={styles.pileEmojis}>{items}</View>
      <Text style={styles.pileNumber}>{n}</Text>
    </Pressable>
  );
};

const ChoiceChip = ({ label, state, onPress }) => {
  const [pressed, setPressed] = useState(false);
  const face =
    state === 'right'
      ? COLORS.mintDeep
      : state === 'wrong'
      ? COLORS.softRedDeep
      : COLORS.white;
  const lip =
    state === 'right'
      ? COLORS.mintLip
      : state === 'wrong'
      ? '#CC6A60'
      : COLORS.skyLip;
  const color = state === 'idle' ? COLORS.text : COLORS.white;

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      disabled={state !== 'idle'}
      style={[
        styles.chip,
        {
          backgroundColor: face,
          borderBottomColor: lip,
          borderBottomWidth: pressed ? 2 : 6,
          transform: [{ translateY: pressed ? 4 : 0 }],
          opacity: state === 'dim' ? 0.5 : 1,
        },
      ]}
    >
      <Text style={[styles.chipLabel, { color }]}>{label}</Text>
    </Pressable>
  );
};

const PlacementScreen = ({ navigation, route }) => {
  const step = route.params?.step ?? 0;
  const correctCount = route.params?.correctCount ?? 0;

  const q = PLACEMENT_QUESTIONS[step];

  const [chosenIdx, setChosenIdx] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    setChosenIdx(null);
    setFeedback(null);
  }, [step]);

  const pick = (idx) => {
    if (chosenIdx != null) return;
    const right = q.options[idx].correct;
    setChosenIdx(idx);
    setFeedback(right ? 'right' : 'wrong');
    setTimeout(() => {
      const nextCorrect = correctCount + (right ? 1 : 0);
      const nextStep = step + 1;
      if (nextStep < TOTAL) {
        navigation.replace('Placement', {
          step: nextStep,
          correctCount: nextCorrect,
        });
      } else {
        const level = nextCorrect === 0 ? 1 : nextCorrect === 1 ? 1 : nextCorrect === 2 ? 2 : 3;
        navigation.replace('Ready', { level });
      }
    }, 950);
  };

  const skipToReady = async () => {
    await saveData(STORAGE_KEYS.HAS_SEEN_WELCOME, true);
    navigation.replace('MainMenu');
  };

  const stateFor = (i) => {
    if (chosenIdx == null) return 'idle';
    if (chosenIdx === i) return q.options[i].correct ? 'right' : 'wrong';
    return 'dim';
  };

  return (
    <ScreenBackground tint={q.tint}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.topRow}>
          <View style={{ flex: 1 }} />
          <StepDots total={5} current={1 + step} />
          <View style={styles.skipWrap}>
            <Pressable
              onPress={skipToReady}
              hitSlop={8}
              style={styles.skipPill}
              accessibilityRole="button"
              accessibilityLabel={t('onboarding.skip')}
            >
              <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.promptRow}>
            <View style={styles.miniRing}>
              <Image
                source={require('../../assets/professor-corgi.jpeg')}
                style={styles.miniMascot}
              />
            </View>
            <View style={styles.promptBubble}>
              <Text style={styles.promptLabel}>
                {t('onboarding.lets_play_label')}
              </Text>
              <Text style={styles.promptText}>{t(q.promptKey)}</Text>
              <View style={styles.promptTail} />
            </View>
          </View>

          <View style={styles.optionsWrap}>
            {q.emoji ? (
              <View style={styles.piles}>
                {q.options.map((o, i) => (
                  <PileCard
                    key={i}
                    n={o.n}
                    emoji={q.emoji}
                    state={stateFor(i)}
                    onPress={() => pick(i)}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.chips}>
                {q.options.map((o, i) => (
                  <ChoiceChip
                    key={i}
                    label={o.label}
                    state={stateFor(i)}
                    onPress={() => pick(i)}
                  />
                ))}
              </View>
            )}
          </View>

          <View style={styles.feedbackWrap}>
            {feedback === 'right' ? (
              <Text style={[styles.feedbackText, { color: COLORS.successDeep }]}>
                {t('onboarding.feedback_right')}
              </Text>
            ) : feedback === 'wrong' ? (
              <Text style={[styles.feedbackText, { color: COLORS.pathDeep }]}>
                {t('onboarding.feedback_wrong')}
              </Text>
            ) : (
              <Text style={styles.feedbackHint}>
                {t('onboarding.tap_hint')}
              </Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 18,
    paddingHorizontal: SIZING.PADDING.medium,
  },
  skipWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },
  skipPill: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: SIZING.BORDER_RADIUS.pill,
  },
  skipText: {
    fontSize: TYPOGRAPHY.SIZES.tiny,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.textSoft,
  },
  body: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 42,
    paddingBottom: 24,
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  miniRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.white,
    padding: 4,
    ...SHADOWS.card,
  },
  miniMascot: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  promptBubble: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SIZING.BORDER_RADIUS.large,
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...SHADOWS.soft,
  },
  promptLabel: {
    fontSize: 13,
    color: COLORS.pathDeep,
    marginBottom: 2,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  promptText: {
    fontSize: 17,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    lineHeight: 22,
    color: COLORS.text,
  },
  promptTail: {
    position: 'absolute',
    left: -10,
    top: 22,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 12,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: COLORS.white,
  },
  optionsWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  piles: {
    flexDirection: 'row',
    gap: 14,
  },
  pile: {
    flex: 1,
    borderRadius: SIZING.BORDER_RADIUS.large,
    padding: 14,
    borderBottomColor: COLORS.skyLip,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    ...SHADOWS.card,
  },
  pileEmojis: {
    alignItems: 'center',
  },
  pileRow: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
  pileEmoji: {
    fontSize: 28,
  },
  pileNumber: {
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    fontSize: 22,
    marginTop: 4,
    color: COLORS.text,
  },
  chips: {
    flexDirection: 'row',
    gap: 12,
  },
  chip: {
    flex: 1,
    height: 96,
    borderRadius: SIZING.BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  chipLabel: {
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    fontSize: 38,
  },
  feedbackWrap: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackText: {
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    fontSize: 20,
    textAlign: 'center',
  },
  feedbackHint: {
    fontSize: 14,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.textSoft,
    textAlign: 'center',
  },
});

export default PlacementScreen;
