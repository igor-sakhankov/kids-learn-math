import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../../utils/i18n';
import ScreenBackground from './ScreenBackground';
import BackButton from './BackButton';
import TileButton from './TileButton';
import { DIFFICULTY_LEVELS, COLORS, SIZING, TYPOGRAPHY, SHADOWS } from '../../utils/constants';

const LEVEL_META = {
  easy:   { icon: '🌱', color: 'mint' },
  medium: { icon: '🌿', color: 'yellow' },
  hard:   { icon: '🌳', color: 'peach' },
};

const DifficultyPicker = ({
  tint = 'sky',
  icon,
  title,
  subtitle,
  onSelect,
  onBack,
}) => {
  return (
    <ScreenBackground tint={tint}>
      <SafeAreaView style={styles.safe}>
        <BackButton onPress={onBack} />
        <View style={styles.container}>
          <View style={styles.heroCard}>
            {icon ? <Text style={styles.heroIcon}>{icon}</Text> : null}
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>

          <Text style={styles.instruction}>{t('difficulty.choose_level')}</Text>

          <View style={styles.grid}>
            {Object.keys(DIFFICULTY_LEVELS).map((key) => {
              const meta = LEVEL_META[key] || LEVEL_META.easy;
              return (
                <View key={key} style={styles.gridCell}>
                  <TileButton
                    title={t(`difficulty.${key}`)}
                    icon={meta.icon}
                    color={meta.color}
                    size="small"
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
    justifyContent: 'center',
    padding: SIZING.PADDING.large,
  },
  heroCard: {
    backgroundColor: COLORS.overlay,
    borderRadius: SIZING.BORDER_RADIUS.xlarge,
    padding: SIZING.PADDING.large,
    alignItems: 'center',
    marginBottom: SIZING.MARGIN.large,
    ...SHADOWS.card,
  },
  heroIcon: {
    fontSize: 64,
    marginBottom: SIZING.MARGIN.small,
  },
  title: {
    fontSize: TYPOGRAPHY.SIZES.heading,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.SIZES.body,
    color: COLORS.textSoft,
    textAlign: 'center',
    marginTop: 6,
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
