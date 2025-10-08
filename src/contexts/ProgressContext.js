import React, { createContext, useState, useEffect, useContext } from 'react';
import { loadProgress, saveProgress } from '../utils/storage';

const ProgressContext = createContext();

const defaultProgress = {
  lessonsCompleted: [],
  gamesPlayed: [],
  totalScore: 0,
  currentStreak: 0,
  bestStreak: 0,
  sessionCount: 0,
  totalTimeSpent: 0, // in minutes
  lastSessionDate: null,
  skillsTracked: {
    addition: 0,
    subtraction: 0,
    patternRecognition: 0,
    logicalThinking: 0,
  },
  completedAchievements: [],
  attemptHistory: [], // Track attempts for analytics
};

export const ProgressProvider = ({ children }) => {
  const [progress, setProgressState] = useState(defaultProgress);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress on mount
  useEffect(() => {
    const loadInitialProgress = async () => {
      try {
        const savedProgress = await loadProgress();
        if (savedProgress) {
          setProgressState({ ...defaultProgress, ...savedProgress });
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialProgress();
  }, []);

  // Save progress whenever it changes
  const updateProgress = async (newProgress) => {
    try {
      const updatedProgress = { ...progress, ...newProgress };
      setProgressState(updatedProgress);
      await saveProgress(updatedProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Complete a lesson
  const completeLesson = async (lessonId, score, duration) => {
    const updatedLessons = [...progress.lessonsCompleted, {
      id: lessonId,
      completedAt: new Date().toISOString(),
      score,
      duration,
    }];

    await updateProgress({
      lessonsCompleted: updatedLessons,
      totalScore: progress.totalScore + score,
      totalTimeSpent: progress.totalTimeSpent + duration,
    });
  };

  // Complete a game
  const completeGame = async (gameId, score, duration) => {
    const updatedGames = [...progress.gamesPlayed, {
      id: gameId,
      completedAt: new Date().toISOString(),
      score,
      duration,
    }];

    await updateProgress({
      gamesPlayed: updatedGames,
      totalScore: progress.totalScore + score,
      totalTimeSpent: progress.totalTimeSpent + duration,
    });
  };

  // Record an answer attempt
  const recordAttempt = async (questionType, isCorrect, difficulty) => {
    const attempt = {
      type: questionType,
      correct: isCorrect,
      difficulty,
      timestamp: new Date().toISOString(),
    };

    const updatedAttempts = [...progress.attemptHistory, attempt];
    
    // Update streak
    const newStreak = isCorrect ? progress.currentStreak + 1 : 0;
    const newBestStreak = Math.max(newStreak, progress.bestStreak);

    // Update skill tracking
    const skillsTracked = { ...progress.skillsTracked };
    if (isCorrect) {
      if (questionType === 'addition') skillsTracked.addition++;
      if (questionType === 'subtraction') skillsTracked.subtraction++;
      if (questionType === 'sequence') skillsTracked.patternRecognition++;
      if (questionType === 'labyrinth') skillsTracked.logicalThinking++;
    }

    await updateProgress({
      attemptHistory: updatedAttempts,
      currentStreak: newStreak,
      bestStreak: newBestStreak,
      skillsTracked,
    });
  };

  // Start a new session
  const startSession = async () => {
    await updateProgress({
      sessionCount: progress.sessionCount + 1,
      lastSessionDate: new Date().toISOString(),
    });
  };

  // Unlock achievement
  const unlockAchievement = async (achievementId) => {
    if (!progress.completedAchievements.includes(achievementId)) {
      const updatedAchievements = [...progress.completedAchievements, achievementId];
      await updateProgress({
        completedAchievements: updatedAchievements,
      });
    }
  };

  // Get statistics
  const getStats = () => {
    const totalLessons = progress.lessonsCompleted.length;
    const totalGames = progress.gamesPlayed.length;
    const correctAnswers = progress.attemptHistory.filter(a => a.correct).length;
    const totalAttempts = progress.attemptHistory.length;
    const accuracy = totalAttempts > 0 ? (correctAnswers / totalAttempts) * 100 : 0;

    return {
      totalLessons,
      totalGames,
      totalScore: progress.totalScore,
      accuracy: Math.round(accuracy),
      bestStreak: progress.bestStreak,
      totalTimeSpent: progress.totalTimeSpent,
      sessionCount: progress.sessionCount,
    };
  };

  const value = {
    progress,
    updateProgress,
    completeLesson,
    completeGame,
    recordAttempt,
    startSession,
    unlockAchievement,
    getStats,
    isLoading,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export default ProgressContext;

