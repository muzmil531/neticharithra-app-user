/**
 * @format
 */

import { AppRegistry } from "react-native";
import messaging from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { displayNotification, handleNotificationNavigation } from "./src/services/pushService";

import "react-native-reanimated"; // must be at top level

import { onAppBeginLaunch } from "./src/route/launch-profiler";
onAppBeginLaunch();

// Background handler (when app is killed/background)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log("Background message received:", remoteMessage);
  await displayNotification(remoteMessage);
});

// Notifee Background Event Handler
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  console.log("Notifee Background Event:", type, notification);

  if (type === EventType.PRESS) {
    console.log("User pressed notification in background:", notification.data);
    if (notification.data) {
      // Note: Full navigation might need the app to be in foreground.
      // handleNotificationNavigation is designed to work with navigationRef.
      handleNotificationNavigation({ data: notification.data });
    }
  }
});

AppRegistry.registerComponent(appName, () => App);


