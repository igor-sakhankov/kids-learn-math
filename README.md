# Kids Learn Math

A fun educational React Native app for kids to practice basic math (addition and subtraction) with a friendly professor corgi mascot.

## About

This is a bare React Native application that presents kids with random math questions (addition and subtraction in the 0-10 range) and provides immediate feedback. The app features a kid-friendly UI with a cute professor corgi background.

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

## License

MIT License - see LICENSE file for details.