// Color palette
export const COLORS = {
  sky: '#AEE1F9',
  grass: '#8FD68D',
  path: '#F8B133',
  text: '#2F2F2F',
  success: '#4CAF50',
  error: '#F44336',
  white: '#FFFFFF',
  overlay: 'rgba(255,255,255,0.9)',
  
  // Extended palette for educational UI
  lightBlue: '#E3F2FD',
  softPurple: '#E1BEE7',
  warmYellow: '#FFF9C4',
  softRed: '#FFCDD2',
  mint: '#B2DFDB',
};

// Difficulty levels configuration
export const DIFFICULTY_LEVELS = {
  easy: {
    name: 'easy',
    maxNumber: 10,
    minigameLevels: 3,
  },
  medium: {
    name: 'medium',
    maxNumber: 20,
    minigameLevels: 5,
  },
  hard: {
    name: 'hard',
    maxNumber: 50,
    minigameLevels: 8,
  },
};

// Game configuration
export const GAME_CONFIG = {
  TOTAL_QUESTIONS: 10,
  HINT_AFTER_ATTEMPTS: 2,
  FEEDBACK_DELAY: 800,
  SESSION_MIN_DURATION: 5, // minutes
  SESSION_MAX_DURATION: 12, // minutes
};

// Tree of Reason growth stages
export const TREE_STAGES = {
  SAPLING: { min: 0, max: 10, name: 'sapling' },
  YOUNG_TREE: { min: 10, max: 20, name: 'young_tree' },
  FLOWERING: { min: 20, max: 1000, name: 'flowering' },
};

// Rewards
export const REWARDS = {
  LEAF_PER_LESSON: 1,
  SPARKS_PER_GAME: 3,
  FLOWER_AT_LEAVES: 10,
};

// Achievement types
export const ACHIEVEMENTS = {
  FIRST_STEP: {
    id: 'first_step',
    requirement: 'complete_first_lesson',
    threshold: 1,
  },
  PATTERN_SEEKER: {
    id: 'pattern_seeker',
    requirement: 'solve_sequences',
    threshold: 5,
  },
  MATHEMATICIAN: {
    id: 'mathematician',
    requirement: 'correct_streak',
    threshold: 3,
  },
  PERSISTENT: {
    id: 'persistent',
    requirement: 'retry_after_mistake',
    threshold: 1,
  },
};

// Sizing and spacing
export const SIZING = {
  MIN_TOUCH_TARGET: 44,
  BORDER_RADIUS: {
    small: 8,
    medium: 10,
    large: 15,
  },
  PADDING: {
    small: 10,
    medium: 20,
    large: 30,
  },
  MARGIN: {
    small: 10,
    medium: 15,
    large: 20,
  },
};

// Typography
export const TYPOGRAPHY = {
  SIZES: {
    tiny: 14,
    small: 16,
    body: 18,
    subtitle: 22,
    title: 24,
    heading: 32,
    display: 40,
  },
  WEIGHTS: {
    normal: 'normal',
    bold: 'bold',
  },
};

// Animation durations (ms)
export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Supported languages
export const LANGUAGES = {
  EN: 'en',
  RU: 'ru',
  ES: 'es',
};

// Storage keys
export const STORAGE_KEYS = {
  LANGUAGE: '@app:language',
  PROGRESS: '@app:progress',
  SETTINGS: '@app:settings',
  ACHIEVEMENTS: '@app:achievements',
  TREE_STATE: '@app:tree_state',
};

