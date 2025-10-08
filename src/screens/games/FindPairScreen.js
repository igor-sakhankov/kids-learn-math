import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar, TouchableOpacity } from 'react-native';
import { t } from '../../utils/i18n';
import { generatePairs } from '../../utils/questionGenerator';
import { useProgress } from '../../contexts/ProgressContext';
import { useReward } from '../../contexts/RewardContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { COLORS, SIZING, TYPOGRAPHY, DIFFICULTY_LEVELS } from '../../utils/constants';

const FindPairScreen = ({ navigation }) => {
  const [difficulty, setDifficulty] = useState(null);
  const [pairs, setPairs] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [sessionStart] = useState(Date.now());
  
  const { completeGame } = useProgress();
  const { addSparks } = useReward();

  const selectDifficulty = (level) => {
    setDifficulty(level);
    const pairCount = level === 'easy' ? 4 : level === 'medium' ? 6 : 8;
    initializeGame(level, pairCount);
  };

  const initializeGame = (level, pairCount) => {
    const generatedPairs = generatePairs(level, pairCount);
    setPairs(generatedPairs);
    
    // Create cards array with equations and answers
    const cardArray = [];
    generatedPairs.forEach((pair, index) => {
      cardArray.push({
        id: `eq-${index}`,
        pairId: index,
        content: pair.equation,
        type: 'equation',
        isFlipped: false,
        isMatched: false,
      });
      cardArray.push({
        id: `ans-${index}`,
        pairId: index,
        content: pair.answer.toString(),
        type: 'answer',
        isFlipped: false,
        isMatched: false,
      });
    });
    
    // Shuffle cards
    const shuffled = cardArray.sort(() => Math.random() - 0.5);
    setCards(shuffled);
  };

  const handleCardPress = (cardId) => {
    if (selectedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (card.isFlipped || card.isMatched) return;
    
    // Flip the card
    const updatedCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);
    
    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);
    
    if (newSelected.length === 2) {
      setMoves(moves + 1);
      checkMatch(newSelected, updatedCards);
    }
  };

  const checkMatch = (selected, currentCards) => {
    const [firstId, secondId] = selected;
    const firstCard = currentCards.find(c => c.id === firstId);
    const secondCard = currentCards.find(c => c.id === secondId);
    
    if (firstCard.pairId === secondCard.pairId) {
      // Match found!
      setTimeout(() => {
        const updatedCards = currentCards.map(c =>
          (c.id === firstId || c.id === secondId) ? { ...c, isMatched: true } : c
        );
        setCards(updatedCards);
        setMatchedPairs([...matchedPairs, firstCard.pairId]);
        setSelectedCards([]);
        setScore(score + 1);
        
        // Check if game is complete
        if (matchedPairs.length + 1 === pairs.length) {
          setTimeout(finishGame, 1000);
        }
      }, 500);
    } else {
      // No match
      setTimeout(() => {
        const updatedCards = currentCards.map(c =>
          (c.id === firstId || c.id === secondId) ? { ...c, isFlipped: false } : c
        );
        setCards(updatedCards);
        setSelectedCards([]);
      }, 1000);
    }
  };

  const finishGame = async () => {
    const duration = Math.floor((Date.now() - sessionStart) / 60000);
    await completeGame('find_pair', score, duration);
    await addSparks(Math.min(3, Math.floor(score / 2)));
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
            <Text style={styles.emoji}>🎴</Text>
            <Text style={styles.title}>{t('games.find_pair')}</Text>
            <Text style={styles.subtitle}>{t('games.match_cards')}</Text>
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

  return (
    <ImageBackground
      source={require('../../../assets/professor-corgi.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.gameContainer}>
        <Card style={styles.headerCard}>
          <View style={styles.header}>
            <Text style={styles.scoreText}>Pairs: {matchedPairs.length} / {pairs.length}</Text>
            <Text style={styles.movesText}>Moves: {moves}</Text>
          </View>
        </Card>

        <View style={styles.cardsGrid}>
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.cardItem,
                card.isFlipped && styles.cardFlipped,
                card.isMatched && styles.cardMatched,
              ]}
              onPress={() => handleCardPress(card.id)}
              disabled={card.isFlipped || card.isMatched}
              activeOpacity={0.8}
            >
              {(card.isFlipped || card.isMatched) ? (
                <Text style={styles.cardContent}>{card.content}</Text>
              ) : (
                <Text style={styles.cardBack}>?</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
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
  gameContainer: {
    flex: 1,
    padding: SIZING.PADDING.large,
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
  headerCard: {
    marginBottom: SIZING.MARGIN.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SIZING.MARGIN.small,
  },
  cardItem: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: COLORS.path,
    borderRadius: SIZING.BORDER_RADIUS.medium,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardFlipped: {
    backgroundColor: COLORS.lightBlue,
  },
  cardMatched: {
    backgroundColor: COLORS.mint,
  },
  cardBack: {
    fontSize: TYPOGRAPHY.SIZES.heading,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.white,
  },
  cardContent: {
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default FindPairScreen;

