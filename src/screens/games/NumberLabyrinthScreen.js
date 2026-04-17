import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../../utils/i18n';
import { generateQuestion, generateOptions } from '../../utils/questionGenerator';
import { useProgress } from '../../contexts/ProgressContext';
import { useReward } from '../../contexts/RewardContext';
import ScreenBackground from '../../components/common/ScreenBackground';
import DifficultyPicker from '../../components/common/DifficultyPicker';
import { COLORS, SIZING, TYPOGRAPHY, SHADOWS } from '../../utils/constants';

const OPTION_COLORS = [
  { face: COLORS.skyDeep, lip: '#4FA6CE' },
  { face: COLORS.softPurpleDeep, lip: '#8A5FB8' },
  { face: COLORS.mintDeep, lip: '#3FA07F' },
  { face: COLORS.peachDeep, lip: '#E08848' },
];

const TOTAL_QUESTIONS = 10;

const NumberLabyrinthScreen = ({ navigation }) => {
  const [difficulty, setDifficulty] = useState(null);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [wrongPick, setWrongPick] = useState(null);
  const [sessionStart] = useState(Date.now());

  const { recordAttempt, completeGame } = useProgress();
  const { addSparks } = useReward();

  const selectDifficulty = (level) => {
    setDifficulty(level);
    loadNewQuestion(level);
  };

  const loadNewQuestion = (level) => {
    const newQuestion = generateQuestion(level);
    setQuestion(newQuestion);
    setOptions(generateOptions(newQuestion.answer, 3));
    setWrongPick(null);
  };

  const handleAnswer = async (selectedAnswer) => {
    if (!question) return;
    const isCorrect = selectedAnswer === question.answer;
    await recordAttempt('labyrinth', isCorrect, difficulty);
    setMoves(moves + 1);

    if (isCorrect) {
      const nextScore = score + 1;
      setScore(nextScore);
      if (nextScore >= TOTAL_QUESTIONS) {
        finishGame(nextScore);
      } else {
        setTimeout(() => loadNewQuestion(difficulty), 400);
      }
    } else {
      setWrongPick(selectedAnswer);
      setTimeout(() => setWrongPick(null), 600);
    }
  };

  const finishGame = async (finalScore) => {
    const duration = Math.floor((Date.now() - sessionStart) / 60000);
    await completeGame('number_labyrinth', finalScore, duration);
    await addSparks(Math.min(3, Math.floor(finalScore / 3)));
    navigation.goBack();
  };

  if (!difficulty) {
    return (
      <DifficultyPicker
        tint="sky"
        icon="🧩"
        title={t('games.number_labyrinth')}
        subtitle={t('games.help_robot')}
        onSelect={selectDifficulty}
        onBack={() => navigation.goBack()}
      />
    );
  }

  if (!question) return null;

  const progressPct = Math.round((score / TOTAL_QUESTIONS) * 100);

  return (
    <ScreenBackground tint="sky">
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.headerCard}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
            </View>
            <View style={styles.headerRow}>
              <Text style={styles.headerText}>
                ⭐ {score} / {TOTAL_QUESTIONS}
              </Text>
              <Text style={styles.headerLabel}>
                {t('game_ui.moves')}: {moves}
              </Text>
            </View>
          </View>

          <View style={styles.doorRow}>
            <Text style={styles.robotEmoji}>🤖</Text>
            <View style={styles.questionBubble}>
              <Text style={styles.questionText}>{question.text} = ?</Text>
            </View>
          </View>

          <Text style={styles.instruction}>{t('game_ui.open_door')}</Text>

          <View style={styles.optionsGrid}>
            {options.map((option, index) => {
              const palette = OPTION_COLORS[index % OPTION_COLORS.length];
              const isWrong = wrongPick === option;
              return (
                <Pressable
                  key={`${option}-${index}`}
                  style={styles.optionWrap}
                  onPress={() => handleAnswer(option)}
                  disabled={wrongPick !== null}
                >
                  {({ pressed }) => (
                    <View
                      style={[
                        styles.option,
                        {
                          backgroundColor: isWrong ? COLORS.softRedDeep : palette.face,
                          borderBottomColor: isWrong ? COLORS.errorDeep : palette.lip,
                          borderBottomWidth: pressed ? 2 : 5,
                          transform: [{ translateY: pressed ? 3 : 0 }],
                        },
                      ]}
                    >
                      <Text style={styles.doorEmoji}>🚪</Text>
                      <Text style={styles.optionText}>{option}</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    padding: SIZING.PADDING.large,
  },
  headerCard: {
    backgroundColor: COLORS.overlay,
    padding: SIZING.PADDING.medium,
    borderRadius: SIZING.BORDER_RADIUS.large,
    marginBottom: SIZING.MARGIN.large,
    ...SHADOWS.soft,
  },
  progressBar: {
    height: 10,
    backgroundColor: COLORS.lightBlue,
    borderRadius: SIZING.BORDER_RADIUS.pill,
    overflow: 'hidden',
    marginBottom: SIZING.MARGIN.small,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.skyDeep,
    borderRadius: SIZING.BORDER_RADIUS.pill,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.pathDeep,
  },
  headerLabel: {
    fontSize: TYPOGRAPHY.SIZES.small,
    color: COLORS.textSoft,
  },
  doorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZING.MARGIN.large,
  },
  robotEmoji: {
    fontSize: 64,
    marginRight: SIZING.MARGIN.medium,
  },
  questionBubble: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: SIZING.PADDING.large,
    paddingHorizontal: SIZING.PADDING.medium,
    borderRadius: SIZING.BORDER_RADIUS.xlarge,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  questionText: {
    fontSize: TYPOGRAPHY.SIZES.heading,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
  },
  instruction: {
    fontSize: TYPOGRAPHY.SIZES.body,
    color: COLORS.textSoft,
    textAlign: 'center',
    marginBottom: SIZING.MARGIN.medium,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -6,
  },
  optionWrap: {
    width: '50%',
    padding: 6,
    ...SHADOWS.soft,
  },
  option: {
    minHeight: 110,
    borderRadius: SIZING.BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doorEmoji: { fontSize: 28, marginBottom: 4 },
  optionText: {
    fontSize: TYPOGRAPHY.SIZES.heading,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.white,
  },
});

export default NumberLabyrinthScreen;
