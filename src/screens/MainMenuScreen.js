import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../utils/i18n';
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
  return (
    <ScreenBackground tint="sky">
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <Image
              source={require('../../assets/professor-corgi.jpeg')}
              style={styles.avatar}
            />
            <View style={styles.headerText}>
              <Text style={styles.hello}>{t('menu.title')}</Text>
              <Text style={styles.helloSub}>{t('welcome.question')}</Text>
            </View>
          </View>

          <SectionHeader icon="📚" title={t('menu.learn_math')} />
          <View style={styles.grid}>
            {LEARN_TILES.map((item) => (
              <View key={item.id} style={styles.gridCell}>
                <TileButton
                  title={t(item.titleKey)}
                  icon={item.icon}
                  color={item.color}
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
        </ScrollView>
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
        <Text style={styles.pillLabel}>{label}</Text>
      </View>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    padding: SIZING.PADDING.large,
    paddingBottom: SIZING.PADDING.xlarge,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.overlay,
    padding: SIZING.PADDING.medium,
    borderRadius: SIZING.BORDER_RADIUS.xlarge,
    marginBottom: SIZING.MARGIN.large,
    ...SHADOWS.soft,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: SIZING.MARGIN.medium,
  },
  headerText: { flex: 1 },
  hello: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
  },
  helloSub: {
    fontSize: TYPOGRAPHY.SIZES.small,
    color: COLORS.textSoft,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZING.MARGIN.medium,
    marginBottom: SIZING.MARGIN.medium,
  },
  sectionIcon: {
    fontSize: 28,
    marginRight: SIZING.MARGIN.small,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: SIZING.MARGIN.medium,
  },
  gridCell: {
    width: '50%',
    padding: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    marginTop: SIZING.MARGIN.large,
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
    paddingVertical: SIZING.PADDING.medium,
    paddingHorizontal: SIZING.PADDING.medium,
    borderRadius: SIZING.BORDER_RADIUS.pill,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.2)',
    minHeight: SIZING.MIN_TOUCH_TARGET,
  },
  pillIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  pillLabel: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    fontSize: TYPOGRAPHY.SIZES.body,
  },
});

export default MainMenuScreen;
