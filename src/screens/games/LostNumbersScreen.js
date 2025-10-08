import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar, TouchableOpacity } from 'react-native';
import { t } from '../../utils/i18n';
import { generateSequence } from '../../utils/questionGenerator';
import { useProgress } from '../../contexts/ProgressContext';
import { useReward } from '../../contexts/RewardContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { COLORS, SIZING, TYPOGRAPHY, DIFFICULTY_LEVELS } from '../../utils/constants';

const LostNumbersScreen = ({ navigation }) => {
  const [difficulty, setDifficulty] = useState(null);
  const [sequence, setSequence] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentMissingIndex, setCurrentMissingIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [roundCount, setRoundCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [sessionStart] = useState(Date.now());
  
  const { recordAttempt, completeGame } = useProgress();
  const { addSparks } = useReward();

  const selectDifficulty = (level) => {
    setDifficulty(level);
    generateNewSequence(level);
  };

  const generateNewSequence = (level) => {
    const newSequence = generateSequence(level);
    setSequence(newSequence);
    setSelectedAnswers([]);
    setCurrentMissingIndex(0);
    setFeedback('');
  };

  const handleNumberSelect = async (number) => {
    const currentMissingPos = sequence.missingIndices[currentMissingIndex];
    const correctAnswer = sequence.answers[currentMissingIndex];
    const isCorrect = number === correctAnswer;
    
    await recordAttempt('sequence', isCorrect, difficulty);
    
    if (isCorrect) {
      const newAnswers = [...selectedAnswers, number];
      setSelectedAnswers(newAnswers);
      setFeedback(t('feedback.excellent'));
      
      if (currentMissingIndex < sequence.missingIndices.length - 1) {
        // Move to next missing number
        setTimeout(() => {
          setCurrentMissingIndex(currentMissingIndex + 1);
          setFeedback('');
        }, 500);
      } else {
        // Sequence complete
        setScore(score + 1);
        setTimeout(() => {
          const nextRound = roundCount + 1;
          if (nextRound >= 5) {
            finishGame();
          } else {
            setRoundCount(nextRound);
            generateNewSequence(difficulty);
          }
        }, 1000);
      }
    } else {
      setFeedback(t('common.incorrect'));
      setTimeout(() => setFeedback(''), 800);
    }
  };

  const finishGame = async () => {
    const duration = Math.floor((Date.now() - sessionStart) / 60000);
    await completeGame('lost_numbers', score, duration);
    await addSparks(Math.min(3, score));
    navigation.goBack();
  };

  const getNumberOptions = () => {
    if (!sequence) return [];
    
    const currentAnswer = sequence.answers[currentMissingIndex];
    const options = [currentAnswer];
    const used = new Set([currentAnswer]);
    
    while (options.length < 6) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const option = currentAnswer + offset;
      if (option >= 0 && !used.has(option)) {
        options.push(option);
        used.add(option);
      }
    }
    
    return options.sort((a, b) => a - b);
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
            <Text style={styles.emoji}>🔢</Text>
            <Text style={styles.title}>{t('games.lost_numbers')}</Text>
            <Text style={styles.subtitle}>{t('games.complete_sequence')}</Text>
            <Text style={styles.instruction}>{t('difficulty.choose_level')}</Text>
            
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

  if (!sequence) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  const options = getNumberOptions();

  return (
    <ImageBackground
      source={require('../../../assets/professor-corgi.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.scoreText}>Round: {roundCount + 1} / 5</Text>
            <Text style={styles.scoreText}>{t('game_ui.score')}: {score}</Text>
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
                  ]}
                >
                  {isMissing ? (
                    <Text style={styles.sequenceNumber}>
                      {isAnswered ? selectedAnswers[missingIdx] : '?'}
                    </Text>
                  ) : (
                    <Text style={styles.sequenceNumber}>{num}</Text>
                  )}
                </View>
              );
            })}
          </View>

          <Text style={styles.optionsLabel}>Choose the missing number:</Text>

          <View style={styles.optionsGrid}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleNumberSelect(option)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {feedback && (
            <Text style={[
              styles.feedback,
              feedback === t('feedback.excellent') && styles.feedbackCorrect,
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
  emoji: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: SIZING.MARGIN.medium,
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
    marginBottom: SIZING.MARGIN.medium,
  },
  instruction: {
    fontSize: TYPOGRAPHY.SIZES.body,
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
  scoreText: {
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.path,
  },
  sequenceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: SIZING.MARGIN.large,
    gap: SIZING.MARGIN.small,
  },
  sequenceBox: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.lightBlue,
    borderRadius: SIZING.BORDER_RADIUS.medium,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  sequenceBoxMissing: {
    backgroundColor: COLORS.warmYellow,
    borderWidth: 2,
    borderColor: COLORS.path,
  },
  sequenceBoxCurrent: {
    borderWidth: 3,
    borderColor: COLORS.success,
  },
  sequenceNumber: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
  },
  optionsLabel: {
    fontSize: TYPOGRAPHY.SIZES.body,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZING.MARGIN.medium,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SIZING.MARGIN.small,
  },
  optionButton: {
    width: '30%',
    backgroundColor: COLORS.grass,
    padding: SIZING.PADDING.medium,
    borderRadius: SIZING.BORDER_RADIUS.medium,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  optionText: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.white,
  },
  feedback: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    textAlign: 'center',
    marginTop: SIZING.MARGIN.large,
  },
  feedbackCorrect: {
    color: COLORS.success,
  },
  feedbackIncorrect: {
    color: COLORS.error,
  },
});

export default LostNumbersScreen;

