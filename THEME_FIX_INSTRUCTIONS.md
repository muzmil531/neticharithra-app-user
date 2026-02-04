# Theme Context Fix Instructions

## Problem
The Metro bundler has cached the old version of ThemeContext without default values, causing "Cannot read property 'colors' of undefined" errors.

## Solution Steps

### Step 1: Stop the current Metro bundler
Press `Ctrl+C` in the terminal where Metro is running (the terminal with "BUNDLE ./index.js" logs)

### Step 2: Clear Metro cache and restart
Run these commands in order:

```bash
cd /Users/shaikmohammadmuzmil/Documents/Shaik-Projects/neticharithra-app-user

# Clear Metro bundler cache
npx react-native start --reset-cache
```

### Step 3: In a NEW terminal, rebuild the app
While Metro is running in the first terminal, open a new terminal and run:

```bash
cd /Users/shaikmohammadmuzmil/Documents/Shaik-Projects/neticharithra-app-user

# For Android
npx react-native run-android

# OR for iOS
npx react-native run-ios
```

## What was fixed in the code

1. **Added default values to ThemeContext** - The context now has fallback values to prevent undefined errors
2. **Added defensive code in useTheme hook** - Returns default values if context is undefined
3. **Removed invalid tabBarOptions** - Fixed MaterialBottomTabNavigator configuration

## Verification

After restarting with cache cleared, you should see:
- No "Cannot read property 'colors' of undefined" errors
- Theme switching works in Settings
- All screens render with proper colors
- Dark/Light/System theme modes all function correctly

## If issues persist

If you still see errors after clearing cache:
1. Stop Metro bundler completely
2. Delete these folders:
   - `node_modules/.cache`
   - `android/app/build` (for Android)
   - `ios/build` (for iOS)
3. Restart Metro with `--reset-cache` flag
4. Rebuild the app completely
