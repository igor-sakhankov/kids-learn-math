import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../utils/i18n';
import { useProgress } from '../contexts/ProgressContext';
import ScreenBackground from '../components/common/ScreenBackground';
import TileButton from '../components/common/TileButton';
import { COLORS, SIZING, TYPOGRAPHY, SHADOWS } from '../utils/constants';

const LEARN_TILES = [
  { id: 'addition', titleKey: 'learning.addition',       screen: 'AdditionVisual',    icon: '➕', color: 'grass' },
  { id: 'subtraction', titleKey: 'learning.subtraction', screen: 'SubtractionVisual', icon: '➖', color: 'path' },
  { id: 'stories', titleKey: 'learning.story_problems',  screen: 'StoryProblems',     icon: '📖', color: 'purple' },
];

const GAME_TILES = [
  { id: 'labyrinth', titleKey: 'games.number_labyrinth', screen: 'NumberLabyrinth', icon: '🧩', color: 'sky' },
  { id: 'pairs',     titleKey: 'games.find_pair',        screen: 'FindPair',        icon: '🎴', color: 'peach' },
  { id: 'sequences', titleKey: 'games.lost_numbers',     screen: 'LostNumbers',     icon: '🔢', color: 'yellow' },
];

const MainMenuScreen = ({ navigation }) => {
  const { startSession, isLoading } = useProgress();

  // Session kickoff runs here rather than WelcomeScreen so that returning
  // kids (who skip Welcome via the first-launch flag) still get a session
  // recorded. Fires once on first mount — stack nav keeps MainMenu mounted
  // across lesson trips so this doesn't double-count.
  useEffect(() => {
    if (!isLoading) startSession();
  }, [isLoading]);

  return (
    <ScreenBackground tint="sky">
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.content}>
          <SectionHeader icon="📚" title={t('menu.learn_math')} />
          <View style={styles.grid}>
            {LEARN_TILES.map((item) => (
              <View key={item.id} style={styles.gridCell}>
                <TileButton
                  title={t(item.titleKey)}
                  icon={item.icon}
                  color={item.color}
                  size="small"
                  onPress={() => navigation.navigate(item.screen)}
                />
              </View>
            ))}
          </View>

          <SectionHeader icon="🎮" title={t('menu.play_games')} />
          <View style={styles.grid}>
            {GAME_TILES.map((item) => (
              <View key={item.id} style={styles.gridCell}>
                <TileButton
                  title={t(item.titleKey)}
                  icon={item.icon}
                  color={item.color}
                  size="small"
                  onPress={() => navigation.navigate(item.screen)}
                />
              </View>
            ))}
          </View>

          <View style={styles.bottomRow}>
            <PillAction
              icon="🌳"
              label={t('menu.my_progress')}
              color={COLORS.mintDeep}
              onPress={() => navigation.navigate('Progress')}
            />
            <PillAction
              icon="⚙️"
              label={t('menu.settings')}
              color={COLORS.softPurpleDeep}
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
};

const SectionHeader = ({ icon, title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionIcon}>{icon}</Text>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const PillAction = ({ icon, label, color, onPress }) => (
  <Pressable style={styles.pillWrap} onPress={onPress}>
    {({ pressed }) => (
      <View
        style={[
          styles.pill,
          {
            backgroundColor: color,
            transform: [{ translateY: pressed ? 3 : 0 }],
            borderBottomWidth: pressed ? 1 : 4,
          },
        ]}
      >
        <Text style={styles.pillIcon}>{icon}</Text>
        <Text
          style={styles.pillLabel}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
          {label}
        </Text>
      </View>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: SIZING.PADDING.large,
    paddingTop: SIZING.PADDING.small,
    paddingBottom: SIZING.PADDING.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZING.MARGIN.small,
    marginBottom: SIZING.MARGIN.small,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: SIZING.MARGIN.small,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  gridCell: {
    width: '33.3333%',
    padding: SIZING.GAP / 2,
  },
  bottomRow: {
    flexDirection: 'row',
    marginTop: 'auto',
    gap: SIZING.MARGIN.medium,
  },
  pillWrap: {
    flex: 1,
    ...SHADOWS.soft,
    borderRadius: SIZING.BORDER_RADIUS.pill,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZING.PADDING.small,
    paddingHorizontal: SIZING.PADDING.medium,
    borderRadius: SIZING.BORDER_RADIUS.pill,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.2)',
    height: 76,
  },
  pillIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  pillLabel: {
    flexShrink: 1,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    fontSize: TYPOGRAPHY.SIZES.body,
  },
});

export default MainMenuScreen;
