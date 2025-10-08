import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens (will be created)
import WelcomeScreen from '../screens/WelcomeScreen';
import MainMenuScreen from '../screens/MainMenuScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Learning screens
import AdditionVisualScreen from '../screens/learning/AdditionVisualScreen';
import SubtractionVisualScreen from '../screens/learning/SubtractionVisualScreen';
import StoryProblemsScreen from '../screens/learning/StoryProblemsScreen';

// Game screens
import NumberLabyrinthScreen from '../screens/games/NumberLabyrinthScreen';
import FindPairScreen from '../screens/games/FindPairScreen';
import LostNumbersScreen from '../screens/games/LostNumbersScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#AEE1F9' },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="MainMenu" component={MainMenuScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        
        {/* Learning Screens */}
        <Stack.Screen name="AdditionVisual" component={AdditionVisualScreen} />
        <Stack.Screen name="SubtractionVisual" component={SubtractionVisualScreen} />
        <Stack.Screen name="StoryProblems" component={StoryProblemsScreen} />
        
        {/* Game Screens */}
        <Stack.Screen name="NumberLabyrinth" component={NumberLabyrinthScreen} />
        <Stack.Screen name="FindPair" component={FindPairScreen} />
        <Stack.Screen name="LostNumbers" component={LostNumbersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

