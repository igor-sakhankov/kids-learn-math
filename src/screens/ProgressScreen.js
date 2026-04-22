import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../utils/i18n';
import { useProgress } from '../contexts/ProgressContext';
import { useReward } from '../contexts/RewardContext';
import ScreenBackground from '../components/common/ScreenBackground';
import BackButton from '../components/common/BackButton';
import { COLORS, SIZING, TYPOGRAPHY } from '../utils/constants';
import { ACHIEVEMENT_CATALOG } from '../utils/achievements';

// Number of correct answers a skill needs to fill its bar.
const SKILL_MASTERY_TARGET = 20;
const BLOCK_OFFSET = 8;

const skillPercent = (count) =>
  Math.min(100, Math.round(((count || 0) / SKILL_MASTERY_TARGET) * 100));

// Same face+lip palette as TileButton / DifficultyPicker so the whole app
// reads as one family of chunky plastic blocks.
const PALETTES = {
  sky:    { face: COLORS.skyDeep,        lip: COLORS.skyLip,        text: COLORS.white },
  grass:  { face: COLORS.grassDeep,      lip: COLORS.grassLip,      text: COLORS.white },
  path:   { face: COLORS.path,           lip: COLORS.pathDeep,      text: COLORS.white },
  purple: { face: COLORS.softPurpleDeep, lip: COLORS.softPurpleLip, text: COLORS.white },
  mint:   { face: COLORS.mintDeep,       lip: COLORS.mintLip,       text: COLORS.white },
  yellow: { face: COLORS.warmYellowDeep, lip: COLORS.warmYellowLip, text: COLORS.text  },
  peach:  { face: COLORS.peachDeep,      lip: COLORS.peachLip,      text: COLORS.white },
};

// Map an achievement's pastel tint to the matching block palette so each
// unlocked tile keeps its own color identity without us restating the data.
const TINT_TO_PALETTE = {
  [COLORS.warmYellow]: 'yellow',
  [COLORS.mint]:       'mint',
  [COLORS.softPurple]: 'purple',
  [COLORS.peach]:      'peach',
  [COLORS.sky]:        'sky',
};

const ProgressScreen = ({ navigation }) => {
  const { progress, getStats } = useProgress();
  const { treeState, getGrowthProgress } = useReward();
  const stats = getStats();
  const growth = getGrowthProgress();
  const skills = progress.skillsTracked;
  const earnedIds = progress.completedAchievements || [];

  return (
    <ScreenBackground tint="mint">
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <BackButton onPress={() => navigation.goBack()} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TreeHero treeState={treeState} growth={growth} />

          <View style={styles.statsGrid}>
            <StatTile palette="mint"   emoji="🍃" value={treeState.leaves}  label={t('progress.leaves_earned')} />
            <StatTile palette="yellow" emoji="✨" value={treeState.sparks}  label={t('progress.sparks_earned')} />
            <StatTile palette="sky"    emoji="📚" value={stats.totalLessons} label={t('progress.lessons_completed')} />
            <StatTile palette="peach"  emoji="🎮" value={stats.totalGames}   label={t('progress.games_played')} />
          </View>

          <SectionHeader icon="💪" title={t('progress.skills_developing')} />
          <View style={styles.panel}>
            <SkillRow palette="grass"  icon="➕" name={t('progress.understanding_addition')}    percent={skillPercent(skills.addition)} />
            <SkillRow palette="path"   icon="➖" name={t('progress.understanding_subtraction')} percent={skillPercent(skills.subtraction)} />
            <SkillRow palette="purple" icon="🔢" name={t('progress.pattern_recognition')}       percent={skillPercent(skills.patternRecognition)} />
            <SkillRow palette="mint"   icon="🧠" name={t('progress.logical_thinking')}          percent={skillPercent(skills.logicalThinking)} isLast />
          </View>

          <SectionHeader icon="🏆" title={t('achievements.title')} />
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENT_CATALOG.map((ach) => (
              <View key={ach.id} style={styles.achievementCell}>
                <AchievementTile
                  achievement={ach}
                  unlocked={earnedIds.includes(ach.id)}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
};

// Hero — the Tree of Reason as a chunky stacked block with icon-in-darker-square,
// matching the DifficultyPicker hero pattern.
const TreeHero = ({ treeState, growth }) => {
  const p = PALETTES.mint;
  return (
    <View style={styles.heroWrap}>
      <View style={[styles.heroLip, { backgroundColor: p.lip }]} />
      <View style={[styles.heroFace, { backgroundColor: p.face }]}>
        <View style={[styles.heroIconBox, { backgroundColor: p.lip }]}>
          <Text style={styles.heroIcon}>🌳</Text>
        </View>
        <View style={styles.heroText}>
          <Text
            style={[styles.heroStage, { color: p.text }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {t(`progress.tree_stage.${treeState.stage}`)}
          </Text>
          <View style={[styles.heroTrack, { backgroundColor: p.lip }]}>
            <View
              style={[
                styles.heroFill,
                { width: `${growth.progress}%`, backgroundColor: COLORS.white },
              ]}
            />
          </View>
          {growth.next ? (
            <Text
              style={[styles.heroCaption, { color: p.text }]}
              numberOfLines={2}
            >
              {t('progress.until_next', {
                count: growth.leavesUntilNext,
                stage: t(`progress.tree_stage.${growth.next.name}`),
              })}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
};

// Stat tile — small stacked block in the 2x2 grid. Emoji-in-darker-square on
// the left, big value + caption on the right. Mirrors hero layout at tile scale.
const StatTile = ({ palette, emoji, value, label }) => {
  const p = PALETTES[palette] || PALETTES.sky;
  return (
    <View style={styles.statCell}>
      <View style={styles.statWrap}>
        <View style={[styles.statLip, { backgroundColor: p.lip }]} />
        <View style={[styles.statFace, { backgroundColor: p.face }]}>
          <View style={[styles.statIconBox, { backgroundColor: p.lip }]}>
            <Text style={styles.statIcon}>{emoji}</Text>
          </View>
          <View style={styles.statText}>
            <Text style={[styles.statValue, { color: p.text }]}>{value}</Text>
            <Text
              style={[styles.statLabel, { color: p.text }]}
              numberOfLines={2}
            >
              {label}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const SectionHeader = ({ icon, title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionIcon}>{icon}</Text>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

// SkillRow — white panel rows with a colored icon square and a two-layer
// progress bar (lip track + face fill) so the bar echoes the block metaphor.
const SkillRow = ({ palette, icon, name, percent, isLast }) => {
  const p = PALETTES[palette] || PALETTES.mint;
  return (
    <View style={[styles.skillRow, !isLast && styles.skillRowDivider]}>
      <View style={[styles.skillIconBox, { backgroundColor: p.face }]}>
        <View style={[styles.skillIconLip, { backgroundColor: p.lip }]} />
        <Text style={styles.skillIcon}>{icon}</Text>
      </View>
      <View style={styles.skillInfo}>
        <View style={styles.skillNameRow}>
          <Text style={styles.skillName} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[styles.skillPct, { color: p.face }]}>{percent}%</Text>
        </View>
        <View style={styles.skillTrack}>
          <View
            style={[
              styles.skillFill,
              { width: `${percent}%`, backgroundColor: p.face },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

// AchievementTile — stacked block when unlocked (tinted), flat dashed tile
// when locked so the difference is readable without a tint alone (U15).
const AchievementTile = ({ achievement, unlocked }) => {
  const { icon, nameKey, descKey, tint } = achievement;

  if (!unlocked) {
    return (
      <View style={styles.achievementLocked}>
        <Text style={styles.achievementLockIcon}>🔒</Text>
        <Text style={styles.achievementLockedName} numberOfLines={2}>
          {t(nameKey)}
        </Text>
        <Text style={styles.achievementLockedDesc} numberOfLines={2}>
          {t('achievements.locked')}
        </Text>
      </View>
    );
  }

  const p = PALETTES[TINT_TO_PALETTE[tint]] || PALETTES.yellow;
  return (
    <View style={styles.achievementWrap}>
      <View style={[styles.achievementLip, { backgroundColor: p.lip }]} />
      <View style={[styles.achievementFace, { backgroundColor: p.face }]}>
        <View style={[styles.achievementIconBox, { backgroundColor: p.lip }]}>
          <Text style={styles.achievementIcon}>{icon}</Text>
        </View>
        <Text
          style={[styles.achievementName, { color: p.text }]}
          numberOfLines={2}
        >
          {t(nameKey)}
        </Text>
        <Text
          style={[styles.achievementDesc, { color: p.text }]}
          numberOfLines={2}
        >
          {t(descKey)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SIZING.PADDING.large,
    paddingTop: SIZING.PADDING.large + SIZING.SECONDARY_TARGET,
    paddingBottom: SIZING.PADDING.xlarge,
  },

  // ---------- Tree hero (stacked block) ----------
  heroWrap: {
    position: 'relative',
    marginBottom: SIZING.MARGIN.large,
    paddingRight: BLOCK_OFFSET,
    paddingBottom: BLOCK_OFFSET,
  },
  heroLip: {
    position: 'absolute',
    top: BLOCK_OFFSET,
    left: BLOCK_OFFSET,
    right: 0,
    bottom: 0,
    borderRadius: SIZING.BORDER_RADIUS.large,
  },
  heroFace: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZING.BORDER_RADIUS.large,
    paddingVertical: SIZING.PADDING.large,
    paddingHorizontal: SIZING.PADDING.large,
  },
  heroIconBox: {
    width: 96,
    height: 96,
    borderRadius: SIZING.BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZING.MARGIN.medium,
  },
  heroIcon: { fontSize: 64 },
  heroText: { flex: 1 },
  heroStage: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    marginBottom: SIZING.MARGIN.small,
  },
  heroTrack: {
    height: 18,
    borderRadius: SIZING.BORDER_RADIUS.pill,
    overflow: 'hidden',
    marginBottom: 8,
  },
  heroFill: {
    height: '100%',
    borderRadius: SIZING.BORDER_RADIUS.pill,
  },
  heroCaption: {
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    opacity: 0.95,
  },

  // ---------- Stats grid ----------
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SIZING.GAP / 2,
    marginBottom: SIZING.MARGIN.small,
  },
  statCell: {
    width: '50%',
    padding: SIZING.GAP / 2,
  },
  statWrap: {
    position: 'relative',
    paddingRight: BLOCK_OFFSET,
    paddingBottom: BLOCK_OFFSET,
  },
  statLip: {
    position: 'absolute',
    top: BLOCK_OFFSET,
    left: BLOCK_OFFSET,
    right: 0,
    bottom: 0,
    borderRadius: SIZING.BORDER_RADIUS.large,
  },
  statFace: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZING.BORDER_RADIUS.large,
    paddingVertical: SIZING.PADDING.medium,
    paddingHorizontal: SIZING.PADDING.medium,
    minHeight: 92,
  },
  statIconBox: {
    width: 52,
    height: 52,
    borderRadius: SIZING.BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZING.MARGIN.small,
  },
  statIcon: { fontSize: 28 },
  statText: { flex: 1 },
  statValue: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    lineHeight: 32,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.SIZES.small,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    opacity: 0.95,
  },

  // ---------- Section header ----------
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZING.MARGIN.large,
    marginBottom: SIZING.MARGIN.medium,
  },
  sectionIcon: {
    fontSize: 28,
    marginRight: SIZING.MARGIN.small,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
  },

  // ---------- Skills panel ----------
  panel: {
    backgroundColor: COLORS.white,
    borderRadius: SIZING.BORDER_RADIUS.large,
    paddingHorizontal: SIZING.PADDING.large,
    paddingVertical: SIZING.PADDING.small,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZING.PADDING.medium,
  },
  skillRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBlue,
  },
  skillIconBox: {
    width: 48,
    height: 48,
    borderRadius: SIZING.BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZING.MARGIN.medium,
    overflow: 'hidden',
  },
  skillIconLip: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 6,
  },
  skillIcon: {
    fontSize: 26,
    color: COLORS.white,
  },
  skillInfo: { flex: 1 },
  skillNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  skillName: {
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    flex: 1,
    paddingRight: 8,
  },
  skillPct: {
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
  },
  skillTrack: {
    height: 14,
    backgroundColor: COLORS.lightBlue,
    borderRadius: SIZING.BORDER_RADIUS.pill,
    overflow: 'hidden',
  },
  skillFill: {
    height: '100%',
    borderRadius: SIZING.BORDER_RADIUS.pill,
  },

  // ---------- Achievements ----------
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SIZING.GAP / 2,
  },
  achievementCell: {
    width: '50%',
    padding: SIZING.GAP / 2,
  },
  achievementWrap: {
    position: 'relative',
    paddingRight: BLOCK_OFFSET,
    paddingBottom: BLOCK_OFFSET,
  },
  achievementLip: {
    position: 'absolute',
    top: BLOCK_OFFSET,
    left: BLOCK_OFFSET,
    right: 0,
    bottom: 0,
    borderRadius: SIZING.BORDER_RADIUS.large,
  },
  achievementFace: {
    borderRadius: SIZING.BORDER_RADIUS.large,
    padding: SIZING.PADDING.medium,
    alignItems: 'center',
    minHeight: 172,
  },
  achievementIconBox: {
    width: 64,
    height: 64,
    borderRadius: SIZING.BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  achievementIcon: { fontSize: 36 },
  achievementName: {
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: TYPOGRAPHY.SIZES.small,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    textAlign: 'center',
    opacity: 0.95,
  },
  achievementLocked: {
    borderRadius: SIZING.BORDER_RADIUS.large,
    padding: SIZING.PADDING.medium,
    alignItems: 'center',
    minHeight: 172,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.lightBlue,
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  achievementLockIcon: {
    fontSize: 40,
    marginBottom: 10,
    opacity: 0.45,
  },
  achievementLockedName: {
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.textSoft,
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementLockedDesc: {
    fontSize: TYPOGRAPHY.SIZES.small,
    color: COLORS.textSoft,
    textAlign: 'center',
  },
});

export default ProgressScreen;
