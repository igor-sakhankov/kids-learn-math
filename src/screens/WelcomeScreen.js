import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../utils/i18n';
import { useSettings } from '../contexts/SettingsContext';
import { useProgress } from '../contexts/ProgressContext';
import Button from '../components/common/Button';
import ScreenBackground from '../components/common/ScreenBackground';
import { COLORS, SIZING, TYPOGRAPHY, SHADOWS } from '../utils/constants';

const WelcomeScreen = ({ navigation }) => {
  const { isLoading: settingsLoading } = useSettings();
  const { startSession, isLoading: progressLoading } = useProgress();

  useEffect(() => {
    if (!progressLoading && !settingsLoading) {
      startSession();
    }
  }, [progressLoading, settingsLoading]);

  if (settingsLoading || progressLoading) {
    return (
      <ScreenBackground tint="sky">
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </ScreenBackground>
    );
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
            onPress={() => navigation.navigate('MainMenu')}
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

const MASCOT_SIZE = 200;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZING.PADDING.large,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: TYPOGRAPHY.SIZES.title,
    color: COLORS.text,
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
