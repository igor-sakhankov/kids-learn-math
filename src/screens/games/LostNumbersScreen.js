import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../../utils/i18n';
import { generateSequence, generateOptions } from '../../utils/questionGenerator';
import { useProgress } from '../../contexts/ProgressContext';
import { useReward } from '../../contexts/RewardContext';
import ScreenBackground from '../../components/common/ScreenBackground';
import DifficultyPicker from '../../components/common/DifficultyPicker';
import BackButton from '../../components/common/BackButton';
import HintBubble from '../../components/common/HintBubble';
import useAttemptCounter from '../../hooks/useAttemptCounter';
import { COLORS, SIZING, TYPOGRAPHY, SHADOWS } from '../../utils/constants';

// Four per-option color variants keep choices distinguishable without
// relying on reading the number alone.
const OPTION_PALETTES = [
  { face: COLORS.skyDeep, lip: '#4FA6CE' },
  { face: COLORS.mintDeep, lip: '#3FA07F' },
  { face: COLORS.softPurpleDeep, lip: '#8A5FB8' },
  { face: COLORS.peachDeep, lip: '#E08848' },
];

const TOTAL_ROUNDS = 5;

const LostNumbersScreen = ({ navigation }) => {
  const [difficulty, setDifficulty] = useState(null);
  const [sequence, setSequence] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentMissingIndex, setCurrentMissingIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [roundCount, setRoundCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [sessionStart] = useState(Date.now());

  const { recordAttempt, completeGame } = useProgress();
  const { addSparks } = useReward();
  const { showHint, registerAttempt, reset: resetAttempts } = useAttemptCounter();

  const selectDifficulty = (level) => {
    setDifficulty(level);
    loadNewSequence(level);
  };

  const loadNewSequence = (level) => {
    const newSequence = generateSequence(level);
    setSequence(newSequence);
    setOptions(
      generateOptions(newSequence.answers[0], 4).sort((a, b) => a - b),
    );
    setSelectedAnswers([]);
    setCurrentMissingIndex(0);
    setFeedback(null);
    resetAttempts();
  };

  const refreshOptions = (seq, idx) => {
    setOptions(generateOptions(seq.answers[idx], 4).sort((a, b) => a - b));
  };

  const handleNumberSelect = async (number) => {
    const correctAnswer = sequence.answers[currentMissingIndex];
    const isCorrect = number === correctAnswer;

    await recordAttempt('sequence', isCorrect, difficulty);
    registerAttempt(isCorrect);

    if (isCorrect) {
      const newAnswers = [...selectedAnswers, number];
      setSelectedAnswers(newAnswers);
      setFeedback('correct');

      if (currentMissingIndex < sequence.missingIndices.length - 1) {
        setTimeout(() => {
          const nextIdx = currentMissingIndex + 1;
          setCurrentMissingIndex(nextIdx);
          refreshOptions(sequence, nextIdx);
          setFeedback(null);
        }, 500);
      } else {
        setScore(score + 1);
        setTimeout(() => {
          const nextRound = roundCount + 1;
          if (nextRound >= TOTAL_ROUNDS) {
            finishGame();
          } else {
            setRoundCount(nextRound);
            loadNewSequence(difficulty);
          }
        }, 1000);
      }
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 800);
    }
  };

  const finishGame = async () => {
    const duration = Math.floor((Date.now() - sessionStart) / 60000);
    await completeGame('lost_numbers', score, duration);
    await addSparks(Math.min(3, score));
    navigation.goBack();
  };

  if (!difficulty) {
    return (
      <DifficultyPicker
        tint="lavender"
        icon="🔢"
        title={t('games.lost_numbers')}
        subtitle={t('games.complete_sequence')}
        onSelect={selectDifficulty}
        onBack={() => navigation.goBack()}
      />
    );
  }

  if (!sequence) return null;

  return (
    <ScreenBackground tint="lavender">
      <SafeAreaView style={styles.safe}>
        <BackButton confirm onPress={() => navigation.goBack()} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerCard}>
            <View style={styles.headerCell}>
              <Text style={styles.headerValue}>
                {roundCount + 1} / {TOTAL_ROUNDS}
              </Text>
              <Text style={styles.headerLabel}>{t('game_ui.round')}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.headerCell}>
              <Text style={styles.headerValue}>⭐ {score}</Text>
              <Text style={styles.headerLabel}>{t('game_ui.score')}</Text>
            </View>
          </View>

          <Text style={styles.instruction}>{t('games.complete_sequence')}</Text>

          <View style={styles.sequenceContainer}>
            {sequence.sequence.map((num, index) => {
              const isMissing = sequence.missingIndices.includes(index);
              const missingIdx = sequence.missingIndices.indexOf(index);
              const isAnswered = missingIdx < selectedAnswers.length;
              const isCurrent = missingIdx === currentMissingIndex;

              return (
                <View
                  key={index}
                  style={[
                    styles.sequenceBox,
                    isMissing && styles.sequenceBoxMissing,
                    isCurrent && styles.sequenceBoxCurrent,
                    feedback === 'correct' && isCurrent && styles.sequenceBoxCorrect,
                  ]}
                >
                  <Text
                    style={[
                      styles.sequenceNumber,
                      isMissing && !isAnswered && styles.sequenceNumberMissing,
                    ]}
                  >
                    {isMissing ? (isAnswered ? selectedAnswers[missingIdx] : '?') : num}
                  </Text>
                </View>
              );
            })}
          </View>

          <Text style={styles.optionsLabel}>{t('game_ui.choose_missing_number')}</Text>

          <View style={styles.optionsGrid}>
            {options.map((option, index) => {
              const palette = OPTION_PALETTES[index % OPTION_PALETTES.length];
              return (
                <Pressable
                  key={`${option}-${index}`}
                  style={styles.optionWrap}
                  onPress={() => handleNumberSelect(option)}
                  disabled={feedback !== null}
                >
                  {({ pressed }) => (
                    <View
                      style={[
                        styles.option,
                        {
                          backgroundColor: palette.face,
                          borderBottomColor: palette.lip,
                          borderBottomWidth: pressed ? 1 : 5,
                          transform: [{ translateY: pressed ? 3 : 0 }],
                        },
                      ]}
                    >
                      <Text style={styles.optionText}>{option}</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {showHint && <HintBubble />}

          {feedback && (
            <Text
              style={[
                styles.feedback,
                feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackIncorrect,
              ]}
            >
              {feedback === 'correct' ? `🎉 ${t('feedback.excellent')}` : `💭 ${t('common.incorrect')}`}
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    padding: SIZING.PADDING.large,
    paddingTop: SIZING.PADDING.xlarge + SIZING.SECONDARY_TARGET,
    paddingBottom: SIZING.PADDING.xlarge,
  },
  headerCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.overlay,
    padding: SIZING.PADDING.medium,
    borderRadius: SIZING.BORDER_RADIUS.large,
    marginBottom: SIZING.MARGIN.large,
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  headerCell: { flex: 1, alignItems: 'center' },
  divider: { width: 1, height: 30, backgroundColor: COLORS.lightBlue },
  headerValue: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.pathDeep,
  },
  headerLabel: { fontSize: TYPOGRAPHY.SIZES.body, color: COLORS.textSoft },
  instruction: {
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZING.MARGIN.medium,
  },
  sequenceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: SIZING.MARGIN.large,
    gap: SIZING.GAP,
  },
  sequenceBox: {
    width: 64,
    height: 64,
    backgroundColor: COLORS.white,
    borderRadius: SIZING.BORDER_RADIUS.large,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  sequenceBoxMissing: {
    backgroundColor: COLORS.warmYellow,
    borderWidth: 2,
    borderColor: COLORS.warmYellowDeep,
  },
  sequenceBoxCurrent: {
    borderWidth: 3,
    borderColor: COLORS.softPurpleDeep,
    transform: [{ scale: 1.08 }],
  },
  sequenceBoxCorrect: {
    backgroundColor: COLORS.mint,
    borderColor: COLORS.mintDeep,
  },
  sequenceNumber: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
  },
  sequenceNumberMissing: { color: COLORS.pathDeep },
  optionsLabel: {
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZING.MARGIN.medium,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: -SIZING.GAP / 2,
  },
  optionWrap: {
    width: '50%',
    padding: SIZING.GAP / 2,
    ...SHADOWS.soft,
  },
  option: {
    borderRadius: SIZING.BORDER_RADIUS.large,
    paddingVertical: SIZING.PADDING.large,
    alignItems: 'center',
    minHeight: SIZING.PRIMARY_TARGET,
    justifyContent: 'center',
  },
  optionText: {
    fontSize: TYPOGRAPHY.SIZES.heading,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.white,
  },
  feedback: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    textAlign: 'center',
    marginTop: SIZING.MARGIN.large,
  },
  feedbackCorrect: { color: COLORS.successDeep },
  feedbackIncorrect: { color: COLORS.errorDeep },
});

export default LostNumbersScreen;
