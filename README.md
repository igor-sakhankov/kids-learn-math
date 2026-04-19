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

### ✅ Completed (Phase 1 — MVP core)
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
- [x] Tree of Reason progress system (stage model + growth bar)
- [x] Kids-friendly design refresh (tinted backgrounds, TileButton, NumberPad, DifficultyPicker)
- [x] Android build hardening (JDK 17 pinned via `.sdkmanrc`)

### 🚧 In Progress (Phase 2 — Polish & motivation loop)
- [ ] Custom visual assets (Robot Logik character) — blocked on art production
- [ ] Visual learning objects (apples, cubes, etc.) — blocked on art production
- [ ] Animated Tree of Reason (reanimated growth transitions; tree visual still emoji)
- [ ] Achievement badges — context scaffolding exists; not wired to screens or triggered from gameplay
- [ ] Enhanced animations across lesson/game feedback (reanimated plugin configured, zero call-sites yet)

### 📋 Planned (Phase 3-7)
- [ ] Audio system (voice guidance, sound effects)
- [ ] Custom backgrounds
- [ ] Onboarding flow (structured Robot Logik intro per MVP spec §UX)
- [ ] Parent dashboard
- [ ] Weekly progress reports
- [ ] Unit and integration tests (start with `questionGenerator.js` + context reducers)
- [ ] Performance optimization
- [ ] iOS support

### 🎯 Next milestone — **M2.1: Kid-first UX audit & refinement (ages 5-9)**

Ship a per-screen audit + fix pass so every screen is intuitive, forgiving, and reachable for a 5-year-old. **This milestone must land before M2.2** — wiring more rewards on top of clumsy controls wastes the reward.

#### Universal kid-UX checklist (ages 5-9)
Apply to every screen. Track deviations; fix or justify each.

- **Touch targets ≥ 64pt** for primary actions (current `SIZING.MIN_TOUCH_TARGET` = 48; bump to 64 and add `SIZING.PRIMARY_TARGET` = 72). Secondary/back ≥ 56pt.
- **Spacing between tap targets ≥ 16pt** so a stray finger can't hit two at once.
- **Body text ≥ 20pt, primary prompts ≥ 24pt, headings ≥ 32pt.** Raise `TYPOGRAPHY.SIZES.body` from 18 → 20. No screen may rely on `tiny` (14pt) for anything a child reads.
- **One primary action per screen.** It must be the largest, most colorful, and in the natural thumb zone (bottom-center on phones).
- **Back / exit always top-left, same icon, same size.** Never hide behind a gesture.
- **Affordance without reading.** Every control recognizable via icon + color + shape. Labels reinforce, don't gate.
- **Error-tolerance.** No red flashes for wrong answers in lessons; gentle shake + hint after 2 tries (already configured via `GAME_CONFIG.HINT_AFTER_ATTEMPTS`). Never block progress.
- **Feedback latency.** Tap must produce visual change < 100ms (scale/press state). Verify every `TouchableOpacity` / `Pressable` has a pressed-state.
- **Reading load.** No screen should require more than one short sentence of reading. Use illustration + number first.
- **Modal discipline.** No text-only modals. Dismiss must be a huge obvious button, not an `×`.
- **Drag interactions** (if any) must have a tap-to-select fallback — kids' drag precision is unreliable.
- **Colors carry meaning only with a second cue** (icon or shape) — ~8% of boys are colorblind.
- **No timers, no countdowns, no fail states.** Already a product rule (AGENTS.md); reconfirm per screen.

#### Per-screen review matrix
For each screen, produce a short audit note (what works, what fails the checklist, fix list) and ship the fix in the same PR as the audit.

| Screen | Specific things to verify |
|---|---|
| `WelcomeScreen` | Start button is the single biggest target; language switch (if any) not mistakable for start; Robot Logik greeting prominent. |
| `MainMenuScreen` | Four tiles are equal-weight, each ≥ 120pt square, have icon + label + color. No text-only entries. |
| `ProgressScreen` | Tree visible without scrolling on a 5" phone; skill bars readable from 50cm; back button reachable with thumb. |
| `SettingsScreen` | Toggles ≥ 56pt; language chips show flag **and** name; no nested lists. |
| `AdditionVisualScreen` / `SubtractionVisualScreen` | Objects (apples/cubes) ≥ 72pt; answer input area thumb-reachable; hint appears after 2 wrong tries and is a big button, not a link. |
| `StoryProblemsScreen` | Story text ≥ 22pt; illustration carries the story if child can't read; answer choices ≥ 72pt. |
| `NumberLabyrinthScreen` | Path/door tap targets ≥ 72pt; wrong door triggers "Robot thinks" pause, not a red fail; current position always visible. |
| `FindPairScreen` | Cards ≥ 88pt square; matched pair animates out clearly; mismatched pair flips back with no penalty text. |
| `LostNumbersScreen` | Blank slot obvious (pulsing placeholder); number options ≥ 72pt in a single row/grid, no scrolling. |

#### Concrete deliverables
1. **Audit doc** `requirements/ux-audit-ages-5-9.md` — per-screen findings + screenshots (emulator is fine), one section per screen.
2. **Design-token updates** in `src/utils/constants.js`: new `SIZING.PRIMARY_TARGET`, bump `MIN_TOUCH_TARGET` to 64, body typography bump, new `SIZING.GAP` token for inter-target spacing.
3. **Per-screen fix PRs** (or one bundled PR if diffs stay small) that bring each screen to checklist compliance; each commit references the audit section it closes.
4. **Lint/guardrails** — add a one-page note to `AGENTS.md` under "Conventions" stating the kid-UX rules so regressions are caught in review.
5. **Manual QA pass** on a low-end Android device at 5" and 6" screen sizes, plus landscape check even if the app is portrait-locked.

#### Exit criteria
- Every screen in the matrix has an audit section with status = "pass".
- Zero primary-action targets below 64pt; zero body text below 20pt; zero back buttons moved from top-left.
- AGENTS.md documents the kid-UX rules.
- A teammate (or Claude) can hand the app to a 6-year-old and watch them navigate to a lesson, complete it, and see their tree grow **without adult help**.

---

### M2.2 — Motivation loop online (after M2.1 passes)
Self-contained code-only slice that lights up the reward system:
1. **Wire achievements end-to-end** — define a small catalog (`first_lesson`, `streak_3`, `logical_move`, `tree_sprout`), call `unlockAchievement` from `completeLesson` / `completeGame` / `recordAttempt`, and surface earned badges in `ProgressScreen`.
2. **Animate the Tree of Reason** — use `react-native-reanimated` (already installed) for the growth-bar fill, stage-up flourish, and leaf/spark increments.
3. **Reward-event toast** — a lightweight in-app toast/modal on leaf, spark, or badge earn, closing the feedback loop from MVP spec §Story 4.1.

### M2.3+ — Asset-dependent polish
Custom Robot Logik art, visual learning objects, voice audio, and onboarding flow — unblocked once asset production lands.

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