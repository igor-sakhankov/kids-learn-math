import React, { createContext, useState, useEffect, useContext } from 'react';
import { loadSettings, saveSettings, loadLanguage, saveLanguage } from '../utils/storage';
import { setLocale, getDeviceLocale } from '../utils/i18n';
import { LANGUAGES } from '../utils/constants';

const SettingsContext = createContext();

const defaultSettings = {
  sound: true,
  music: true,
  soundEffects: true,
  voice: true,
  highContrast: false,
  largeText: false,
  reducedMotion: false,
};

export const SettingsProvider = ({ children }) => {
  const [language, setLanguageState] = useState(LANGUAGES.EN);
  const [settings, setSettingsState] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings and language on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load language
        const savedLanguage = await loadLanguage();
        const initialLanguage = savedLanguage || getDeviceLocale();
        setLanguageState(initialLanguage);
        setLocale(initialLanguage);

        // Load settings
        const savedSettings = await loadSettings();
        if (savedSettings) {
          setSettingsState({ ...defaultSettings, ...savedSettings });
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Change language
  const changeLanguage = async (newLanguage) => {
    try {
      setLanguageState(newLanguage);
      setLocale(newLanguage);
      await saveLanguage(newLanguage);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // Update settings
  const updateSettings = async (newSettings) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettingsState(updatedSettings);
      await saveSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  // Toggle individual settings
  const toggleSetting = async (settingKey) => {
    await updateSettings({ [settingKey]: !settings[settingKey] });
  };

  const value = {
    language,
    changeLanguage,
    settings,
    updateSettings,
    toggleSetting,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;

