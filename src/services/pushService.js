import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";
import { navigate } from "./NotificationServices";

// Request Permission
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  console.log("Permission enabled:", enabled);
  return enabled;
}

// Get Token
export async function getFCMToken() {
  const token = await messaging().getToken();
  console.log("FCM TOKEN:", token);
  return token;
}

// Save token to backend
export async function sendTokenToBackend(userId, token) {
  try {
    const response = await fetch("http://YOUR_BACKEND_URL:5000/api/save-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, token }),
    });

    const data = await response.json();
    console.log("Token saved:", data);
  } catch (error) {
    console.log("Error saving token:", error);
  }
}

// Display Notification (Foreground)
export async function displayNotification(remoteMessage) {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
  });

  await notifee.displayNotification({
    title: remoteMessage.notification?.title || "New Notification",
    body: remoteMessage.notification?.body || "You have a message",
    android: {
      channelId,
      pressAction: {
        id: "default",
      },
    },
    data: remoteMessage.data,
  });
}

// Handle click navigation
export function handleNotificationNavigation(remoteMessage) {
  const screen = remoteMessage?.data?.screen;
  const id = remoteMessage?.data?.id;

  if (screen) {
    navigate(screen, { id });
  }
}
