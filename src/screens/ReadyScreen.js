import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../utils/i18n';
import { useSettings } from '../contexts/SettingsContext';
import Button from '../components/common/Button';
import ScreenBackground from '../components/common/ScreenBackground';
import CorgiHero from '../components/common/CorgiHero';
import SpeechBubble from '../components/common/SpeechBubble';
import StepDots from '../components/common/StepDots';
import { saveData } from '../utils/storage';
import {
  COLORS,
  SIZING,
  TYPOGRAPHY,
  SHADOWS,
  STORAGE_KEYS,
} from '../utils/constants';

const LEVEL_PRESETS = {
  1: {
    key: 'easy',
    icon: '🌱',
    titleKey: 'difficulty.easy',
    rangeKey: 'onboarding.level_range_easy',
    noteKey: 'onboarding.ready_note_easy',
    tint: 'mint',
    face: COLORS.mintDeep,
    lip: COLORS.mintLip,
    variant: 'success',
  },
  2: {
    key: 'medium',
    icon: '🌿',
    titleKey: 'difficulty.medium',
    rangeKey: 'onboarding.level_range_medium',
    noteKey: 'onboarding.ready_note_medium',
    tint: 'lemon',
    face: COLORS.warmYellowDeep,
    lip: COLORS.warmYellowLip,
    variant: 'primary',
  },
  3: {
    key: 'hard',
    icon: '🌳',
    titleKey: 'difficulty.hard',
    rangeKey: 'onboarding.level_range_hard',
    noteKey: 'onboarding.ready_note_hard',
    tint: 'sunrise',
    face: COLORS.peachDeep,
    lip: COLORS.peachLip,
    variant: 'primary',
  },
};

const ReadyScreen = ({ navigation, route }) => {
  const { updateSettings } = useSettings();
  const levelNum = route.params?.level ?? 1;
  const preset = LEVEL_PRESETS[levelNum] || LEVEL_PRESETS[1];

  const handleGo = async () => {
    await updateSettings({ defaultDifficulty: preset.key });
    await saveData(STORAGE_KEYS.HAS_SEEN_WELCOME, true);
    navigation.replace('MainMenu');
  };

  return (
    <ScreenBackground tint={preset.tint}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.topDots}>
          <StepDots total={5} current={4} />
        </View>

        <View style={styles.container}>
          <View style={styles.heroBlock}>
            <CorgiHero size={150} />
            <SpeechBubble tailSide="top" style={styles.bubble}>
              <Text style={styles.heading}>
                {t('onboarding.ready_heading')}
              </Text>
              <Text style={styles.note}>{t(preset.noteKey)}</Text>
            </SpeechBubble>
          </View>

          <View
            style={[
              styles.levelCard,
              { borderBottomColor: preset.lip },
            ]}
          >
            <Text style={styles.levelIcon}>{preset.icon}</Text>
            <Text style={styles.levelTitle}>{t(preset.titleKey)}</Text>
            <View
              style={[styles.rangePill, { backgroundColor: preset.face }]}
            >
              <Text style={styles.rangeText}>{t(preset.rangeKey)}</Text>
            </View>
            <Text style={styles.changeAnytime}>
              {t('onboarding.change_anytime')}
            </Text>
          </View>

          <Button
            title={t('onboarding.lets_math')}
            onPress={handleGo}
            variant={preset.variant}
            size="large"
            icon="✨"
            style={styles.cta}
          />
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topDots: {
    alignItems: 'center',
    paddingTop: 18,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZING.PADDING.medium,
    paddingTop: 20,
    paddingBottom: SIZING.PADDING.xlarge,
  },
  heroBlock: {
    alignItems: 'center',
    gap: 18,
  },
  bubble: {
    maxWidth: 280,
    marginTop: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
  },
  note: {
    fontSize: 15,
    color: COLORS.textSoft,
    marginTop: 6,
    textAlign: 'center',
  },
  levelCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZING.BORDER_RADIUS.xlarge,
    paddingVertical: 22,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    borderBottomWidth: 6,
    ...SHADOWS.card,
  },
  levelIcon: {
    fontSize: 72,
    lineHeight: 78,
  },
  levelTitle: {
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    fontSize: 26,
    marginTop: 6,
    color: COLORS.text,
  },
  rangePill: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: SIZING.BORDER_RADIUS.pill,
  },
  rangeText: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    fontSize: 15,
    letterSpacing: 0.3,
  },
  changeAnytime: {
    fontSize: 13,
    color: COLORS.textSoft,
    marginTop: 12,
    textAlign: 'center',
  },
  cta: {
    minWidth: 260,
  },
});

export default ReadyScreen;
