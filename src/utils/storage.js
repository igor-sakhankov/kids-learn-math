import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

/**
 * Generic storage helper functions
 */

// Save data to storage
export const saveData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
    return false;
  }
};

// Load data from storage
export const loadData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error loading data for key ${key}:`, error);
    return null;
  }
};

// Remove data from storage
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
    return false;
  }
};

// Clear all storage (use with caution)
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

/**
 * Specific storage functions for app data
 */

// Language
export const saveLanguage = async (language) => {
  return await saveData(STORAGE_KEYS.LANGUAGE, language);
};

export const loadLanguage = async () => {
  return await loadData(STORAGE_KEYS.LANGUAGE);
};

// Progress
export const saveProgress = async (progress) => {
  return await saveData(STORAGE_KEYS.PROGRESS, progress);
};

export const loadProgress = async () => {
  return await loadData(STORAGE_KEYS.PROGRESS);
};

// Settings
export const saveSettings = async (settings) => {
  return await saveData(STORAGE_KEYS.SETTINGS, settings);
};

export const loadSettings = async () => {
  return await loadData(STORAGE_KEYS.SETTINGS);
};

// Achievements
export const saveAchievements = async (achievements) => {
  return await saveData(STORAGE_KEYS.ACHIEVEMENTS, achievements);
};

export const loadAchievements = async () => {
  return await loadData(STORAGE_KEYS.ACHIEVEMENTS);
};

// Tree state
export const saveTreeState = async (treeState) => {
  return await saveData(STORAGE_KEYS.TREE_STATE, treeState);
};

export const loadTreeState = async () => {
  return await loadData(STORAGE_KEYS.TREE_STATE);
};

