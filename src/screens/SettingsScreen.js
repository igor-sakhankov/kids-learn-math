import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, StatusBar, Switch, TouchableOpacity } from 'react-native';
import { t } from '../utils/i18n';
import { useSettings } from '../contexts/SettingsContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { COLORS, SIZING, TYPOGRAPHY, LANGUAGES } from '../utils/constants';

const SettingsScreen = ({ navigation }) => {
  const { language, changeLanguage, settings, toggleSetting } = useSettings();

  const languageOptions = [
    { code: LANGUAGES.EN, name: 'English', flag: '🇬🇧' },
    { code: LANGUAGES.RU, name: 'Русский', flag: '🇷🇺' },
    { code: LANGUAGES.ES, name: 'Español', flag: '🇪🇸' },
  ];

  return (
    <ImageBackground
      source={require('../../assets/professor-corgi.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('settings.title')}</Text>
        </View>

        {/* Language Settings */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          
          {languageOptions.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageOption,
                language === lang.code && styles.languageOptionActive,
              ]}
              onPress={() => changeLanguage(lang.code)}
            >
              <Text style={styles.languageFlag}>{lang.flag}</Text>
              <Text style={styles.languageName}>{lang.name}</Text>
              {language === lang.code && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </Card>

        {/* Audio Settings */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>{t('settings.sound')}</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{t('settings.music')}</Text>
            </View>
            <Switch
              value={settings.music}
              onValueChange={() => toggleSetting('music')}
              trackColor={{ false: COLORS.lightBlue, true: COLORS.grass }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{t('settings.sound_effects')}</Text>
            </View>
            <Switch
              value={settings.soundEffects}
              onValueChange={() => toggleSetting('soundEffects')}
              trackColor={{ false: COLORS.lightBlue, true: COLORS.grass }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{t('settings.voice')}</Text>
            </View>
            <Switch
              value={settings.voice}
              onValueChange={() => toggleSetting('voice')}
              trackColor={{ false: COLORS.lightBlue, true: COLORS.grass }}
              thumbColor={COLORS.white}
            />
          </View>
        </Card>

        {/* Accessibility Settings */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>{t('settings.accessibility')}</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{t('settings.high_contrast')}</Text>
            </View>
            <Switch
              value={settings.highContrast}
              onValueChange={() => toggleSetting('highContrast')}
              trackColor={{ false: COLORS.lightBlue, true: COLORS.grass }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{t('settings.large_text')}</Text>
            </View>
            <Switch
              value={settings.largeText}
              onValueChange={() => toggleSetting('largeText')}
              trackColor={{ false: COLORS.lightBlue, true: COLORS.grass }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{t('settings.reduced_motion')}</Text>
            </View>
            <Switch
              value={settings.reducedMotion}
              onValueChange={() => toggleSetting('reducedMotion')}
              trackColor={{ false: COLORS.lightBlue, true: COLORS.grass }}
              thumbColor={COLORS.white}
            />
          </View>
        </Card>

        <Button
          title={t('common.back')}
          onPress={() => navigation.goBack()}
          variant="secondary"
          style={styles.backButton}
        />
        
        <StatusBar barStyle="dark-content" />
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZING.PADDING.large,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZING.MARGIN.large,
  },
  title: {
    fontSize: TYPOGRAPHY.SIZES.heading,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    backgroundColor: COLORS.overlay,
    paddingHorizontal: SIZING.PADDING.large,
    paddingVertical: SIZING.PADDING.medium,
    borderRadius: SIZING.BORDER_RADIUS.large,
  },
  card: {
    marginBottom: SIZING.MARGIN.large,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SIZING.MARGIN.large,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZING.PADDING.medium,
    backgroundColor: COLORS.lightBlue,
    borderRadius: SIZING.BORDER_RADIUS.medium,
    marginBottom: SIZING.MARGIN.small,
    minHeight: SIZING.MIN_TOUCH_TARGET,
  },
  languageOptionActive: {
    backgroundColor: COLORS.mint,
    borderWidth: 2,
    borderColor: COLORS.grass,
  },
  languageFlag: {
    fontSize: 30,
    marginRight: SIZING.MARGIN.medium,
  },
  languageName: {
    flex: 1,
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
  },
  checkmark: {
    fontSize: TYPOGRAPHY.SIZES.title,
    color: COLORS.success,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZING.PADDING.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBlue,
    minHeight: SIZING.MIN_TOUCH_TARGET,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.SIZES.body,
    color: COLORS.text,
  },
  backButton: {
    marginBottom: SIZING.MARGIN.large,
  },
});

export default SettingsScreen;

