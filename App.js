import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const colors = {
  sky: '#AEE1F9',
  grass: '#8FD68D',
  path: '#F8B133',
  text: '#2F2F2F',
};

export default function App() {
  const [question, setQuestion] = useState({ a: 0, b: 0, op: '+', answer: 0 });
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');

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
      generateQuestion();
    } else {
      setFeedback('Try again!');
    }
  };

  return (
    <ImageBackground
      source={require('./assets/professor-corgi.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.question}>{`${question.a} ${question.op} ${question.b} = ?`}</Text>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          keyboardType="numeric"
        />
        <Button title="Check" color={colors.path} onPress={checkAnswer} />
        <Text style={styles.feedback}>{feedback}</Text>
        <StatusBar style="auto" />
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
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  question: {
    fontSize: 32,
    marginBottom: 20,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.grass,
    width: 80,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  feedback: {
    fontSize: 24,
    marginTop: 10,
    height: 30,
    color: colors.path,
  },
});
