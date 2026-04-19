import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../utils/i18n';
import { useSettings } from '../contexts/SettingsContext';
import Card from '../components/common/Card';
import ScreenBackground from '../components/common/ScreenBackground';
import BackButton from '../components/common/BackButton';
import { COLORS, SIZING, TYPOGRAPHY, LANGUAGES } from '../utils/constants';

const LANGUAGE_OPTIONS = [
  { code: LANGUAGES.EN, name: 'English', flag: '🇬🇧' },
  { code: LANGUAGES.RU, name: 'Русский', flag: '🇷🇺' },
  { code: LANGUAGES.ES, name: 'Español', flag: '🇪🇸' },
];

const SettingsScreen = ({ navigation }) => {
  const { language, changeLanguage, settings, toggleSetting } = useSettings();

  return (
    <ScreenBackground tint="lavender">
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <BackButton onPress={() => navigation.goBack()} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.card} padding={false} band="purple" bandTitle={t('settings.language')} bandIcon="🌍">
            <View style={styles.cardBody}>
              {LANGUAGE_OPTIONS.map((lang) => {
                const active = language === lang.code;
                return (
                  <Pressable
                    key={lang.code}
                    style={[styles.languageOption, active && styles.languageOptionActive]}
                    onPress={() => changeLanguage(lang.code)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.languageFlag}>{lang.flag}</Text>
                    <Text style={styles.languageName}>{lang.name}</Text>
                    {active && <Text style={styles.checkmark}>✓</Text>}
                  </Pressable>
                );
              })}
            </View>
          </Card>

          <Card style={styles.card} padding={false} band="path" bandTitle={t('settings.sound')} bandIcon="🔊">
            <View style={styles.cardBody}>
              <SettingRow
                label={t('settings.music')}
                emoji="🎵"
                value={settings.music}
                onToggle={() => toggleSetting('music')}
              />
              <SettingRow
                label={t('settings.sound_effects')}
                emoji="✨"
                value={settings.soundEffects}
                onToggle={() => toggleSetting('soundEffects')}
              />
              <SettingRow
                label={t('settings.voice')}
                emoji="🗣️"
                value={settings.voice}
                onToggle={() => toggleSetting('voice')}
                last
              />
            </View>
          </Card>

          <Card style={styles.card} padding={false} band="mint" bandTitle={t('settings.accessibility')} bandIcon="♿">
            <View style={styles.cardBody}>
              <SettingRow
                label={t('settings.high_contrast')}
                emoji="🌓"
                value={settings.highContrast}
                onToggle={() => toggleSetting('highContrast')}
              />
              <SettingRow
                label={t('settings.large_text')}
                emoji="🔍"
                value={settings.largeText}
                onToggle={() => toggleSetting('largeText')}
              />
              <SettingRow
                label={t('settings.reduced_motion')}
                emoji="🐢"
                value={settings.reducedMotion}
                onToggle={() => toggleSetting('reducedMotion')}
                last
              />
            </View>
          </Card>

        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
};

const SettingRow = ({ label, emoji, value, onToggle, last }) => (
  <Pressable
    onPress={onToggle}
    style={[styles.settingRow, !last && styles.settingRowBorder]}
    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
  >
    <Text style={styles.settingEmoji}>{emoji}</Text>
    <Text style={styles.settingLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: COLORS.lightBlue, true: COLORS.grassDeep }}
      thumbColor={COLORS.white}
    />
  </Pressable>
);

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    padding: SIZING.PADDING.large,
    paddingTop: SIZING.PADDING.xlarge + SIZING.SECONDARY_TARGET,
    paddingBottom: SIZING.PADDING.xlarge,
  },
  card: {
    marginBottom: SIZING.MARGIN.large,
  },
  cardBody: {
    padding: SIZING.PADDING.medium,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZING.PADDING.medium,
    backgroundColor: COLORS.lightBlue,
    borderRadius: SIZING.BORDER_RADIUS.large,
    marginBottom: SIZING.MARGIN.small,
    minHeight: SIZING.MIN_TOUCH_TARGET,
    gap: SIZING.GAP,
  },
  languageOptionActive: {
    backgroundColor: COLORS.mint,
    borderWidth: 2,
    borderColor: COLORS.mintDeep,
  },
  languageFlag: {
    fontSize: 36,
  },
  languageName: {
    flex: 1,
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
  },
  checkmark: {
    fontSize: TYPOGRAPHY.SIZES.title,
    color: COLORS.successDeep,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZING.PADDING.medium,
    minHeight: SIZING.MIN_TOUCH_TARGET,
    gap: SIZING.GAP / 2,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBlue,
  },
  settingEmoji: {
    fontSize: 28,
  },
  settingLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.SIZES.body,
    color: COLORS.text,
  },
});

export default SettingsScreen;
