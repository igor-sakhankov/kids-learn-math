import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../utils/i18n';
import { useSettings } from '../contexts/SettingsContext';
import { useProgress } from '../contexts/ProgressContext';
import Button from '../components/common/Button';
import ScreenBackground from '../components/common/ScreenBackground';
import CorgiHero from '../components/common/CorgiHero';
import SpeechBubble from '../components/common/SpeechBubble';
import StepDots from '../components/common/StepDots';
import { loadData } from '../utils/storage';
import { COLORS, SIZING, TYPOGRAPHY, STORAGE_KEYS } from '../utils/constants';

const WelcomeScreen = ({ navigation }) => {
  const { isLoading: settingsLoading } = useSettings();
  const { isLoading: progressLoading } = useProgress();
  const [checkingFirstLaunch, setCheckingFirstLaunch] = useState(true);

  useEffect(() => {
    if (progressLoading || settingsLoading) return;
    let cancelled = false;
    (async () => {
      const seen = await loadData(STORAGE_KEYS.HAS_SEEN_WELCOME);
      if (cancelled) return;
      if (seen) {
        navigation.replace('MainMenu');
      } else {
        setCheckingFirstLaunch(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [progressLoading, settingsLoading]);

  const handleStart = () => {
    navigation.replace('Placement', { step: 0, correctCount: 0 });
  };

  const handleParent = () => {
    navigation.navigate('Settings');
  };

  if (settingsLoading || progressLoading || checkingFirstLaunch) {
    return <ScreenBackground tint="sky" />;
  }

  return (
    <ScreenBackground tint="sky">
      <SafeAreaView style={styles.safe}>
        <Pressable
          onPress={handleParent}
          hitSlop={8}
          style={styles.parentLink}
          accessibilityRole="button"
          accessibilityLabel={t('onboarding.parent_link')}
        >
          <Text style={styles.parentWave}>👋</Text>
          <Text style={styles.parentText}>{t('onboarding.parent_link')}</Text>
        </Pressable>

        <View style={styles.container}>
          <View style={styles.topDots}>
            <StepDots total={5} current={0} />
          </View>

          <View style={styles.center}>
            <CorgiHero size={200} />
            <SpeechBubble tailSide="top" style={styles.bubble}>
              <Text style={styles.greeting}>
                {t('welcome.greeting')}
              </Text>
              <Text style={styles.question}>
                {t('welcome.question')}
              </Text>
            </SpeechBubble>
          </View>

          <Button
            title={t('welcome.lets_start')}
            onPress={handleStart}
            variant="primary"
            size="large"
            icon="🚀"
            style={styles.startButton}
          />
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  parentLink: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: SIZING.BORDER_RADIUS.pill,
  },
  parentWave: { fontSize: 14 },
  parentText: {
    fontSize: TYPOGRAPHY.SIZES.tiny,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.textSoft,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZING.PADDING.medium,
    paddingTop: 40,
    paddingBottom: SIZING.PADDING.xlarge,
  },
  topDots: {
    marginTop: 4,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  bubble: {
    marginTop: 8,
  },
  greeting: {
    fontSize: 28,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 32,
  },
  question: {
    fontSize: 18,
    marginTop: 10,
    color: COLORS.textSoft,
    textAlign: 'center',
    lineHeight: 24,
  },
  startButton: {
    minWidth: 240,
  },
});

export default WelcomeScreen;
