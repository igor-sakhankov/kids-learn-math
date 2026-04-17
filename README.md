# Kids Learn Math - Educational Platform

A comprehensive educational React Native app inspired by Soviet pedagogical methods, designed for children aged 6-10 to learn mathematics through visual learning, interactive games, and logical thinking exercises.

## About

Kids Learn Math is a bare React Native application (no Expo) that transforms math education into an engaging, character-driven experience featuring **Robot Logik**. The app combines:

- 📚 **Visual Learning Modules** - Addition, Subtraction, and Story Problems
- 🎮 **Logic Games** - Number Labyrinth, Find the Pair, Lost Numbers
- 🌳 **Progress Tracking** - Tree of Reason reward system
- 🌍 **Multilingual Support** - English, Russian, and Spanish
- 🎯 **Pedagogical Foundation** - Based on Soviet educational methodology (Moró, Petersen, Kolmogorov)

## Features

### Learning Modules
- **Addition Visual** - Learn addition by combining groups of objects (apples, cubes, bears)
- **Subtraction Visual** - Understand subtraction by removing objects
- **Story Problems** - Apply math skills to real-world scenarios with illustrated stories

### Logic Games
- **Number Labyrinth** - Navigate through a maze by solving equations
- **Find the Pair** - Memory game matching equations with answers
- **Lost Numbers** - Complete number sequences to develop pattern recognition

### Progress & Motivation
- **Tree of Reason** - Visual tree that grows with each completed lesson
- **Achievement System** - Earn badges for logical thinking and persistence
- **Progress Dashboard** - Track skills development (no stress metrics)
- **Reward System** - Collect leaves and logic sparks

### Settings & Accessibility
- **Language Selection** - Switch between English, Russian, and Spanish
- **Audio Controls** - Toggle music, sound effects, and voice guidance
- **Accessibility Options** - High contrast, large text, reduced motion

## Project Structure

```
kids-learn-math/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components (Button, Card)
│   │   ├── RobotLogik.js    # Animated character (planned)
│   │   ├── TreeOfReason.js  # Progress visualization (planned)
│   │   └── ...
│   ├── screens/
│   │   ├── WelcomeScreen.js        # App entry point
│   │   ├── MainMenuScreen.js       # Main navigation hub
│   │   ├── ProgressScreen.js       # Progress tracking
│   │   ├── SettingsScreen.js       # App settings
│   │   ├── learning/               # Learning module screens
│   │   │   ├── AdditionVisualScreen.js
│   │   │   ├── SubtractionVisualScreen.js
│   │   │   └── StoryProblemsScreen.js
│   │   └── games/                  # Game screens
│   │       ├── NumberLabyrinthScreen.js
│   │       ├── FindPairScreen.js
│   │       └── LostNumbersScreen.js
│   ├── contexts/
│   │   ├── SettingsContext.js      # Language, audio, accessibility
│   │   ├── ProgressContext.js      # Learning progress tracking
│   │   └── RewardContext.js        # Tree growth, achievements
│   ├── utils/
│   │   ├── constants.js            # Colors, configs, difficulty levels
│   │   ├── i18n.js                 # Internationalization setup
│   │   ├── storage.js              # AsyncStorage helpers
│   │   └── questionGenerator.js    # Math question generation
│   ├── locales/
│   │   ├── en.json                 # English translations
│   │   ├── ru.json                 # Russian translations
│   │   └── es.json                 # Spanish translations
│   ├── assets/
│   │   ├── characters/             # Robot Logik sprites (planned)
│   │   ├── objects/                # Visual learning objects (planned)
│   │   ├── backgrounds/            # Scene backgrounds (planned)
│   │   └── icons/                  # UI icons and badges (planned)
│   └── navigation/
│       └── AppNavigator.js         # React Navigation setup
├── android/                        # Native Android project
├── App.js                          # Root component with context providers
├── index.js                        # App entry point
├── ASSET_SPECIFICATIONS.md         # Asset design guidelines
└── AGENTS.md                       # Agent instructions

```

## Technology Stack

- **Framework**: React Native 0.74.1 (Bare workflow, no Expo)
- **Language**: JavaScript (ES6+)
- **Navigation**: React Navigation 6.x
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **Internationalization**: i18n-js + react-native-localize
- **Animations**: react-native-reanimated
- **Platform**: Android (primary), iOS support planned

## Running Locally

### Prerequisites

- **Node.js** (v16 or higher)
- **Java Development Kit (JDK)** 17 or higher
- **Android Studio** with Android SDK
- **Android SDK Platform 34** and Build Tools 34.0.0
- **Android Emulator** or physical Android device with USB debugging enabled

### Environment Setup

Add to your `~/.zshrc` or `~/.bash_profile`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Then reload: `source ~/.zshrc`

### Installation & Running

```bash
# Install dependencies
npm install

# Start Metro bundler (Terminal 1)
npm start

# Run on Android (Terminal 2)
npm run android
```

Make sure you have either an Android emulator running or a physical device connected before running `npm run android`. Verify with: `adb devices`

## Development

### Adding New Features

1. **New Screen**: Create in `/src/screens/` and add to `AppNavigator.js`
2. **New Component**: Add to `/src/components/` (common for reusable)
3. **New Translation**: Update all three files in `/src/locales/`
4. **New Constants**: Add to `/src/utils/constants.js`

### State Management

The app uses React Context for state:
- **SettingsContext**: Language, sound preferences, accessibility
- **ProgressContext**: Lessons completed, scores, attempt history
- **RewardContext**: Tree growth, achievements, unlocked zones

### Adding Translations

Edit `/src/locales/{en,ru,es}.json`:

```json
{
  "new_section": {
    "key": "English value"
  }
}
```

Use in components:
```javascript
import { t } from '../utils/i18n';

<Text>{t('new_section.key')}</Text>
```

### Generating Questions

Use utilities from `/src/utils/questionGenerator.js`:

```javascript
import { generateQuestion, generateVisualQuestion, generateStoryProblem } from '../utils/questionGenerator';

const question = generateQuestion('easy', '+'); // Basic question
const visual = generateVisualQuestion('medium', '-'); // With objects
const story = generateStoryProblem('hard', '+', t); // Story context
```

## Troubleshooting

**Port 8081 already in use:**
```bash
lsof -ti:8081 | xargs kill -9
```

**Clean build:**
```bash
cd android && ./gradlew clean && cd ..
npm start -- --reset-cache
```

**Metro bundler cache issues:**
```bash
npm start -- --reset-cache
```

**Dependencies not found:**
```bash
rm -rf node_modules
npm install
cd android && ./gradlew clean && cd ..
```

**Android build fails:**
```bash
cd android
./gradlew clean
./gradlew installDebug
cd ..
```

## MVP Development Status

### ✅ Completed (Phase 1)
- [x] Project restructuring and modular architecture
- [x] Internationalization setup (EN, RU, ES)
- [x] React Navigation implementation
- [x] Context-based state management
- [x] Core UI components (Button, Card)
- [x] Welcome and Main Menu screens
- [x] Settings screen with language selector
- [x] Progress tracking screen
- [x] Addition Visual learning module
- [x] Subtraction Visual learning module
- [x] Story Problems module
- [x] Number Labyrinth game
- [x] Find the Pair game
- [x] Lost Numbers game
- [x] Question generation system
- [x] Progress persistence (AsyncStorage)
- [x] Tree of Reason progress system

### 🚧 In Progress (Phase 2)
- [ ] Custom visual assets (Robot Logik character)
- [ ] Visual learning objects (apples, cubes, etc.)
- [ ] Tree visualization with animations
- [ ] Achievement badges
- [ ] Enhanced animations

### 📋 Planned (Phase 3-7)
- [ ] Audio system (voice guidance, sound effects)
- [ ] Custom backgrounds
- [ ] Onboarding flow
- [ ] Parent dashboard
- [ ] Weekly progress reports
- [ ] Unit and integration tests
- [ ] Performance optimization
- [ ] iOS support

See `requirements/1. MVP.md` and `requirements/prd.md` for the full product spec and roadmap.

## Asset Development

Custom assets are currently placeholders (emoji). See `ASSET_SPECIFICATIONS.md` for:
- Robot Logik character specifications
- Visual learning objects
- Tree of Reason designs
- Achievement badges
- Background scenes
- Audio requirements

Assets can be developed in parallel with code using the specification document.

## Educational Philosophy

Based on Soviet pedagogical methods:
- **From concrete to abstract** - Visual objects before symbols
- **From simple to complex** - Progressive difficulty
- **Learning through discovery** - Encourage reasoning, not memorization
- **Non-competitive motivation** - Internal rewards, no leaderboards
- **Holistic development** - Logic and critical thinking alongside math

References: Moró, Petersen, Dor0feev, Kolmogorov, Zankov, Suhomlinskii.

## Contributing

This is an educational project following specific pedagogical principles. When contributing:

1. Maintain the Soviet educational aesthetic and approach
2. Keep interactions simple and age-appropriate (6-10 years)
3. Ensure all text is translated to EN, RU, and ES
4. Follow the existing code patterns and structure
5. Test on Android devices (primary platform)
6. Keep the app fully offline-capable

## Performance Considerations

- Target: 60fps animations
- Bundle size: Monitor with `react-native-bundle-visualizer`
- Test on lower-end Android devices (min SDK 23)
- Optimize images (compressed PNGs, appropriate sizes)
- Lazy load screens and heavy components

## Accessibility

- Minimum touch target: 44x44pt
- High contrast mode support
- Adjustable text sizes
- VoiceOver/TalkBack support (planned)
- Reduced motion option
- Color-blind friendly palette

## License

MIT License - see LICENSE file for details.

## Credits

- **Pedagogical Approach**: Inspired by Soviet mathematics education
- **Design**: Warm, illustrative style inspired by 1960s-80s educational materials
- **Development**: Built with React Native for cross-platform compatibility

---

**For AI Agents**: See `AGENTS.md` for detailed codebase instructions and development guidelines.