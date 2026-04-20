import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../../utils/i18n';
import { generateVisualQuestion } from '../../utils/questionGenerator';
import { useProgress } from '../../contexts/ProgressContext';
import { useReward } from '../../contexts/RewardContext';
import Card from '../../components/common/Card';
import ScreenBackground from '../../components/common/ScreenBackground';
import NumberPad from '../../components/common/NumberPad';
import DifficultyPicker from '../../components/common/DifficultyPicker';
import BackButton from '../../components/common/BackButton';
import HintBubble from '../../components/common/HintBubble';
import LessonCompleteModal from '../../components/common/LessonCompleteModal';
import useAttemptCounter from '../../hooks/useAttemptCounter';
import { COLORS, SIZING, TYPOGRAPHY, SHADOWS, GAME_CONFIG } from '../../utils/constants';

const OBJECT_EMOJI = {
  apple: '🍎',
  cube: '🧊',
  bear: '🧸',
  bird: '🐦',
  flower: '🌸',
};

const AdditionVisualScreen = ({ navigation }) => {
  const [difficulty, setDifficulty] = useState(null);
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [sessionStart] = useState(Date.now());
  const [showComplete, setShowComplete] = useState(false);

  const { recordAttempt, completeLesson } = useProgress();
  const { addLeaves } = useReward();
  const { showHint, registerAttempt, reset: resetAttempts } = useAttemptCounter();

  const selectDifficulty = (level) => {
    setDifficulty(level);
    generateNewQuestion(level);
  };

  const generateNewQuestion = (level) => {
    const newQuestion = generateVisualQuestion(level, '+');
    setQuestion(newQuestion);
    setUserAnswer('');
    setFeedback(null);
    resetAttempts();
  };

  const checkAnswer = async () => {
    const answer = parseInt(userAnswer, 10);
    if (isNaN(answer)) return;

    const isCorrect = answer === question.answer;
    await recordAttempt('addition', isCorrect, difficulty);
    registerAttempt(isCorrect);

    if (isCorrect) {
      setFeedback('correct');
      setScore(score + 1);
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      if (isCorrect) {
        const nextCount = questionCount + 1;
        if (nextCount >= GAME_CONFIG.TOTAL_QUESTIONS) {
          finishLesson();
        } else {
          setQuestionCount(nextCount);
          generateNewQuestion(difficulty);
        }
      } else {
        setUserAnswer('');
        setFeedback(null);
      }
    }, GAME_CONFIG.FEEDBACK_DELAY);
  };

  const finishLesson = async () => {
    const duration = Math.floor((Date.now() - sessionStart) / 60000);
    // score + 1 because setScore from the final correct answer hasn't flushed yet
    await completeLesson('addition_visual', score + 1, duration);
    await addLeaves(1);
    setShowComplete(true);
  };

  const playAgain = () => {
    setShowComplete(false);
    setScore(0);
    setQuestionCount(0);
    generateNewQuestion(difficulty);
  };

  const renderObjects = (count, type) => {
    const emoji = OBJECT_EMOJI[type] || '⭐';
    return Array.from({ length: count }, (_, i) => (
      <Text key={i} style={styles.visualObject}>
        {emoji}
      </Text>
    ));
  };

  if (!difficulty) {
    return (
      <DifficultyPicker
        tint="mint"
        color="grass"
        icon="➕"
        title={t('learning.addition')}
        onSelect={selectDifficulty}
        onBack={() => navigation.goBack()}
      />
    );
  }

  if (!question) return null;

  const progressPct = Math.round(((questionCount + (feedback === 'correct' ? 1 : 0)) / GAME_CONFIG.TOTAL_QUESTIONS) * 100);

  return (
    <ScreenBackground tint="mint">
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <BackButton confirm onPress={() => navigation.goBack()} />

        <View style={styles.headerWrap}>
          <View style={styles.headerCard}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
            </View>
            <View style={styles.headerRow}>
              <Text style={styles.questionNumber}>
                {t('game_ui.question')} {questionCount + 1} / {GAME_CONFIG.TOTAL_QUESTIONS}
              </Text>
              <Text style={styles.scoreText}>⭐ {score}</Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Card
            style={[
              styles.mainCard,
              feedback === 'correct' && styles.cardCorrect,
              feedback === 'incorrect' && styles.cardIncorrect,
            ]}
          >
            <Text style={styles.instruction}>{t('learning.combine_objects')}</Text>

            <View style={styles.equationRow}>
              <EqBlock value={question.first} />
              <Text style={styles.plus}>+</Text>
              <EqBlock value={question.second} />
              <Text style={styles.plus}>=</Text>
              <EqBlock value={userAnswer || '?'} highlight />
            </View>

            <View style={styles.visualContainer}>
              <View style={styles.objectGroup}>{renderObjects(question.first, question.objectType)}</View>
              <Text style={styles.operatorText}>+</Text>
              <View style={styles.objectGroup}>{renderObjects(question.second, question.objectType)}</View>
            </View>

            {feedback && (
              <Text
                style={[
                  styles.feedback,
                  feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackIncorrect,
                ]}
              >
                {feedback === 'correct' ? `🎉 ${t('common.correct')}` : `💭 ${t('common.incorrect')}`}
              </Text>
            )}
          </Card>

          {showHint && <HintBubble />}
        </ScrollView>

        <View style={styles.padWrap}>
          <NumberPad
            value={userAnswer}
            onChange={setUserAnswer}
            onSubmit={checkAnswer}
            disabled={feedback === 'correct'}
          />
        </View>

        <LessonCompleteModal
          visible={showComplete}
          score={score}
          total={GAME_CONFIG.TOTAL_QUESTIONS}
          color="grass"
          onAgain={playAgain}
          onContinue={() => {
            setShowComplete(false);
            navigation.goBack();
          }}
        />
      </SafeAreaView>
    </ScreenBackground>
  );
};

const EqBlock = ({ value, highlight }) => (
  <View style={[styles.eqBlock, highlight && styles.eqBlockHighlight]}>
    <Text style={[styles.eqValue, highlight && styles.eqValueHighlight]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerWrap: {
    paddingHorizontal: SIZING.PADDING.large,
    paddingTop: SIZING.PADDING.xlarge + SIZING.SECONDARY_TARGET,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SIZING.PADDING.large,
    paddingTop: SIZING.PADDING.small,
    paddingBottom: SIZING.PADDING.small,
  },
  headerCard: {
    backgroundColor: COLORS.overlay,
    padding: SIZING.PADDING.medium,
    borderRadius: SIZING.BORDER_RADIUS.large,
    marginBottom: SIZING.MARGIN.small,
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
    backgroundColor: COLORS.grassDeep,
    borderRadius: SIZING.BORDER_RADIUS.pill,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  questionNumber: {
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
  },
  scoreText: {
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.grassDeep,
  },
  mainCard: {
    marginBottom: SIZING.MARGIN.medium,
  },
  cardCorrect: {
    backgroundColor: COLORS.mint,
  },
  cardIncorrect: {
    backgroundColor: COLORS.softRed,
  },
  instruction: {
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZING.MARGIN.medium,
  },
  visualContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZING.MARGIN.medium,
    flexWrap: 'wrap',
  },
  objectGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 180,
  },
  visualObject: {
    fontSize: 36,
    margin: 2,
  },
  operatorText: {
    fontSize: TYPOGRAPHY.SIZES.heading,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.grassDeep,
    marginHorizontal: SIZING.MARGIN.medium,
  },
  equationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SIZING.MARGIN.small,
  },
  eqBlock: {
    minWidth: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZING.BORDER_RADIUS.medium,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    ...SHADOWS.soft,
  },
  eqBlockHighlight: {
    backgroundColor: COLORS.warmYellow,
    borderWidth: 2,
    borderColor: COLORS.warmYellowDeep,
  },
  eqValue: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
  },
  eqValueHighlight: {
    color: COLORS.pathDeep,
  },
  plus: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    marginHorizontal: 4,
  },
  feedback: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    textAlign: 'center',
    marginTop: SIZING.MARGIN.small,
  },
  feedbackCorrect: { color: COLORS.successDeep },
  feedbackIncorrect: { color: COLORS.errorDeep },
  padWrap: {
    paddingHorizontal: SIZING.PADDING.large,
    paddingTop: SIZING.PADDING.medium,
    paddingBottom: SIZING.PADDING.medium,
  },
});

export default AdditionVisualScreen;
