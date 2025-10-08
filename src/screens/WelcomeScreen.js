import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar } from 'react-native';
import { t } from '../utils/i18n';
import { useSettings } from '../contexts/SettingsContext';
import { useProgress } from '../contexts/ProgressContext';
import Button from '../components/common/Button';
import { COLORS, SIZING, TYPOGRAPHY } from '../utils/constants';

const WelcomeScreen = ({ navigation }) => {
  const { isLoading: settingsLoading } = useSettings();
  const { startSession, isLoading: progressLoading } = useProgress();

  useEffect(() => {
    // Start a new session when app opens
    if (!progressLoading && !settingsLoading) {
      startSession();
    }
  }, [progressLoading, settingsLoading]);

  const handleStart = () => {
    navigation.navigate('MainMenu');
  };

  if (settingsLoading || progressLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/professor-corgi.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>🤖</Text>
          <Text style={styles.greeting}>{t('welcome.greeting')}</Text>
          <Text style={styles.question}>{t('welcome.question')}</Text>
          
          <Button
            title={t('welcome.lets_start')}
            onPress={handleStart}
            variant="primary"
            size="large"
            style={styles.startButton}
          />
        </View>
        
        <StatusBar barStyle="dark-content" />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
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
    backgroundColor: COLORS.sky,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.SIZES.title,
    color: COLORS.text,
  },
  content: {
    backgroundColor: COLORS.overlay,
    padding: SIZING.PADDING.large + 10,
    borderRadius: SIZING.BORDER_RADIUS.large,
    alignItems: 'center',
    minWidth: 300,
  },
  title: {
    fontSize: 80,
    marginBottom: SIZING.MARGIN.large,
  },
  greeting: {
    fontSize: TYPOGRAPHY.SIZES.heading,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SIZING.MARGIN.medium,
    textAlign: 'center',
  },
  question: {
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    color: COLORS.text,
    marginBottom: SIZING.MARGIN.large + 10,
    textAlign: 'center',
  },
  startButton: {
    marginTop: SIZING.MARGIN.large,
    minWidth: 200,
  },
});

export default WelcomeScreen;

