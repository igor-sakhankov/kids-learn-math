// Color palette
export const COLORS = {
  // Core brand
  sky: '#BEE7FA',
  skyDeep: '#7FC8ED',
  grass: '#A2E0A4',
  grassDeep: '#64BF66',
  path: '#FFB74D',
  pathDeep: '#E58E1A',

  // Text
  text: '#2A3547',
  textSoft: '#5A6575',

  // Feedback
  success: '#4CAF50',
  successDeep: '#2E7D32',
  error: '#EF5350',
  errorDeep: '#C62828',

  // Neutrals
  white: '#FFFFFF',
  overlay: 'rgba(255,255,255,0.94)',
  // Neutral press-shadow used on controls that sit on varied tinted backgrounds
  // (e.g. BackButton, PillAction) — tints-agnostic so it reads on any screen.
  pressShadow: 'rgba(0,0,0,0.18)',

  // Pastel accents (kids-friendly palette)
  lightBlue: '#E3F4FD',
  softPurple: '#E7D3F5',
  softPurpleDeep: '#B48BDA',
  warmYellow: '#FFF4BA',
  warmYellowDeep: '#F5C94C',
  softRed: '#FFD1CC',
  softRedDeep: '#FF8A80',
  mint: '#C8F1E3',
  mintDeep: '#69C4A2',
  peach: '#FFE0C2',
  peachDeep: '#FFA86B',

  // "Lip" colors — one step darker than *Deep, used as the bottom-border
  // shadow on chunky plastic buttons (Button, TileButton, NumberPad, game
  // option tiles). Keep these in sync with the *Deep family above.
  skyLip: '#4FA6CE',
  grassLip: '#3E9A40',
  pathLip: '#C8770F',
  softPurpleLip: '#8A5FB8',
  warmYellowLip: '#C99A1F',
  mintLip: '#3FA07F',
  peachLip: '#E08848',

  // Screen background tints (soft pastels)
  bgSky: '#DEF2FC',
  bgMint: '#DFF7EC',
  bgSunrise: '#FFF4E0',
  bgLavender: '#F1E5FA',
  bgTeal: '#D4F1EC',
  bgRose: '#FDE0E4',
  bgLemon: '#FFF8CC',
};

// Difficulty levels configuration
export const DIFFICULTY_LEVELS = {
  easy: { maxNumber: 10 },
  medium: { maxNumber: 20 },
  hard: { maxNumber: 50 },
};

// Visual treatment per difficulty — used by DifficultyPicker
export const DIFFICULTY_META = {
  easy: { icon: '🌱', color: 'mint', colorDeep: 'mintDeep' },
  medium: { icon: '🌿', color: 'warmYellow', colorDeep: 'warmYellowDeep' },
  hard: { icon: '🌳', color: 'peach', colorDeep: 'peachDeep' },
};

// Game configuration
export const GAME_CONFIG = {
  TOTAL_QUESTIONS: 10,
  HINT_AFTER_ATTEMPTS: 2,
  FEEDBACK_DELAY: 800,
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
// Touch-target floors tuned for kids 5-9: primary actions 72pt, secondary 56pt,
// general minimum 64pt. GAP is the floor for inter-target spacing so stray
// fingers can't hit two controls at once.
export const SIZING = {
  MIN_TOUCH_TARGET: 64,
  PRIMARY_TARGET: 72,
  SECONDARY_TARGET: 56,
  GAP: 16,
  BORDER_RADIUS: {
    small: 10,
    medium: 16,
    large: 24,
    xlarge: 32,
    pill: 999,
  },
  PADDING: {
    small: 10,
    medium: 16,
    large: 22,
    xlarge: 32,
  },
  MARGIN: {
    small: 10,
    medium: 16,
    large: 22,
    xlarge: 32,
  },
};

// Icon/emoji size ladder. Use these instead of raw pt values so mascot,
// hero, and inline emoji sizes stay on the same rhythm across screens.
//   hero       — signature character/moment (Welcome mascot, Progress tree)
//   feature    — primary in-content mascot / hero emoji on a screen
//   supporting — chip/stat emoji, object-count visuals
//   inline     — section headers, list row icons
export const ICON_SIZES = {
  hero: 120,
  feature: 64,
  supporting: 40,
  inline: 24,
};

// Typography
// `tiny` is reserved for parent/meta text only (never a kid-facing label).
// Kid-facing body text must use `body` (20pt) or above.
export const TYPOGRAPHY = {
  SIZES: {
    tiny: 14,
    small: 16,
    body: 20,
    subtitle: 24,
    title: 30,
    heading: 36,
    display: 48,
  },
  WEIGHTS: {
    normal: 'normal',
    bold: 'bold',
  },
};

// Shared elevation/shadow presets
export const SHADOWS = {
  soft: {
    elevation: 3,
    shadowColor: '#1B2A44',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  card: {
    elevation: 6,
    shadowColor: '#1B2A44',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },
  pop: {
    elevation: 8,
    shadowColor: '#1B2A44',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
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
  HAS_SEEN_WELCOME: '@app:has_seen_welcome',
};
