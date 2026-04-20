// Achievement catalog for the Tree of Reason motivation loop.
//
// Each entry is pure data + a predicate on the progress snapshot. New
// achievements are earned when `check(progress)` returns true and the id
// isn't already in `progress.completedAchievements`.
//
// Locale keys must exist in en/ru/es. Color hints map to the COLORS palette
// and are used by the Achievements card to tint the unlocked tile.

import { COLORS } from './constants';

export const ACHIEVEMENT_CATALOG = [
  {
    id: 'first_step',
    icon: '🌟',
    nameKey: 'achievements.first_step',
    descKey: 'achievements.first_step_desc',
    tint: COLORS.warmYellow,
    check: (progress) => progress.lessonsCompleted.length >= 1,
  },
  {
    id: 'mathematician',
    icon: '🧮',
    nameKey: 'achievements.mathematician',
    descKey: 'achievements.mathematician_desc',
    tint: COLORS.mint,
    check: (progress) => (progress.bestStreak || 0) >= 3,
  },
  {
    id: 'pattern_seeker',
    icon: '🔢',
    nameKey: 'achievements.pattern_seeker',
    descKey: 'achievements.pattern_seeker_desc',
    tint: COLORS.softPurple,
    check: (progress) => (progress.skillsTracked?.patternRecognition || 0) >= 5,
  },
  {
    id: 'persistent',
    icon: '💪',
    nameKey: 'achievements.persistent',
    descKey: 'achievements.persistent_desc',
    tint: COLORS.peach,
    check: (progress) => {
      // Unlocked when a correct attempt directly follows a wrong one —
      // i.e. the child recovered after a mistake in the same session.
      const hist = progress.attemptHistory || [];
      for (let i = 1; i < hist.length; i++) {
        if (hist[i].correct && !hist[i - 1].correct) return true;
      }
      return false;
    },
  },
];

export const findNewlyEarned = (progress) => {
  const earned = progress.completedAchievements || [];
  return ACHIEVEMENT_CATALOG
    .filter((a) => !earned.includes(a.id) && a.check(progress))
    .map((a) => a.id);
};
