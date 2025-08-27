import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [question, setQuestion] = useState({ a: 0, b: 0, op: '+', answer: 0 });
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const failAnim = useRef(new Animated.Value(0)).current;

  const generateQuestion = () => {
    const a = Math.floor(Math.random() * 11); // 0-10
    const b = Math.floor(Math.random() * 11);
    const op = Math.random() < 0.5 ? '+' : '-';
    let first = a;
    let second = b;
    if (op === '-' && b > a) {
      first = b;
      second = a;
    }
    const ans = op === '+' ? first + second : first - second;
    setQuestion({ a: first, b: second, op, answer: ans });
    setInput('');
    setFeedback('');
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const checkAnswer = () => {
    if (parseInt(input, 10) === question.answer) {
      setFeedback('Great job!');
      setIsCorrect(true);
      confettiAnim.setValue(0);
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          setIsCorrect(null);
          generateQuestion();
        }, 500);
      });
    } else {
      setFeedback('Try again!');
      setIsCorrect(false);
      failAnim.setValue(1);
      Animated.timing(failAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => setTimeout(() => setIsCorrect(null), 500));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.taskArea}>
        <Text style={styles.question}>{`${question.a} ${question.op} ${question.b} = ?`}</Text>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          keyboardType="numeric"
        />
        <Button title="Check" onPress={checkAnswer} />
        <Text style={styles.feedback}>{feedback}</Text>
        {isCorrect === true && (
          <Animated.Text
            style={[
              styles.resultIcon,
              {
                opacity: confettiAnim,
                transform: [
                  {
                    scale: confettiAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.5],
                    }),
                  },
                ],
              },
            ]}
          >
            🎉
          </Animated.Text>
        )}
        {isCorrect === false && (
          <Animated.Text style={[styles.resultIcon, { opacity: failAnim }]}>💥</Animated.Text>
        )}
      </View>
      <Image
        source={{ uri: 'https://placekitten.com/200/200' }}
        style={styles.image}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskArea: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  question: {
    fontSize: 32,
    marginBottom: 20,
    color: '#1E3A8A',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    width: 200,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  feedback: {
    fontSize: 24,
    marginTop: 10,
    height: 30,
    color: '#111',
  },
  resultIcon: {
    fontSize: 48,
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
});
