/**
 * @format
 */

import { AppRegistry } from "react-native";
import messaging from "@react-native-firebase/messaging";
import App from "./App";
import { name as appName } from "./app.json";

import "react-native-reanimated"; // must be at top level

import { onAppBeginLaunch } from "./src/route/launch-profiler";
onAppBeginLaunch();

// Background handler (when app is killed/background)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log("Background message received:", remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
