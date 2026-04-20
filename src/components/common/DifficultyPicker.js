import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../../utils/i18n';
import ScreenBackground from './ScreenBackground';
import BackButton from './BackButton';
import { DIFFICULTY_LEVELS, COLORS, SIZING, TYPOGRAPHY } from '../../utils/constants';

// Stacked header palette: face + darker lip block behind it, matching the
// chunky 3D "block" read from the design. The icon is housed in a darker
// rounded square (not a circle) so it echoes the block metaphor.
const HERO_PALETTES = {
  sky:    { face: COLORS.skyDeep,        lip: COLORS.skyLip,        text: COLORS.white },
  grass:  { face: COLORS.grassDeep,      lip: COLORS.grassLip,      text: COLORS.white },
  path:   { face: COLORS.path,           lip: COLORS.pathDeep,      text: COLORS.white },
  purple: { face: COLORS.softPurpleDeep, lip: COLORS.softPurpleLip, text: COLORS.white },
  mint:   { face: COLORS.mintDeep,       lip: COLORS.mintLip,       text: COLORS.white },
  yellow: { face: COLORS.warmYellowDeep, lip: COLORS.warmYellowLip, text: COLORS.text  },
  peach:  { face: COLORS.peachDeep,      lip: COLORS.peachLip,      text: COLORS.white },
};

const LEVEL_META = {
  easy:   { icon: '🌱', color: 'mint',   descKey: 'difficulty.easy_desc'   },
  medium: { icon: '🌿', color: 'yellow', descKey: 'difficulty.medium_desc' },
  hard:   { icon: '🌳', color: 'peach',  descKey: 'difficulty.hard_desc'   },
};

const BLOCK_OFFSET = 8;

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
          <View style={styles.heroWrap}>
            <View style={[styles.heroLip, { backgroundColor: hero.lip }]} />
            <View style={[styles.heroFace, { backgroundColor: hero.face }]}>
              {icon ? (
                <View style={[styles.heroIconBox, { backgroundColor: hero.lip }]}>
                  <Text style={styles.heroIcon}>{icon}</Text>
                </View>
              ) : null}
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
          </View>

          <Text style={styles.instruction}>{t('difficulty.choose_level')}</Text>

          <View style={styles.grid}>
            {Object.keys(DIFFICULTY_LEVELS).map((key) => {
              const meta = LEVEL_META[key] || LEVEL_META.easy;
              return (
                <View key={key} style={styles.gridCell}>
                  <LevelCard
                    title={t(`difficulty.${key}`)}
                    range={t(meta.descKey)}
                    plant={meta.icon}
                    color={meta.color}
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

// LevelCard — stacked block with plant emoji at top, title, and range chip at bottom.
// The chip reuses the lip color so every card reads as "one block with a darker
// stripe" rather than two unrelated shapes.
const LevelCard = ({ title, range, plant, color, onPress }) => {
  const p = HERO_PALETTES[color] || HERO_PALETTES.mint;
  return (
    <Pressable onPress={onPress} style={styles.cardWrap}>
      {({ pressed }) => (
        <View style={styles.cardStack}>
          <View style={[styles.cardLip, { backgroundColor: p.lip }]} />
          <View
            style={[
              styles.cardFace,
              {
                backgroundColor: p.face,
                transform: [
                  { translateX: pressed ? BLOCK_OFFSET - 2 : 0 },
                  { translateY: pressed ? BLOCK_OFFSET - 2 : 0 },
                ],
              },
            ]}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardPlant}>{plant}</Text>
              <Text
                style={[styles.cardTitle, { color: p.text }]}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
              >
                {title}
              </Text>
            </View>
            <View style={[styles.cardChip, { backgroundColor: p.lip }]}>
              <Text style={[styles.cardChipText, { color: p.text }]}>{range}</Text>
            </View>
          </View>
        </View>
      )}
    </Pressable>
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
  heroWrap: {
    position: 'relative',
    marginBottom: SIZING.MARGIN.large,
    paddingRight: BLOCK_OFFSET,
    paddingBottom: BLOCK_OFFSET,
  },
  heroLip: {
    position: 'absolute',
    top: BLOCK_OFFSET,
    left: BLOCK_OFFSET,
    right: 0,
    bottom: 0,
    borderRadius: SIZING.BORDER_RADIUS.large,
  },
  heroFace: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZING.BORDER_RADIUS.large,
    paddingVertical: SIZING.PADDING.large,
    paddingHorizontal: SIZING.PADDING.large,
  },
  heroIconBox: {
    width: 56,
    height: 56,
    borderRadius: SIZING.BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroIcon: {
    fontSize: 32,
    color: COLORS.white,
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
  },
  gridCell: {
    flex: 1,
    padding: SIZING.GAP / 2,
  },
  cardWrap: {
    paddingRight: BLOCK_OFFSET,
    paddingBottom: BLOCK_OFFSET,
  },
  cardStack: {
    position: 'relative',
    height: 180,
  },
  cardLip: {
    position: 'absolute',
    top: BLOCK_OFFSET,
    left: BLOCK_OFFSET,
    right: 0,
    bottom: 0,
    borderRadius: SIZING.BORDER_RADIUS.large,
  },
  cardFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: BLOCK_OFFSET,
    bottom: BLOCK_OFFSET,
    borderRadius: SIZING.BORDER_RADIUS.large,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SIZING.PADDING.medium,
    paddingHorizontal: 6,
  },
  cardPlant: {
    fontSize: 44,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    textAlign: 'center',
    lineHeight: 22,
  },
  cardChip: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardChipText: {
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
  },
});

export default DifficultyPicker;
