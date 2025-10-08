import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar, TextInput, ScrollView } from 'react-native';
import { t } from '../../utils/i18n';
import { generateStoryProblem } from '../../utils/questionGenerator';
import { useProgress } from '../../contexts/ProgressContext';
import { useReward } from '../../contexts/RewardContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { COLORS, SIZING, TYPOGRAPHY, DIFFICULTY_LEVELS, GAME_CONFIG } from '../../utils/constants';

const StoryProblemsScreen = ({ navigation }) => {
  const [difficulty, setDifficulty] = useState(null);
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
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
    setFeedback('');
    setAttempts(0);
    setShowHint(false);
  };

  const checkAnswer = async () => {
    const answer = parseInt(userAnswer, 10);
    
    if (isNaN(answer)) {
      setFeedback(t('common.incorrect'));
      return;
    }

    const isCorrect = answer === question.answer;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    await recordAttempt('story_problem', isCorrect, difficulty);

    if (isCorrect) {
      setFeedback(t('feedback.excellent'));
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
      setFeedback(t('feedback.almost'));
      
      // Show hint after 2 wrong attempts
      if (newAttempts >= GAME_CONFIG.HINT_AFTER_ATTEMPTS) {
        setShowHint(true);
      }
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
      <ImageBackground
        source={require('../../../assets/professor-corgi.jpeg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Card style={styles.card}>
            <Text style={styles.title}>{t('learning.story_problems')}</Text>
            <Text style={styles.subtitle}>{t('difficulty.choose_level')}</Text>
            
            {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
              <Button
                key={key}
                title={t(`difficulty.${key}`)}
                onPress={() => selectDifficulty(key)}
                variant="primary"
                style={styles.difficultyButton}
              />
            ))}
            
            <Button
              title={t('common.back')}
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.backButton}
            />
          </Card>
        </View>
        <StatusBar barStyle="dark-content" />
      </ImageBackground>
    );
  }

  if (!question) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../../assets/professor-corgi.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.questionNumber}>
              {t('game_ui.question')} {questionCount + 1} / {GAME_CONFIG.TOTAL_QUESTIONS}
            </Text>
            <Text style={styles.scoreText}>
              {t('game_ui.score')}: {score}
            </Text>
          </View>

          <View style={styles.robotSection}>
            <Text style={styles.robotEmoji}>🤖</Text>
            <Text style={styles.robotSpeech}>{t('robot.encourage_1')}</Text>
          </View>

          <View style={styles.storyCard}>
            <Text style={styles.storyText}>{question.storyText}</Text>
          </View>

          <Text style={styles.equationHint}>
            {question.first} {question.operation} {question.second} = ?
          </Text>

          {showHint && (
            <View style={styles.hintCard}>
              <Text style={styles.hintLabel}>{t('common.hint')}:</Text>
              <Text style={styles.hintText}>{t('robot.hint_1')}</Text>
            </View>
          )}

          <TextInput
            style={styles.input}
            value={userAnswer}
            onChangeText={setUserAnswer}
            keyboardType="numeric"
            placeholder="?"
            placeholderTextColor={COLORS.lightBlue}
            autoFocus={true}
          />

          <Button
            title={t('common.check')}
            onPress={checkAnswer}
            variant="primary"
            style={styles.checkButton}
          />

          <Button
            title={t('common.next')}
            onPress={skipQuestion}
            variant="outline"
            style={styles.skipButton}
          />

          {feedback && (
            <Text style={[
              styles.feedback,
              feedback === t('feedback.excellent') && styles.feedbackCorrect,
              feedback === t('feedback.almost') && styles.feedbackIncorrect,
            ]}>
              {feedback}
            </Text>
          )}
        </Card>
      </ScrollView>
      <StatusBar barStyle="dark-content" />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZING.PADDING.large,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZING.PADDING.large,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.sky,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.SIZES.title,
    color: COLORS.text,
  },
  card: {
    width: '100%',
    maxWidth: 500,
  },
  title: {
    fontSize: TYPOGRAPHY.SIZES.heading,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZING.MARGIN.medium,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZING.MARGIN.large,
  },
  difficultyButton: {
    marginBottom: SIZING.MARGIN.medium,
  },
  backButton: {
    marginTop: SIZING.MARGIN.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZING.MARGIN.large,
  },
  questionNumber: {
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
  },
  scoreText: {
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.path,
  },
  robotSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZING.MARGIN.large,
    backgroundColor: COLORS.lightBlue,
    padding: SIZING.PADDING.medium,
    borderRadius: SIZING.BORDER_RADIUS.medium,
  },
  robotEmoji: {
    fontSize: 40,
    marginRight: SIZING.MARGIN.medium,
  },
  robotSpeech: {
    flex: 1,
    fontSize: TYPOGRAPHY.SIZES.body,
    color: COLORS.text,
  },
  storyCard: {
    backgroundColor: COLORS.warmYellow,
    padding: SIZING.PADDING.large,
    borderRadius: SIZING.BORDER_RADIUS.medium,
    marginBottom: SIZING.MARGIN.large,
  },
  storyText: {
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    color: COLORS.text,
    lineHeight: 28,
    textAlign: 'center',
  },
  equationHint: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZING.MARGIN.large,
  },
  hintCard: {
    backgroundColor: COLORS.mint,
    padding: SIZING.PADDING.medium,
    borderRadius: SIZING.BORDER_RADIUS.medium,
    marginBottom: SIZING.MARGIN.large,
  },
  hintLabel: {
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SIZING.MARGIN.small,
  },
  hintText: {
    fontSize: TYPOGRAPHY.SIZES.body,
    color: COLORS.text,
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.grass,
    backgroundColor: COLORS.white,
    borderRadius: SIZING.BORDER_RADIUS.medium,
    padding: SIZING.PADDING.medium,
    fontSize: TYPOGRAPHY.SIZES.heading,
    textAlign: 'center',
    marginBottom: SIZING.MARGIN.medium,
    minHeight: SIZING.MIN_TOUCH_TARGET + 10,
  },
  checkButton: {
    marginBottom: SIZING.MARGIN.medium,
  },
  skipButton: {
    marginBottom: SIZING.MARGIN.medium,
  },
  feedback: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    textAlign: 'center',
    marginTop: SIZING.MARGIN.medium,
  },
  feedbackCorrect: {
    color: COLORS.success,
  },
  feedbackIncorrect: {
    color: COLORS.error,
  },
});

export default StoryProblemsScreen;

