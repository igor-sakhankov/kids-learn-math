import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';

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
    <View style={styles.container}>
      <Text style={styles.question}>{`${question.a} ${question.op} ${question.b} = ?`}</Text>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        keyboardType="numeric"
      />
      <Button title="Check" onPress={checkAnswer} />
      <Text style={styles.feedback}>{feedback}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  question: {
    fontSize: 32,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    width: 80,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  feedback: {
    fontSize: 24,
    marginTop: 10,
    height: 30,
  },
});
