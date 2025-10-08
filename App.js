import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider } from './src/contexts/SettingsContext';
import { ProgressProvider } from './src/contexts/ProgressContext';
import { RewardProvider } from './src/contexts/RewardContext';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Main App Component
 * 
 * This is the root component that wraps the entire application with necessary providers:
 * - SafeAreaProvider: Handles safe area insets for notches and device edges
 * - SettingsProvider: Manages app settings (language, sound, accessibility)
 * - ProgressProvider: Tracks learning progress and achievements
 * - RewardProvider: Manages the reward system (Tree of Mind, leaves, sparks)
 * - AppNavigator: Handles navigation between screens
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <ProgressProvider>
          <RewardProvider>
            <AppNavigator />
          </RewardProvider>
        </ProgressProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
