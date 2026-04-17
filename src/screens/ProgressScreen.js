import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, StatusBar } from 'react-native';
import { t } from '../utils/i18n';
import { useProgress } from '../contexts/ProgressContext';
import { useReward } from '../contexts/RewardContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { COLORS, SIZING, TYPOGRAPHY } from '../utils/constants';

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
    <ImageBackground
      source={require('../../assets/professor-corgi.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('progress.title')}</Text>
        </View>

        {/* Tree Visualization */}
        <Card style={styles.treeCard}>
          <Text style={styles.treeEmoji}>🌳</Text>
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
        </Card>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>🍃</Text>
            <Text style={styles.statValue}>{treeState.leaves}</Text>
            <Text style={styles.statLabel}>{t('progress.leaves_earned')}</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>✨</Text>
            <Text style={styles.statValue}>{treeState.sparks}</Text>
            <Text style={styles.statLabel}>{t('progress.sparks_earned')}</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>📚</Text>
            <Text style={styles.statValue}>{stats.totalLessons}</Text>
            <Text style={styles.statLabel}>{t('progress.lessons_completed')}</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>🎮</Text>
            <Text style={styles.statValue}>{stats.totalGames}</Text>
            <Text style={styles.statLabel}>{t('progress.games_played')}</Text>
          </Card>
        </View>

        {/* Skills Development */}
        <Card style={styles.skillsCard}>
          <Text style={styles.sectionTitle}>{t('progress.skills_developing')}</Text>
          
          <View style={styles.skillItem}>
            <Text style={styles.skillIcon}>➕</Text>
            <View style={styles.skillInfo}>
              <Text style={styles.skillName}>{t('progress.understanding_addition')}</Text>
              <View style={styles.skillBar}>
                <View style={[styles.skillFill, { width: `${skillPercent(skills.addition)}%`, backgroundColor: COLORS.success }]} />
              </View>
            </View>
          </View>

          <View style={styles.skillItem}>
            <Text style={styles.skillIcon}>➖</Text>
            <View style={styles.skillInfo}>
              <Text style={styles.skillName}>{t('progress.understanding_subtraction')}</Text>
              <View style={styles.skillBar}>
                <View style={[styles.skillFill, { width: `${skillPercent(skills.subtraction)}%`, backgroundColor: COLORS.path }]} />
              </View>
            </View>
          </View>

          <View style={styles.skillItem}>
            <Text style={styles.skillIcon}>🔢</Text>
            <View style={styles.skillInfo}>
              <Text style={styles.skillName}>{t('progress.pattern_recognition')}</Text>
              <View style={styles.skillBar}>
                <View style={[styles.skillFill, { width: `${skillPercent(skills.patternRecognition)}%`, backgroundColor: COLORS.softPurple }]} />
              </View>
            </View>
          </View>

          <View style={styles.skillItem}>
            <Text style={styles.skillIcon}>🧠</Text>
            <View style={styles.skillInfo}>
              <Text style={styles.skillName}>{t('progress.logical_thinking')}</Text>
              <View style={styles.skillBar}>
                <View style={[styles.skillFill, { width: `${skillPercent(skills.logicalThinking)}%`, backgroundColor: COLORS.mint }]} />
              </View>
            </View>
          </View>
        </Card>

        <Button
          title={t('common.back')}
          onPress={() => navigation.goBack()}
          variant="secondary"
          style={styles.backButton}
        />
        
        <StatusBar barStyle="dark-content" />
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZING.PADDING.large,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZING.MARGIN.large,
  },
  title: {
    fontSize: TYPOGRAPHY.SIZES.heading,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    backgroundColor: COLORS.overlay,
    paddingHorizontal: SIZING.PADDING.large,
    paddingVertical: SIZING.PADDING.medium,
    borderRadius: SIZING.BORDER_RADIUS.large,
  },
  treeCard: {
    alignItems: 'center',
    marginBottom: SIZING.MARGIN.large,
  },
  treeEmoji: {
    fontSize: 80,
    marginBottom: SIZING.MARGIN.medium,
  },
  treeStage: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SIZING.MARGIN.medium,
  },
  progressBar: {
    width: '100%',
    height: 20,
    backgroundColor: COLORS.lightBlue,
    borderRadius: SIZING.BORDER_RADIUS.medium,
    overflow: 'hidden',
    marginBottom: SIZING.MARGIN.small,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.grass,
  },
  progressText: {
    fontSize: TYPOGRAPHY.SIZES.small,
    color: COLORS.text,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZING.MARGIN.large,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: SIZING.MARGIN.medium,
  },
  statEmoji: {
    fontSize: 40,
    marginBottom: SIZING.MARGIN.small,
  },
  statValue: {
    fontSize: TYPOGRAPHY.SIZES.heading,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.path,
    marginBottom: SIZING.MARGIN.small,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.SIZES.small,
    color: COLORS.text,
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
    fontSize: 30,
    marginRight: SIZING.MARGIN.medium,
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: TYPOGRAPHY.SIZES.body,
    color: COLORS.text,
    marginBottom: SIZING.MARGIN.small,
  },
  skillBar: {
    height: 12,
    backgroundColor: COLORS.lightBlue,
    borderRadius: SIZING.BORDER_RADIUS.small,
    overflow: 'hidden',
  },
  skillFill: {
    height: '100%',
  },
  backButton: {
    marginBottom: SIZING.MARGIN.large,
  },
});

export default ProgressScreen;

