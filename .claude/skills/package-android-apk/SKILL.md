---
name: package-android-apk
description: "Build a release APK of this React Native app and sideload it onto a connected Android device (e.g. a Redmi phone). Use when: (1) the user asks to package, build, or produce an APK, (2) the user wants to install the app on a physical device without Metro, (3) preparing a build for a tester or family member, (4) troubleshooting why `./gradlew assembleRelease` fails on this machine."
---

# Package APK and install on device

This repo is bare React Native 0.74.1 targeting Android. There is no CI release job — APKs are produced from a developer machine with the commands below.

## Prereqs (macOS, this machine)

- **Java 17** via sdkman. Gradle 8.3 + AGP 8.2 do not run on Java 21+. Activate it per shell — do **not** set it globally.
- **Android SDK** at `/opt/homebrew/share/android-commandlinetools` (installed via `brew install --cask android-commandlinetools`). `ANDROID_HOME` is not exported by default, so gradle fails with "SDK location not found" until you set it.
- **adb** on PATH (comes with `platform-tools` under the SDK).
- `node_modules` present. A fresh git worktree needs `npm install` before the first build — `native_modules.gradle` resolves from `node_modules/@react-native-community/cli-platform-android/`, so gradle errors immediately if packages aren't installed.

## The full command sequence

```bash
source "$HOME/.sdkman/bin/sdkman-init.sh" && sdk use java 17.0.18-tem
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools

npm install                                          # skip if node_modules exists
cd android && ./gradlew assembleRelease              # ~1 min warm, ~3 min cold
cd ..

adb devices -l                                       # confirm target serial
adb -s <serial> install -r \
  android/app/build/outputs/apk/release/app-release.apk
```

Output path: `android/app/build/outputs/apk/release/app-release.apk` (~60 MB).

## Gotchas

- **Multiple devices connected?** Always pass `-s <serial>` to `adb install`. An emulator often sits alongside the physical device — a bare `adb install` is ambiguous and either fails or installs on the wrong target.
- **Release is signed with `debug.keystore`.** `android/app/build.gradle` sets `buildTypes.release.signingConfig = signingConfigs.debug`. This is fine for sideloading to a tester's device, **not** fine for Play Store. Generate a real keystore first if you're publishing.
- **APK is large (~60 MB)** because `enableProguardInReleaseBuilds = false`. Turn on minify + resource shrinking in `android/app/build.gradle` if size matters.
- **Hermes is on** (`android/gradle.properties` → `hermesEnabled=true`). The JS bundle is embedded; the device doesn't need Metro at runtime.
- **`INSTALL_FAILED_UPDATE_INCOMPATIBLE`** usually means the device has a version signed with a different keystore (e.g. a previous debug install from another machine). Uninstall first: `adb -s <serial> uninstall com.kidslearnmath`.
- **App id is `com.kidslearnmath`** (see `android/app/build.gradle` `applicationId`). Use this with `adb shell am start` / `adb uninstall`.

## Quick verification after install

```bash
adb -s <serial> shell am start -n com.kidslearnmath/.MainActivity
adb -s <serial> logcat -s ReactNative:V ReactNativeJS:V   # optional, tail JS logs
```

## When only a debug build is needed

For day-to-day development — with Metro running — prefer `npm run android`. That path uses `assembleDebug` and is not what this skill covers.
