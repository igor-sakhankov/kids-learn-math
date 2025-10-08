import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, StatusBar, TouchableOpacity } from 'react-native';
import { t } from '../utils/i18n';
import Card from '../components/common/Card';
import { COLORS, SIZING, TYPOGRAPHY } from '../utils/constants';

const MainMenuScreen = ({ navigation }) => {
  const menuItems = [
    {
      id: 'learn',
      title: t('menu.learn_math'),
      icon: '📚',
      items: [
        { id: 'addition', title: t('learning.addition'), screen: 'AdditionVisual' },
        { id: 'subtraction', title: t('learning.subtraction'), screen: 'SubtractionVisual' },
        { id: 'stories', title: t('learning.story_problems'), screen: 'StoryProblems' },
      ],
    },
    {
      id: 'games',
      title: t('menu.play_games'),
      icon: '🎮',
      items: [
        { id: 'labyrinth', title: t('games.number_labyrinth'), screen: 'NumberLabyrinth' },
        { id: 'pairs', title: t('games.find_pair'), screen: 'FindPair' },
        { id: 'sequences', title: t('games.lost_numbers'), screen: 'LostNumbers' },
      ],
    },
  ];

  return (
    <ImageBackground
      source={require('../../assets/professor-corgi.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('menu.title')}</Text>
        </View>

        {menuItems.map((section) => (
          <Card key={section.id} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>{section.icon}</Text>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            
            <View style={styles.itemsContainer}>
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => navigation.navigate(item.screen)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuItemText}>{item.title}</Text>
                  <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        ))}

        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => navigation.navigate('Progress')}
          >
            <Text style={styles.bottomButtonIcon}>🌳</Text>
            <Text style={styles.bottomButtonText}>{t('menu.my_progress')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.bottomButtonIcon}>⚙️</Text>
            <Text style={styles.bottomButtonText}>{t('menu.settings')}</Text>
          </TouchableOpacity>
        </View>
        
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
  sectionCard: {
    marginBottom: SIZING.MARGIN.large,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZING.MARGIN.medium,
  },
  sectionIcon: {
    fontSize: 32,
    marginRight: SIZING.MARGIN.medium,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
  },
  itemsContainer: {
    gap: SIZING.MARGIN.small,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.lightBlue,
    padding: SIZING.PADDING.medium,
    borderRadius: SIZING.BORDER_RADIUS.medium,
    minHeight: SIZING.MIN_TOUCH_TARGET,
  },
  menuItemText: {
    fontSize: TYPOGRAPHY.SIZES.subtitle,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
  },
  menuItemArrow: {
    fontSize: TYPOGRAPHY.SIZES.heading,
    color: COLORS.path,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SIZING.MARGIN.large,
    gap: SIZING.MARGIN.medium,
  },
  bottomButton: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    padding: SIZING.PADDING.large,
    borderRadius: SIZING.BORDER_RADIUS.large,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  bottomButtonIcon: {
    fontSize: 40,
    marginBottom: SIZING.MARGIN.small,
  },
  bottomButtonText: {
    fontSize: TYPOGRAPHY.SIZES.body,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default MainMenuScreen;

