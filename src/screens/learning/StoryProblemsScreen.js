import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../../utils/i18n';
import { generateStoryProblem } from '../../utils/questionGenerator';
import { useProgress } from '../../contexts/ProgressContext';
import { useReward } from '../../contexts/RewardContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ScreenBackground from '../../components/common/ScreenBackground';
import NumberPad from '../../components/common/NumberPad';
import DifficultyPicker from '../../components/common/DifficultyPicker';
import BackButton from '../../components/common/BackButton';
import HintBubble from '../../components/common/HintBubble';
import { COLORS, SIZING, TYPOGRAPHY, SHADOWS, GAME_CONFIG } from '../../utils/constants';

const StoryProblemsScreen = ({ navigation }) => {
  const [difficulty, setDifficulty] = useState(null);
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [sessionStart] = useState(Date.now());

  const { recordAttempt, completeLesson } = useProgress();
  const { addLeaves } = useReward();

  const selectDifficulty = (level) => {
    setDifficulty(level);
    generateNewQuestion(level);
  };

  const generateNewQuestion = (level) => {
    const operation = Math.random() < 0.5 ? '+' : '-';
    const newQuestion = generateStoryProblem(level, operation, t);
    setQuestion(newQuestion);
    setUserAnswer('');
    setFeedback(null);
    setAttempts(0);
    setShowHint(false);
  };

  const checkAnswer = async () => {
    const answer = parseInt(userAnswer, 10);
    if (isNaN(answer)) return;

    const isCorrect = answer === question.answer;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    await recordAttempt('story_problem', isCorrect, difficulty);

    if (isCorrect) {
      setFeedback('correct');
      setScore(score + 1);

      setTimeout(() => {
        const nextCount = questionCount + 1;
        if (nextCount >= GAME_CONFIG.TOTAL_QUESTIONS) {
          finishLesson();
        } else {
          setQuestionCount(nextCount);
          generateNewQuestion(difficulty);
        }
      }, GAME_CONFIG.FEEDBACK_DELAY + 200);
    } else {
      setFeedback('incorrect');
      if (newAttempts >= GAME_CONFIG.HINT_AFTER_ATTEMPTS) {
        setShowHint(true);
      }
      setTimeout(() => {
        setFeedback(null);
        setUserAnswer('');
      }, GAME_CONFIG.FEEDBACK_DELAY);
    }
  };

  const skipQuestion = () => {
    const nextCount = questionCount + 1;
    if (nextCount >= GAME_CONFIG.TOTAL_QUESTIONS) {
      finishLesson();
    } else {
      setQuestionCount(nextCount);
      generateNewQuestion(difficulty);
    }
  };

  const finishLesson = async () => {
    const duration = Math.floor((Date.now() - sessionStart) / 60000);
    await completeLesson('story_problems', score, duration);
    await addLeaves(1);
    navigation.goBack();
  };

  if (!difficulty) {
    return (
      <DifficultyPicker
        tint="lavender"
        icon="📖"
        title={t('learning.story_problems')}
        onSelect={selectDifficulty}
        onBack={() => navigation.goBack()}
      />
    );
  }

  if (!question) return null;

  const progressPct = Math.round(
    ((questionCount + (feedback === 'correct' ? 1 : 0)) / GAME_CONFIG.TOTAL_QUESTIONS) * 100,
  );

  return (
    <ScreenBackground tint="lavender">
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <BackButton confirm onPress={() => navigation.goBack()} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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

          <View style={styles.robotBubble}>
            <Text style={styles.robotEmoji}>🤖</Text>
            <View style={styles.robotTextWrap}>
              <Text style={styles.robotSpeech}>{t('robot.encourage_1')}</Text>
            </View>
          </View>

          <Card
            variant="warm"
            style={[
              styles.storyCard,
              feedback === 'correct' && styles.cardCorrect,
              feedback === 'incorrect' && styles.cardIncorrect,
            ]}
          >
            <Text style={styles.storyText}>{question.storyText}</Text>
          </Card>

          <View style={styles.equationRow}>
            <EqBlock value={question.first} />
            <Text style={styles.op}>{question.operation === '+' ? '+' : '−'}</Text>
            <EqBlock value={question.second} />
            <Text style={styles.op}>=</Text>
            <EqBlock value={userAnswer || '?'} highlight />
          </View>

          {showHint && <HintBubble />}

          {feedback && (
            <Text
              style={[
                styles.feedback,
                feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackIncorrect,
              ]}
            >
              {feedback === 'correct' ? `🎉 ${t('feedback.excellent')}` : `💭 ${t('feedback.almost')}`}
            </Text>
          )}
        </ScrollView>

        <View style={styles.padWrap}>
          <NumberPad
            value={userAnswer}
            onChange={setUserAnswer}
            onSubmit={checkAnswer}
            disabled={feedback === 'correct'}
          />
          <Button
            title={t('common.new_problem')}
            onPress={skipQuestion}
            variant="outline"
            size="medium"
            icon="🔄"
            style={styles.skipButton}
          />
        </View>
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
  scroll: { flex: 1 },
  scrollContent: {
    padding: SIZING.PADDING.large,
    paddingTop: SIZING.PADDING.xlarge + SIZING.SECONDARY_TARGET,
    paddingBottom: SIZING.PADDING.xlarge,
  },
  headerCard: {
    backgroundColor: COLORS.overlay,
    padding: SIZING.PADDING.medium,
    borderRadius: SIZING.BORDER_RADIUS.large,
    marginBottom: SIZING.MARGIN.medium,
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
    backgroundColor: COLORS.softPurpleDeep,
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
    color: COLORS.pathDeep,
  },
  robotBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZING.MARGIN.medium,
  },
  robotEmoji: {
    fontSize: 48,
    marginRight: SIZING.MARGIN.small,
  },
  robotTextWrap: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SIZING.BORDER_RADIUS.large,
    padding: SIZING.PADDING.medium,
    ...SHADOWS.soft,
  },
  robotSpeech: {
    fontSize: TYPOGRAPHY.SIZES.body,
    color: COLORS.text,
  },
  storyCard: {
    marginBottom: SIZING.MARGIN.medium,
  },
  cardCorrect: { backgroundColor: COLORS.mint },
  cardIncorrect: { backgroundColor: COLORS.softRed },
  storyText: {
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    color: COLORS.text,
    lineHeight: 30,
    textAlign: 'center',
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
  eqValueHighlight: { color: COLORS.pathDeep },
  op: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    marginHorizontal: 4,
  },
  feedback: {
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    textAlign: 'center',
    marginVertical: SIZING.MARGIN.small,
  },
  feedbackCorrect: { color: COLORS.successDeep },
  feedbackIncorrect: { color: COLORS.errorDeep },
  padWrap: {
    paddingHorizontal: SIZING.PADDING.large,
    paddingTop: SIZING.PADDING.medium,
    paddingBottom: SIZING.PADDING.medium,
  },
  skipButton: {
    marginTop: SIZING.MARGIN.medium,
    alignSelf: 'center',
    minWidth: 160,
  },
});

export default StoryProblemsScreen;
