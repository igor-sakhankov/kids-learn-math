import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar } from 'react-native';
import { t } from '../../utils/i18n';
import { generateQuestion } from '../../utils/questionGenerator';
import { useProgress } from '../../contexts/ProgressContext';
import { useReward } from '../../contexts/RewardContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { COLORS, SIZING, TYPOGRAPHY, DIFFICULTY_LEVELS } from '../../utils/constants';

const NumberLabyrinthScreen = ({ navigation }) => {
  const [difficulty, setDifficulty] = useState(null);
  const [question, setQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [sessionStart] = useState(Date.now());
  
  const { recordAttempt, completeGame } = useProgress();
  const { addSparks } = useReward();

  const selectDifficulty = (level) => {
    setDifficulty(level);
    generateNewQuestion(level);
  };

  const generateNewQuestion = (level) => {
    const newQuestion = generateQuestion(level);
    setQuestion(newQuestion);
  };

  const handleAnswer = async (selectedAnswer) => {
    const isCorrect = selectedAnswer === question.answer;
    await recordAttempt('labyrinth', isCorrect, difficulty);
    setMoves(moves + 1);

    if (isCorrect) {
      setScore(score + 1);
      
      if (score + 1 >= 10) {
        finishGame();
      } else {
        setTimeout(() => {
          generateNewQuestion(difficulty);
        }, 500);
      }
    }
  };

  const finishGame = async () => {
    const duration = Math.floor((Date.now() - sessionStart) / 60000);
    await completeGame('number_labyrinth', score, duration);
    await addSparks(Math.min(3, Math.floor(score / 3)));
    navigation.goBack();
  };

  // Generate multiple choice options
  const getOptions = () => {
    if (!question) return [];
    
    const options = [question.answer];
    const used = new Set([question.answer]);
    
    while (options.length < 4) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const option = question.answer + offset;
      if (option >= 0 && !used.has(option)) {
        options.push(option);
        used.add(option);
      }
    }
    
    return options.sort(() => Math.random() - 0.5);
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
            <Text style={styles.emoji}>🧩</Text>
            <Text style={styles.title}>{t('games.number_labyrinth')}</Text>
            <Text style={styles.subtitle}>{t('games.help_robot')}</Text>
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

  if (!question) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  const options = getOptions();

  return (
    <ImageBackground
      source={require('../../../assets/professor-corgi.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.scoreText}>{t('game_ui.score')}: {score} / 10</Text>
            <Text style={styles.movesText}>Moves: {moves}</Text>
          </View>

          <Text style={styles.robotEmoji}>🤖</Text>
          
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{question.text} = ?</Text>
          </View>

          <Text style={styles.instruction}>Choose the correct answer to open the door!</Text>

          <View style={styles.optionsGrid}>
            {options.map((option, index) => (
              <Button
                key={index}
                title={option.toString()}
                onPress={() => handleAnswer(option)}
                variant="secondary"
                style={styles.optionButton}
              />
            ))}
          </View>
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
  movesText: {
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
  },
  robotEmoji: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: SIZING.MARGIN.large,
  },
  questionCard: {
    backgroundColor: COLORS.lightBlue,
    padding: SIZING.PADDING.large,
    borderRadius: SIZING.BORDER_RADIUS.large,
    marginBottom: SIZING.MARGIN.large,
  },
  questionText: {
    fontSize: TYPOGRAPHY.SIZES.heading,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SIZING.MARGIN.medium,
  },
  optionButton: {
    width: '47%',
    marginBottom: SIZING.MARGIN.medium,
  },
});

export default NumberLabyrinthScreen;

