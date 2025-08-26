# Kids Learn Math

A simple React Native application for Android that helps children (ages 4-7) practice basic addition and subtraction.

## Features

- Randomly generates addition or subtraction questions using numbers from 0 to 10.
- Ensures subtraction never results in a negative number.
- Provides immediate feedback and generates a new question after a correct answer.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```
3. Run on an Android device or emulator:
   ```bash
   npm run android
   ```

## Building an APK

This project uses [Expo](https://expo.dev/). To create an Android APK:

```bash
npm install -g eas-cli
npx eas build -p android --profile preview
```

Follow the EAS CLI prompts to complete the build process.

## Testing

This project currently has no automated tests. Running `npm test` will simply print a message.

## License

This project is released under the terms of the [MIT License](LICENSE).
