# Quick Start Guide - Kids Learn Math

## Immediate Testing (5 Minutes)

### 1. Start the App

```bash
# Terminal 1: Start Metro bundler
npm start

# Terminal 2: Run on Android
npm run android
```

### 2. Test Basic Flow

1. **Welcome Screen** - Tap "Let's Start!"
2. **Main Menu** - Browse learning modules and games
3. **Settings** - Test language switching (EN/RU/ES)
4. **Learning Module** - Try "Addition" → Select difficulty → Solve problems
5. **Progress** - Check your Tree of Reason

### 3. Test All Features

#### Learning Modules
- ✅ Addition Visual (visual objects + equations)
- ✅ Subtraction Visual (object removal visualization)
- ✅ Story Problems (contextual word problems)

#### Games
- ✅ Number Labyrinth (multiple choice navigation)
- ✅ Find the Pair (memory card matching)
- ✅ Lost Numbers (sequence completion)

#### Settings
- ✅ Language switch (EN ↔ RU ↔ ES)
- ✅ Audio toggles (prepared for future)
- ✅ Accessibility options

#### Progress
- ✅ Tree visualization
- ✅ Stats display (leaves, sparks, lessons, games)
- ✅ Skill development progress bars

## What You'll See

### Current State (Placeholders)
- **Visual Objects**: Emoji (🍎🧊🧸🐦🌸⭐)
- **Robot Logik**: Emoji (🤖)
- **Tree**: Text + progress bar
- **Backgrounds**: Professor Corgi photo

### Functional Features
- ✅ Smooth navigation
- ✅ Language switching
- ✅ Progress persistence
- ✅ Score tracking
- ✅ Immediate feedback
- ✅ Difficulty levels

## Testing Checklist

### Essential Tests
- [ ] App launches without crashes
- [ ] Navigate between all screens
- [ ] Switch languages (observe UI update)
- [ ] Complete a learning lesson (10 questions)
- [ ] Play each game to completion
- [ ] Check progress persists after app restart
- [ ] Settings persist after app restart

### Language Testing
- [ ] Switch to Russian - verify Cyrillic displays
- [ ] Switch to Spanish - verify accents display
- [ ] Story problems translate correctly
- [ ] Robot Logik messages translate

### Progress Testing
- [ ] Complete a lesson → verify +1 leaf
- [ ] Complete a game → verify sparks awarded
- [ ] Check progress screen updates
- [ ] Restart app → verify progress persisted

### Edge Cases
- [ ] Try invalid input (non-numbers)
- [ ] Navigate back from any screen
- [ ] Switch language mid-lesson
- [ ] Rapid button tapping

## Common Issues & Solutions

### Metro Bundler Issues
```bash
# Clear cache and restart
npm start -- --reset-cache
```

### Build Errors
```bash
# Clean build
cd android && ./gradlew clean && cd ..
npm install
npm run android
```

### Port 8081 In Use
```bash
# Kill existing Metro
lsof -ti:8081 | xargs kill -9
npm start
```

## Expected Behavior

### On First Launch
1. Welcome screen appears with Robot emoji
2. Language detected from device (or defaults to English)
3. Empty progress (0 leaves, 0 sparks)

### After Completing Activities
1. Tree gains leaves (1 per lesson)
2. Sparks collected from games
3. Progress stats update
4. Skills progress bars increase

### On Language Switch
1. All UI text updates immediately
2. Preference saved
3. Story problems regenerate in new language
4. Robot messages update

## Performance Expectations

### Should Be Smooth
- Screen transitions
- Button taps
- Text input
- Navigation

### May Have Delays (Acceptable for MVP)
- First screen load (context initialization)
- Language switching (re-render all components)
- Progress save/load (AsyncStorage operations)

## What to Report

### Critical Issues
- App crashes
- Navigation breaks
- Data loss
- Build failures

### Enhancement Opportunities
- UX improvements
- Visual feedback
- Animation needs
- Content issues

### Known Limitations (Expected)
- Emoji placeholders (not issues)
- No sound (not implemented yet)
- Basic animations (planned for Phase 2)
- No onboarding (planned for Phase 6)

## Next Steps After Testing

1. **Provide Feedback** on user experience
2. **Test Pedagogy** with target age group (6-10 years)
3. **Review Asset Specs** (ASSET_SPECIFICATIONS.md)
4. **Plan Asset Creation** for Phase 2
5. **Consider Audio** requirements

## Development Workflow

### Making Changes
```bash
# 1. Edit code in /src
# 2. Save file
# 3. Metro auto-reloads (or press 'r' in Metro terminal)
# 4. Test changes immediately
```

### Adding New Content
```bash
# Add to translation files
src/locales/en.json
src/locales/ru.json  
src/locales/es.json

# Add to question generator
src/utils/questionGenerator.js

# Add to constants
src/utils/constants.js
```

### Testing on Different Devices
```bash
# Check connected devices
adb devices

# Install on specific device
adb -s DEVICE_ID install android/app/build/outputs/apk/debug/app-debug.apk
```

## Useful Commands

```bash
# View logs
npx react-native log-android

# Clear app data
adb shell pm clear com.kidslearnmath

# Take screenshot
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png

# Check bundle size
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output /tmp/bundle.js
ls -lh /tmp/bundle.js
```

## Support

- **Documentation**: See README.md for full details
- **Architecture**: See AGENTS.md (or CLAUDE.md) for code structure
- **Product spec**: See requirements/prd.md and requirements/1. MVP.md
- **Assets**: See ASSET_SPECIFICATIONS.md for design guidelines

## Success Criteria

After 5-10 minutes of testing, you should be able to:
- ✅ Navigate all screens smoothly
- ✅ Switch languages and see changes
- ✅ Complete a full lesson
- ✅ Play all three games
- ✅ See progress update
- ✅ Understand the pedagogical approach

If you can do all of the above, **Phase 1 MVP is successful!** 🎉

---

Ready to test? Run `npm start` and `npm run android`!

