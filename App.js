import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ImageBackground, StatusBar, TouchableOpacity } from 'react-native';

const colors = {
  sky: '#AEE1F9',
  grass: '#8FD68D',
  path: '#F8B133',
  text: '#2F2F2F',
  success: '#4CAF50',
  error: '#F44336',
};

// Difficulty levels configuration
const DIFFICULTY_LEVELS = {
  easy: {
    name: 'Easy-Peasy',
    maxNumber: 10,
    description: 'Numbers 0-10',
  },
  medium: {
    name: 'I can do math',
    maxNumber: 20,
    description: 'Numbers 0-20',
  },
  hard: {
    name: 'Math profi',
    maxNumber: 50,
    description: 'Numbers 0-50',
  },
};

const TOTAL_QUESTIONS = 10;

export default function App() {
  // Game state
  const [gameState, setGameState] = useState('level-select'); // 'level-select', 'playing', 'summary'
  const [difficulty, setDifficulty] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  
  // Question state
  const [question, setQuestion] = useState({ a: 0, b: 0, op: '+', answer: 0 });
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');

  const generateQuestion = (level) => {
    const maxNum = DIFFICULTY_LEVELS[level].maxNumber;
    const a = Math.floor(Math.random() * (maxNum + 1)); // 0 to maxNum
    const b = Math.floor(Math.random() * (maxNum + 1));
    const op = Math.random() < 0.5 ? '+' : '-';
    
    let first = a;
    let second = b;
    
    // For subtraction, ensure positive result
    if (op === '-' && b > a) {
      first = b;
      second = a;
    }
    
    const ans = op === '+' ? first + second : first - second;
    setQuestion({ a: first, b: second, op, answer: ans });
    setInput('');
    setFeedback('');
  };

  const startGame = (level) => {
    setDifficulty(level);
    setScore(0);
    setQuestionCount(0);
    setGameState('playing');
    generateQuestion(level);
  };

  const checkAnswer = () => {
    const userAnswer = parseInt(input, 10);
    
    if (isNaN(userAnswer)) {
      setFeedback('Please enter a number!');
      return;
    }
    
    if (userAnswer === question.answer) {
      setFeedback('Great job! ✓');
      setScore(score + 1);
      
      // Move to next question or end game
      setTimeout(() => {
        const nextCount = questionCount + 1;
        if (nextCount >= TOTAL_QUESTIONS) {
          setGameState('summary');
        } else {
          setQuestionCount(nextCount);
          generateQuestion(difficulty);
        }
      }, 800);
    } else {
      setFeedback('Try again!');
      
      // Move to next question after wrong answer
      setTimeout(() => {
        const nextCount = questionCount + 1;
        if (nextCount >= TOTAL_QUESTIONS) {
          setGameState('summary');
        } else {
          setQuestionCount(nextCount);
          generateQuestion(difficulty);
        }
      }, 800);
    }
  };

  const restartGame = () => {
    setGameState('level-select');
    setDifficulty(null);
    setScore(0);
    setQuestionCount(0);
    setFeedback('');
  };

  // Get performance message based on score
  const getPerformanceMessage = () => {
    const percentage = (score / TOTAL_QUESTIONS) * 100;
    if (percentage === 100) return 'Perfect! You are a Math Genius! 🌟';
    if (percentage >= 80) return 'Excellent work! 🎉';
    if (percentage >= 60) return 'Good job! Keep practicing! 👍';
    if (percentage >= 40) return 'Nice try! You can do better! 💪';
    return 'Keep practicing! You will improve! 📚';
  };

  // Render level selection screen
  if (gameState === 'level-select') {
    return (
      <ImageBackground
        source={require('./assets/professor-corgi.jpeg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Choose Your Level</Text>
          
          {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
            <TouchableOpacity
              key={key}
              style={styles.levelButton}
              onPress={() => startGame(key)}
            >
              <Text style={styles.levelButtonText}>{level.name}</Text>
              <Text style={styles.levelDescription}>{level.description}</Text>
            </TouchableOpacity>
          ))}
          
          <StatusBar barStyle="dark-content" />
        </View>
      </ImageBackground>
    );
  }

  // Render summary screen
  if (gameState === 'summary') {
    return (
      <ImageBackground
        source={require('./assets/professor-corgi.jpeg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Game Over!</Text>
          <Text style={styles.summaryScore}>
            Your Score: {score} / {TOTAL_QUESTIONS}
          </Text>
          <Text style={styles.summaryPercentage}>
            {Math.round((score / TOTAL_QUESTIONS) * 100)}%
          </Text>
          <Text style={styles.summaryMessage}>{getPerformanceMessage()}</Text>
          
          <TouchableOpacity
            style={styles.restartButton}
            onPress={restartGame}
          >
            <Text style={styles.restartButtonText}>Play Again</Text>
          </TouchableOpacity>
          
          <StatusBar barStyle="dark-content" />
        </View>
      </ImageBackground>
    );
  }

  // Render game screen
  return (
    <ImageBackground
      source={require('./assets/professor-corgi.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.gameHeader}>
          <Text style={styles.gameInfo}>
            Question {questionCount + 1} / {TOTAL_QUESTIONS}
          </Text>
          <Text style={styles.gameInfo}>Score: {score}</Text>
        </View>
        
        <Text style={styles.question}>{`${question.a} ${question.op} ${question.b} = ?`}</Text>
        
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          keyboardType="numeric"
          autoFocus={true}
        />
        
        <Button title="Check" color={colors.path} onPress={checkAnswer} />
        
        <Text style={[
          styles.feedback,
          feedback.includes('✓') && styles.feedbackSuccess,
          feedback.includes('Try again') && styles.feedbackError,
        ]}>
          {feedback}
        </Text>
        
        <StatusBar barStyle="dark-content" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    margin: 20,
    borderRadius: 15,
    minWidth: 300,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 30,
    color: colors.text,
    textAlign: 'center',
  },
  // Level selection styles
  levelButton: {
    backgroundColor: colors.path,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: 250,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  levelButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  levelDescription: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
    opacity: 0.9,
  },
  // Game screen styles
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  gameInfo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  question: {
    fontSize: 40,
    marginBottom: 20,
    color: colors.text,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 2,
    borderColor: colors.grass,
    width: 100,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 8,
  },
  feedback: {
    fontSize: 24,
    marginTop: 15,
    height: 35,
    color: colors.text,
    fontWeight: 'bold',
  },
  feedbackSuccess: {
    color: colors.success,
  },
  feedbackError: {
    color: colors.error,
  },
  // Summary screen styles
  summaryScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginVertical: 15,
  },
  summaryPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.path,
    marginVertical: 10,
  },
  summaryMessage: {
    fontSize: 24,
    color: colors.text,
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  restartButton: {
    backgroundColor: colors.grass,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  restartButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
});
