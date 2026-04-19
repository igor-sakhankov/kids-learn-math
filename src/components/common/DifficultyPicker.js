import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../../utils/i18n';
import ScreenBackground from './ScreenBackground';
import BackButton from './BackButton';
import TileButton from './TileButton';
import { DIFFICULTY_LEVELS, COLORS, SIZING, TYPOGRAPHY, SHADOWS } from '../../utils/constants';

// Hero background is driven by the module's palette so the picker reads as
// "still in Addition" (green), "still in Find the Pair" (peach), etc.
const HERO_PALETTES = {
  sky:    { bg: COLORS.skyDeep,        text: COLORS.white },
  grass:  { bg: COLORS.grassDeep,      text: COLORS.white },
  path:   { bg: COLORS.path,           text: COLORS.white },
  purple: { bg: COLORS.softPurpleDeep, text: COLORS.white },
  mint:   { bg: COLORS.mintDeep,       text: COLORS.white },
  yellow: { bg: COLORS.warmYellowDeep, text: COLORS.text  },
  peach:  { bg: COLORS.peachDeep,      text: COLORS.white },
};

const LEVEL_META = {
  easy:   { icon: '🌱', color: 'mint',   descKey: 'difficulty.easy_desc'   },
  medium: { icon: '🌿', color: 'yellow', descKey: 'difficulty.medium_desc' },
  hard:   { icon: '🌳', color: 'peach',  descKey: 'difficulty.hard_desc'   },
};

const DifficultyPicker = ({
  tint = 'sky',
  color = 'sky',
  icon,
  title,
  subtitle,
  onSelect,
  onBack,
}) => {
  const hero = HERO_PALETTES[color] || HERO_PALETTES.sky;

  return (
    <ScreenBackground tint={tint}>
      <SafeAreaView style={styles.safe}>
        <BackButton onPress={onBack} />
        <View style={styles.container}>
          <View style={[styles.heroBar, { backgroundColor: hero.bg }]}>
            {icon ? <Text style={styles.heroIcon}>{icon}</Text> : null}
            <View style={styles.heroText}>
              <Text
                style={[styles.heroTitle, { color: hero.text }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {title}
              </Text>
              {subtitle ? (
                <Text
                  style={[styles.heroSubtitle, { color: hero.text }]}
                  numberOfLines={2}
                >
                  {subtitle}
                </Text>
              ) : null}
            </View>
          </View>

          <Text style={styles.instruction}>{t('difficulty.choose_level')}</Text>

          <View style={styles.grid}>
            {Object.keys(DIFFICULTY_LEVELS).map((key) => {
              const meta = LEVEL_META[key] || LEVEL_META.easy;
              return (
                <View key={key} style={styles.gridCell}>
                  <TileButton
                    title={t(`difficulty.${key}`)}
                    subtitle={t(meta.descKey)}
                    icon={meta.icon}
                    color={meta.color}
                    size="medium"
                    onPress={() => onSelect(key)}
                  />
                </View>
              );
            })}
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
    paddingHorizontal: SIZING.PADDING.large,
    paddingTop: 96,
    paddingBottom: SIZING.PADDING.large,
  },
  heroBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZING.BORDER_RADIUS.large,
    paddingVertical: SIZING.PADDING.medium,
    paddingHorizontal: SIZING.PADDING.large,
    marginBottom: SIZING.MARGIN.large,
    ...SHADOWS.soft,
  },
  heroIcon: {
    fontSize: 44,
    marginRight: 14,
  },
  heroText: {
    flexShrink: 1,
  },
  heroTitle: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
  },
  heroSubtitle: {
    marginTop: 4,
    fontSize: TYPOGRAPHY.SIZES.body,
    opacity: 0.9,
  },
  instruction: {
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZING.MARGIN.medium,
  },
  grid: {
    flexDirection: 'row',
    marginHorizontal: -SIZING.GAP / 2,
    marginBottom: SIZING.MARGIN.large,
  },
  gridCell: {
    flex: 1,
    padding: SIZING.GAP / 2,
  },
});

export default DifficultyPicker;
