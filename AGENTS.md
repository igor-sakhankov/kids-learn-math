# Agent Instructions - Kids Learn Math

This document provides guidance for AI assistants (LLMs) working with this codebase.

## App Architecture

### Technology Stack
- **Framework**: Bare React Native 0.74.1 (no Expo)
- **Language**: JavaScript (ES6+)
- **Platform**: Android (primary), iOS support can be added
- **JS Engine**: Hermes (enabled for performance)
- **Build System**: Gradle 8.3
- **Bundle**: Metro bundler

### Project Structure

```
kids-learn-math/
├── android/              # Native Android project (Gradle, Java)
├── assets/              # Static assets (images)
├── App.js               # Main application component
├── index.js             # App entry point (AppRegistry)
├── package.json         # Dependencies and scripts
├── metro.config.js      # Metro bundler configuration
└── babel.config.js      # Babel transpilation config
```

## Code Patterns & Conventions

### State Management
- **Current**: React hooks (`useState`, `useEffect`)
- **Pattern**: Functional components only
- **No external state library** (Redux, MobX, etc.)

### Component Structure
- Single main component in `App.js`
- Uses React Native core components: `View`, `Text`, `TextInput`, `Button`, `ImageBackground`, `StatusBar`
- StyleSheet API for styling (no styled-components)

### Business Logic
- Math question generation: Random integers 0-10
- Operations: Addition (+) and Subtraction (-)
- Subtraction constraint: Always positive results (larger number first)
- Immediate feedback on answer submission

### Styling Approach
- **Color palette** defined at top of component
- **StyleSheet.create()** for all styles
- **Semi-transparent overlay** for content readability over background image
- **No external styling libraries** (no NativeWind, Tailwind, etc.)

## Development Guidelines

### When Adding Features
1. **Keep it simple**: This is an educational app for kids
2. **Maintain bare RN structure**: No Expo dependencies
3. **Test on Android**: Primary platform
4. **Follow existing patterns**: Functional components, hooks, StyleSheet

### When Modifying Code
- Preserve the color scheme defined in `colors` object
- Keep the professor corgi background image
- Maintain kid-friendly UI/UX (large fonts, clear feedback)
- Test math logic edge cases (subtraction results, input validation)

### When Debugging
- Check Metro bundler is running (`npm start`)
- Verify device connection (`adb devices`)
- Clear caches if needed (`npm start -- --reset-cache`)
- Clean Android build (`cd android && ./gradlew clean`)

## Build System

### Android Configuration
- **Package**: `com.kidslearnmath`
- **Min SDK**: 23 (Android 6.0)
- **Target SDK**: 34 (Android 14)
- **Build Tools**: 34.0.0

### Scripts
- `npm start` - Start Metro bundler
- `npm run android` - Build and run on Android
- `npm test` - Placeholder (no tests currently)

## Technical Constraints

### What to Avoid
- Do not add Expo dependencies
- Do not use experimental React Native features (New Architecture is disabled)
- Do not add heavy libraries without discussion (keep bundle size reasonable)
- Do not modify native Android code without testing thoroughly

### What to Consider
- This is a learning project - prioritize clarity over complexity
- Performance matters (kids expect instant feedback)
- Accessibility is important but not yet implemented
- No backend/API - fully client-side app

## Future Enhancement Ideas
- Score tracking and persistence
- Difficulty levels (larger numbers, multiplication/division)
- Timer/speed challenges
- Multiple mascots or themes
- Sound effects and animations
- iOS support
- Accessibility features (VoiceOver, TalkBack)
- Unit tests and E2E tests

## Common Tasks

### Adding a New Feature
1. Modify `App.js` (or create new component)
2. Update state management if needed
3. Add styling to StyleSheet
4. Test on Android device/emulator
5. Update README if user-facing

### Updating Dependencies
1. Update `package.json`
2. Run `npm install`
3. Test build: `npm run android`
4. Clear caches if issues arise

### Troubleshooting Build Issues
1. Stop Metro: `lsof -ti:8081 | xargs kill -9`
2. Clean Android: `cd android && ./gradlew clean && cd ..`
3. Clear Metro cache: `npm start -- --reset-cache`
4. Reinstall dependencies: `rm -rf node_modules && npm install`
5. Check Android SDK path in `android/local.properties`

## Code Quality Standards

- Use meaningful variable names
- Keep functions small and focused
- Comment complex logic (especially math calculations)
- Follow React best practices (hooks rules, component structure)
- Maintain consistent code formatting
- Handle edge cases (empty input, NaN, etc.)

## Testing Approach

Currently no automated tests. When adding tests:
- Use Jest for unit tests
- Use React Native Testing Library for component tests
- Consider Detox for E2E tests
- Focus on math logic and user interactions

---

**Remember**: This app is designed for children. Keep interactions simple, feedback immediate, and the experience delightful!
