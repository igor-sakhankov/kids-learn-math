# Agent Instructions — Kids Learn Math

Guidance for AI coding assistants working on this repository.

## What this app is

An offline, multilingual React Native app for children aged 6–10 that teaches addition, subtraction, and logical thinking through visual learning modules and minigames. Pedagogy is inspired by Soviet math curricula (Moró, Peterson, Kolmogorov). See `requirements/prd.md` and `requirements/1. MVP.md` for the product spec.

The MVP is implemented (Phase 1 per `README.md`). Visual assets are placeholders (emoji); custom art and audio are planned but not yet in the repo.

## Stack

- React Native **0.74.1** (bare workflow — **no Expo**)
- JavaScript (ES6+), functional components + hooks only
- **React Navigation 6** (`@react-navigation/stack`)
- **React Context** for state (no Redux/MobX)
- **AsyncStorage** for persistence
- **i18n-js** + **react-native-localize** for EN/RU/ES
- **react-native-reanimated** (plugin configured; animations minimal in MVP)
- Android is the primary platform; iOS is not wired up

## Project layout

```
App.js                    Root — wraps providers and AppNavigator
index.js                  RN entry point (AppRegistry)
app.json                  RN app name
requirements/             PRD + MVP spec (source of truth for product)
assets/                   Static images (currently just professor-corgi.jpeg)
android/                  Native Android project
src/
  navigation/AppNavigator.js     Stack navigator — all screens registered here
  contexts/                      State — SettingsContext, ProgressContext, RewardContext
  screens/
    WelcomeScreen.js             Entry + session start
    MainMenuScreen.js            Hub (learn / play / progress / settings)
    ProgressScreen.js            Tree of Reason + stats
    SettingsScreen.js            Language, audio toggles, a11y toggles
    learning/                    AdditionVisual, SubtractionVisual, StoryProblems
    games/                       NumberLabyrinth, FindPair, LostNumbers
  components/common/             Button, Card (shared UI primitives)
  utils/
    constants.js                 COLORS, DIFFICULTY_LEVELS, GAME_CONFIG, TREE_STAGES, etc.
    i18n.js                      i18n instance + t() helper
    storage.js                   AsyncStorage read/write helpers
    questionGenerator.js         Pure functions that produce questions/pairs/sequences
  locales/                       en.json, ru.json, es.json
```

## State

Three context providers, mounted in `App.js`:

- **SettingsContext** — `language`, `settings` (music/sound/voice/high contrast/large text/reduced motion), `changeLanguage`, `toggleSetting`
- **ProgressContext** — lessons/games completed, `skillsTracked`, `attemptHistory`, `bestStreak`, methods: `completeLesson`, `completeGame`, `recordAttempt`, `startSession`, `unlockAchievement`, `getStats`
- **RewardContext** — `treeState` (leaves/sparks/flowers/stage/unlockedZones), `addLeaves`, `addSparks`, `unlockZone`, `getGrowthProgress`

All three auto-hydrate from AsyncStorage on mount and persist on every update. Keys live in `STORAGE_KEYS` (`src/utils/constants.js`).

## Conventions

- **Functional components + hooks only.** No class components.
- **Styling:** `StyleSheet.create` per-screen. Shared sizing/colors/typography come from `src/utils/constants.js` — prefer these over raw values.
- **Text must go through `t()`** from `src/utils/i18n.js`. Any new user-facing string → add keys to **all three** locale files (`en.json`, `ru.json`, `es.json`).
- **Question generation is centralized** in `src/utils/questionGenerator.js`. Add new question shapes there rather than inline in screens.
- **Every navigable screen must be registered** in `src/navigation/AppNavigator.js`.
- **Min touch target 44pt** (`SIZING.MIN_TOUCH_TARGET`) — respect this for kid usability.

## Adding a feature — typical flow

1. New screen → create under `src/screens/{learning,games}/` and register in `AppNavigator.js`.
2. Shared component → `src/components/common/`.
3. New strings → add to `en.json` / `ru.json` / `es.json` (keep keys in sync).
4. New math question type → extend `questionGenerator.js`.
5. New progress-tracked skill → extend `defaultProgress.skillsTracked` in `ProgressContext.js` and the branching in `recordAttempt`.
6. New reward/zone → extend `RewardContext` (stages in `TREE_STAGES`).

## Build & run

Prereqs: Node 16+, JDK 17+, Android SDK 34, an emulator or device with USB debugging.

```bash
npm install
npm start             # Metro bundler (terminal 1)
npm run android       # build + install on Android (terminal 2)
```

Troubleshooting is in `README.md` and `QUICK_START.md`.

## What to avoid

- **Do not add Expo.** This is bare RN on purpose.
- **Do not hardcode user-facing strings.** Everything renders through `t()`.
- **Do not bypass the context providers** for settings/progress/rewards — persistence and derived state live there.
- **Do not enable the RN New Architecture** without explicit coordination — not wired up, known to need Gradle changes.
- **Do not add heavy libraries** for features that can be written in a few lines (the app targets low-end Android devices).
- **Do not add leaderboards, scoreboards, or timers.** The product deliberately avoids competitive/stress mechanics (see `requirements/prd.md` §6).

## Testing

There are no automated tests yet. `npm test` is a stub. When adding tests, use Jest + React Native Testing Library; focus on `questionGenerator.js` (pure, high-value) and context reducers first.

## Where to learn the product intent

- `requirements/prd.md` — full product requirements (in Russian)
- `requirements/1. MVP.md` — MVP user stories & acceptance criteria (in Russian)
- `README.md` — user-facing overview + phase checklist
- `ASSET_SPECIFICATIONS.md` — spec for the custom art/audio not yet created
- `QUICK_START.md` — manual test script for the current build

When product intent and code disagree, `requirements/` wins.
