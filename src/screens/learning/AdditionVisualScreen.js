import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar, TouchableOpacity, TextInput } from 'react-native';
import { t } from '../../utils/i18n';
import { generateVisualQuestion } from '../../utils/questionGenerator';
import { useProgress } from '../../contexts/ProgressContext';
import { useReward } from '../../contexts/RewardContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { COLORS, SIZING, TYPOGRAPHY, DIFFICULTY_LEVELS, GAME_CONFIG } from '../../utils/constants';

const AdditionVisualScreen = ({ navigation }) => {
  const [difficulty, setDifficulty] = useState(null);
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [sessionStart] = useState(Date.now());
  
  const { recordAttempt, completeLesson } = useProgress();
  const { addLeaves } = useReward();

  const selectDifficulty = (level) => {
    setDifficulty(level);
    generateNewQuestion(level);
  };

  const generateNewQuestion = (level) => {
    const newQuestion = generateVisualQuestion(level, '+');
    setQuestion(newQuestion);
    setUserAnswer('');
    setFeedback('');
  };

  const checkAnswer = async () => {
    const answer = parseInt(userAnswer, 10);
    
    if (isNaN(answer)) {
      setFeedback(t('common.incorrect'));
      return;
    }

    const isCorrect = answer === question.answer;
    await recordAttempt('addition', isCorrect, difficulty);

    if (isCorrect) {
      setFeedback(t('common.correct'));
      setScore(score + 1);
      
      setTimeout(() => {
        const nextCount = questionCount + 1;
        if (nextCount >= GAME_CONFIG.TOTAL_QUESTIONS) {
          finishLesson();
        } else {
          setQuestionCount(nextCount);
          generateNewQuestion(difficulty);
        }
      }, GAME_CONFIG.FEEDBACK_DELAY);
    } else {
      setFeedback(t('common.incorrect'));
      
      setTimeout(() => {
        const nextCount = questionCount + 1;
        if (nextCount >= GAME_CONFIG.TOTAL_QUESTIONS) {
          finishLesson();
        } else {
          setQuestionCount(nextCount);
          generateNewQuestion(difficulty);
        }
      }, GAME_CONFIG.FEEDBACK_DELAY);
    }
  };

  const finishLesson = async () => {
    const duration = Math.floor((Date.now() - sessionStart) / 60000);
    await completeLesson('addition_visual', score, duration);
    await addLeaves(1);
    navigation.goBack();
  };

  const renderVisualObjects = (count, type) => {
    const objects = [];
    const emoji = type === 'apple' ? '🍎' : 
                  type === 'cube' ? '🧊' : 
                  type === 'bear' ? '🧸' : 
                  type === 'bird' ? '🐦' :
                  type === 'flower' ? '🌸' : '⭐';
    
    for (let i = 0; i < count; i++) {
      objects.push(
        <Text key={i} style={styles.visualObject}>{emoji}</Text>
      );
    }
    return objects;
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
            <Text style={styles.title}>{t('learning.addition')}</Text>
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
      <View style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.questionNumber}>
              {t('game_ui.question')} {questionCount + 1} / {GAME_CONFIG.TOTAL_QUESTIONS}
            </Text>
            <Text style={styles.scoreText}>
              {t('game_ui.score')}: {score}
            </Text>
          </View>

          <Text style={styles.instruction}>{t('learning.combine_objects')}</Text>

          {/* Visual representation */}
          <View style={styles.visualContainer}>
            <View style={styles.objectGroup}>
              {renderVisualObjects(question.first, question.objectType)}
            </View>
            
            <Text style={styles.operatorText}>+</Text>
            
            <View style={styles.objectGroup}>
              {renderVisualObjects(question.second, question.objectType)}
            </View>
          </View>

          <Text style={styles.equation}>
            {question.first} + {question.second} = ?
          </Text>

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

          {feedback && (
            <Text style={[
              styles.feedback,
              feedback === t('common.correct') && styles.feedbackCorrect,
              feedback === t('common.incorrect') && styles.feedbackIncorrect,
            ]}>
              {feedback}
            </Text>
          )}
        </Card>
      </View>
      <StatusBar barStyle="dark-content" />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
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
  instruction: {
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZING.MARGIN.large,
  },
  visualContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZING.MARGIN.large,
    flexWrap: 'wrap',
  },
  objectGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 120,
  },
  visualObject: {
    fontSize: 32,
    margin: 2,
  },
  operatorText: {
    fontSize: TYPOGRAPHY.SIZES.heading,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.path,
    marginHorizontal: SIZING.MARGIN.large,
  },
  equation: {
    fontSize: TYPOGRAPHY.SIZES.heading,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZING.MARGIN.large,
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.grass,
    backgroundColor: COLORS.white,
    borderRadius: SIZING.BORDER_RADIUS.medium,
    padding: SIZING.PADDING.medium,
    fontSize: TYPOGRAPHY.SIZES.heading,
    textAlign: 'center',
    marginBottom: SIZING.MARGIN.large,
    minHeight: SIZING.MIN_TOUCH_TARGET + 10,
  },
  checkButton: {
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

export default AdditionVisualScreen;

