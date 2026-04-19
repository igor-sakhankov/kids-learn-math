import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../utils/i18n';
import { useProgress } from '../contexts/ProgressContext';
import { useReward } from '../contexts/RewardContext';
import Card from '../components/common/Card';
import ScreenBackground from '../components/common/ScreenBackground';
import BackButton from '../components/common/BackButton';
import { COLORS, SIZING, TYPOGRAPHY, SHADOWS } from '../utils/constants';

// Number of correct answers a skill needs to fill its bar.
const SKILL_MASTERY_TARGET = 20;

const skillPercent = (count) =>
  Math.min(100, Math.round(((count || 0) / SKILL_MASTERY_TARGET) * 100));

const ProgressScreen = ({ navigation }) => {
  const { progress, getStats } = useProgress();
  const { treeState, getGrowthProgress } = useReward();
  const stats = getStats();
  const growth = getGrowthProgress();
  const skills = progress.skillsTracked;

  return (
    <ScreenBackground tint="mint">
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <BackButton onPress={() => navigation.goBack()} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Tree Visualization */}
          <Card style={styles.treeCard} padding={false}>
            <View style={styles.treeHero}>
              <Text style={styles.treeEmoji}>🌳</Text>
            </View>
            <View style={styles.treeBody}>
              <Text style={styles.treeStage}>
                {t(`progress.tree_stage.${treeState.stage}`)}
              </Text>

              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${growth.progress}%` }]} />
              </View>

              {growth.next && (
                <Text style={styles.progressText}>
                  {t('progress.until_next', {
                    count: growth.leavesUntilNext,
                    stage: t(`progress.tree_stage.${growth.next.name}`),
                  })}
                </Text>
              )}
            </View>
          </Card>

          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <StatChip emoji="🍃" value={treeState.leaves} label={t('progress.leaves_earned')} color={COLORS.mint} />
            <StatChip emoji="✨" value={treeState.sparks} label={t('progress.sparks_earned')} color={COLORS.warmYellow} />
            <StatChip emoji="📚" value={stats.totalLessons} label={t('progress.lessons_completed')} color={COLORS.lightBlue} />
            <StatChip emoji="🎮" value={stats.totalGames} label={t('progress.games_played')} color={COLORS.peach} />
          </View>

          {/* Skills Development */}
          <Card style={styles.skillsCard}>
            <Text style={styles.sectionTitle}>{t('progress.skills_developing')}</Text>

            <SkillRow
              icon="➕"
              name={t('progress.understanding_addition')}
              percent={skillPercent(skills.addition)}
              color={COLORS.success}
            />
            <SkillRow
              icon="➖"
              name={t('progress.understanding_subtraction')}
              percent={skillPercent(skills.subtraction)}
              color={COLORS.pathDeep}
            />
            <SkillRow
              icon="🔢"
              name={t('progress.pattern_recognition')}
              percent={skillPercent(skills.patternRecognition)}
              color={COLORS.softPurpleDeep}
            />
            <SkillRow
              icon="🧠"
              name={t('progress.logical_thinking')}
              percent={skillPercent(skills.logicalThinking)}
              color={COLORS.mintDeep}
            />
          </Card>

        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
};

const StatChip = ({ emoji, value, label, color }) => (
  <View style={[styles.statChip, { backgroundColor: color }]}>
    <Text style={styles.statEmoji}>{emoji}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const SkillRow = ({ icon, name, percent, color }) => (
  <View style={styles.skillItem}>
    <Text style={styles.skillIcon}>{icon}</Text>
    <View style={styles.skillInfo}>
      <View style={styles.skillNameRow}>
        <Text style={styles.skillName}>{name}</Text>
        <Text style={[styles.skillPct, { color }]}>{percent}%</Text>
      </View>
      <View style={styles.skillBar}>
        <View style={[styles.skillFill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    padding: SIZING.PADDING.large,
    paddingTop: SIZING.PADDING.xlarge + SIZING.SECONDARY_TARGET,
    paddingBottom: SIZING.PADDING.xlarge,
  },
  treeCard: {
    marginBottom: SIZING.MARGIN.large,
    alignItems: 'center',
  },
  treeHero: {
    width: '100%',
    backgroundColor: COLORS.bgSky,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZING.PADDING.large,
  },
  treeEmoji: { fontSize: 120 },
  treeBody: {
    width: '100%',
    padding: SIZING.PADDING.large,
    alignItems: 'center',
  },
  treeStage: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SIZING.MARGIN.medium,
  },
  progressBar: {
    width: '100%',
    height: 24,
    backgroundColor: COLORS.lightBlue,
    borderRadius: SIZING.BORDER_RADIUS.pill,
    overflow: 'hidden',
    marginBottom: SIZING.MARGIN.small,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.grassDeep,
    borderRadius: SIZING.BORDER_RADIUS.pill,
  },
  progressText: {
    fontSize: TYPOGRAPHY.SIZES.body,
    color: COLORS.textSoft,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: SIZING.MARGIN.large,
  },
  statChip: {
    width: '48%',
    margin: '1%',
    alignItems: 'center',
    padding: SIZING.PADDING.medium,
    borderRadius: SIZING.BORDER_RADIUS.large,
    ...SHADOWS.soft,
  },
  statEmoji: { fontSize: 40, marginBottom: 4 },
  statValue: {
    fontSize: TYPOGRAPHY.SIZES.heading,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.SIZES.body,
    color: COLORS.textSoft,
    textAlign: 'center',
  },
  skillsCard: {
    marginBottom: SIZING.MARGIN.large,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SIZING.MARGIN.large,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZING.MARGIN.large,
  },
  skillIcon: {
    fontSize: 32,
    marginRight: SIZING.MARGIN.medium,
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
  skillBar: {
    height: 14,
    backgroundColor: COLORS.lightBlue,
    borderRadius: SIZING.BORDER_RADIUS.pill,
    overflow: 'hidden',
  },
  skillFill: {
    height: '100%',
    borderRadius: SIZING.BORDER_RADIUS.pill,
  },
});

export default ProgressScreen;
