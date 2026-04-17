import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../../utils/i18n';
import { generatePairs } from '../../utils/questionGenerator';
import { useProgress } from '../../contexts/ProgressContext';
import { useReward } from '../../contexts/RewardContext';
import ScreenBackground from '../../components/common/ScreenBackground';
import DifficultyPicker from '../../components/common/DifficultyPicker';
import { COLORS, SIZING, TYPOGRAPHY, SHADOWS } from '../../utils/constants';

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

    setCards(cardArray.sort(() => Math.random() - 0.5));
  };

  const handleCardPress = (cardId) => {
    if (selectedCards.length >= 2) return;

    const card = cards.find((c) => c.id === cardId);
    if (card.isFlipped || card.isMatched) return;

    const updatedCards = cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c,
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
    const firstCard = currentCards.find((c) => c.id === firstId);
    const secondCard = currentCards.find((c) => c.id === secondId);

    if (firstCard.pairId === secondCard.pairId) {
      setTimeout(() => {
        const updatedCards = currentCards.map((c) =>
          c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c,
        );
        setCards(updatedCards);
        setMatchedPairs([...matchedPairs, firstCard.pairId]);
        setSelectedCards([]);
        setScore(score + 1);

        if (matchedPairs.length + 1 === pairs.length) {
          setTimeout(finishGame, 1000);
        }
      }, 500);
    } else {
      setTimeout(() => {
        const updatedCards = currentCards.map((c) =>
          c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c,
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
      <DifficultyPicker
        tint="sunrise"
        icon="🎴"
        title={t('games.find_pair')}
        subtitle={t('games.match_cards')}
        onSelect={selectDifficulty}
        onBack={() => navigation.goBack()}
      />
    );
  }

  return (
    <ScreenBackground tint="sunrise">
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.headerCard}>
            <View style={styles.headerCell}>
              <Text style={styles.headerValue}>
                {matchedPairs.length} / {pairs.length}
              </Text>
              <Text style={styles.headerLabel}>{t('game_ui.pairs')}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.headerCell}>
              <Text style={styles.headerValue}>{moves}</Text>
              <Text style={styles.headerLabel}>{t('game_ui.moves')}</Text>
            </View>
          </View>

          <View style={styles.cardsGrid}>
            {cards.map((card) => (
              <Pressable
                key={card.id}
                style={styles.cardWrap}
                onPress={() => handleCardPress(card.id)}
                disabled={card.isFlipped || card.isMatched}
              >
                {({ pressed }) => (
                  <View
                    style={[
                      styles.cardItem,
                      card.isFlipped && styles.cardFlipped,
                      card.isMatched && styles.cardMatched,
                      pressed && !card.isFlipped && !card.isMatched && styles.cardPressed,
                    ]}
                  >
                    {card.isFlipped || card.isMatched ? (
                      <Text
                        style={[
                          styles.cardContent,
                          card.type === 'equation' && styles.cardEquation,
                        ]}
                      >
                        {card.content}
                      </Text>
                    ) : (
                      <Text style={styles.cardBack}>✨</Text>
                    )}
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    padding: SIZING.PADDING.large,
  },
  headerCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.overlay,
    padding: SIZING.PADDING.medium,
    borderRadius: SIZING.BORDER_RADIUS.large,
    marginBottom: SIZING.MARGIN.large,
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.lightBlue,
  },
  headerValue: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.pathDeep,
  },
  headerLabel: {
    fontSize: TYPOGRAPHY.SIZES.small,
    color: COLORS.textSoft,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: -4,
  },
  cardWrap: {
    width: '25%',
    aspectRatio: 1,
    padding: 4,
  },
  cardItem: {
    flex: 1,
    backgroundColor: COLORS.path,
    borderRadius: SIZING.BORDER_RADIUS.large,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: COLORS.pathDeep,
    ...SHADOWS.soft,
  },
  cardFlipped: {
    backgroundColor: COLORS.white,
    borderBottomColor: COLORS.skyDeep,
  },
  cardMatched: {
    backgroundColor: COLORS.mint,
    borderBottomColor: COLORS.mintDeep,
  },
  cardPressed: {
    transform: [{ translateY: 3 }],
    borderBottomWidth: 1,
  },
  cardBack: {
    fontSize: 28,
  },
  cardContent: {
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  cardEquation: {
    fontSize: TYPOGRAPHY.SIZES.body,
  },
});

export default FindPairScreen;
