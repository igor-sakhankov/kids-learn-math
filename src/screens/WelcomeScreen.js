import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../utils/i18n';
import { useSettings } from '../contexts/SettingsContext';
import { useProgress } from '../contexts/ProgressContext';
import Button from '../components/common/Button';
import ScreenBackground from '../components/common/ScreenBackground';
import { loadData, saveData } from '../utils/storage';
import { COLORS, SIZING, TYPOGRAPHY, SHADOWS, ICON_SIZES, STORAGE_KEYS } from '../utils/constants';

const WelcomeScreen = ({ navigation }) => {
  const { isLoading: settingsLoading } = useSettings();
  const { isLoading: progressLoading } = useProgress();
  // While we check AsyncStorage, render nothing so returning kids don't see
  // the welcome flash before the auto-skip fires.
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

  const handleStart = async () => {
    await saveData(STORAGE_KEYS.HAS_SEEN_WELCOME, true);
    navigation.replace('MainMenu');
  };

  if (settingsLoading || progressLoading || checkingFirstLaunch) {
    return <ScreenBackground tint="sky" />;
  }

  return (
    <ScreenBackground tint="sky">
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          {/* TODO(M2.3): replace with Robot Logik character art. */}
          <View style={styles.mascotRing}>
            <Image
              source={require('../../assets/professor-corgi.jpeg')}
              style={styles.mascot}
              resizeMode="cover"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.greeting}>{t('welcome.greeting')}</Text>
            <Text style={styles.question}>{t('welcome.question')}</Text>
          </View>

          <Button
            title={t('welcome.lets_start')}
            onPress={handleStart}
            variant="primary"
            size="large"
            icon="🚀"
            style={styles.startButton}
          />

          <View style={styles.hintRow}>
            <Text style={styles.hintEmoji}>🍎</Text>
            <Text style={styles.hintEmoji}>➕</Text>
            <Text style={styles.hintEmoji}>🌳</Text>
            <Text style={styles.hintEmoji}>⭐</Text>
          </View>
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
};

const MASCOT_SIZE = ICON_SIZES.hero;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZING.PADDING.large,
  },
  mascotRing: {
    width: MASCOT_SIZE + 16,
    height: MASCOT_SIZE + 16,
    borderRadius: (MASCOT_SIZE + 16) / 2,
    backgroundColor: COLORS.white,
    padding: 8,
    marginBottom: SIZING.MARGIN.large,
    ...SHADOWS.pop,
  },
  mascot: {
    width: MASCOT_SIZE,
    height: MASCOT_SIZE,
    borderRadius: MASCOT_SIZE / 2,
  },
  card: {
    backgroundColor: COLORS.overlay,
    paddingHorizontal: SIZING.PADDING.xlarge,
    paddingVertical: SIZING.PADDING.large,
    borderRadius: SIZING.BORDER_RADIUS.xlarge,
    alignItems: 'center',
    minWidth: 280,
    marginBottom: SIZING.MARGIN.xlarge,
    ...SHADOWS.card,
  },
  greeting: {
    fontSize: TYPOGRAPHY.SIZES.heading,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SIZING.MARGIN.small,
    textAlign: 'center',
  },
  question: {
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    color: COLORS.text,
    textAlign: 'center',
  },
  startButton: {
    minWidth: 240,
  },
  hintRow: {
    flexDirection: 'row',
    marginTop: SIZING.MARGIN.xlarge,
    gap: 18,
  },
  hintEmoji: {
    fontSize: 32,
    opacity: 0.85,
  },
});

export default WelcomeScreen;
