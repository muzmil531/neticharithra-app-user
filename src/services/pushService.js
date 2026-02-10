import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";
import { Platform } from "react-native";
import { navigate } from "./NotificationServices";
import { post } from "../handelers/APIHandeler";
import EndPointConfig from "../handelers/EndPointConfig";

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
export async function sendTokenToBackend(userId, token, latitude, longitude, language) {
  try {
    const payload = {
      userId,
      token,
      latitude,
      longitude,
      language,
      platform: Platform.OS
    };

    console.log("Sending token to backend:", payload);

    const response = await post(EndPointConfig.registerMobileUser, payload);
    
    if (response?.status === 'success') {
      console.log("Token saved successfully:", response);
    } else {
      console.log("Registration response:", response);
    }
    
    return response;
  } catch (error) {
    console.error("Error saving token:", error);
    return null;
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
  console.log("=== NOTIFICATION NAVIGATION START ===");
  console.log("Full remoteMessage:", JSON.stringify(remoteMessage, null, 2));
  console.log("Notification data:", remoteMessage?.data);
  
  const newsId = remoteMessage?.data?.newsId;
  const type = remoteMessage?.data?.type;

  console.log("Extracted newsId:", newsId);
  console.log("Extracted type:", type);

  if (newsId && type === 'news_approved') {
    console.log("Navigating to NewsContainerV2 with newsId:", newsId);
    // Navigate to NewsContainerV2 with newsId payload
    navigate('NewsContainerV2', { 
      data: { 
        newsId: newsId 
      } 
    });
  } else if (remoteMessage?.data?.screen) {
    console.log("Using fallback navigation to screen:", remoteMessage?.data?.screen);
    // Fallback for other notification types
    const screen = remoteMessage?.data?.screen;
    const id = remoteMessage?.data?.id;
    navigate(screen, { id });
  } else {
    console.log("No valid navigation data found in notification");
  }
  console.log("=== NOTIFICATION NAVIGATION END ===");
}
