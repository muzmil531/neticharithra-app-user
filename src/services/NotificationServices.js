import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import notifee, {
    EventType,
    AndroidColor,
    AndroidImportance,
} from '@notifee/react-native';
// import NavigationServices from './NavigationServices';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const isSimulator = () => {
    return (
        Platform.OS === 'ios' &&
        Platform.constants?.isDevice === false // iOS simulator check
    );
};

export async function requestUserPermission() {
    if (Platform.OS === 'android') {
        console.log("🚀 ~ requestUserPermission ~ PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS:", PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
        let granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        console.log("🚀 ~ requestUserPermission ~ res:", granted)
        // await AsyncStorage.setItem('notificationsAccess', JSON.stringify(granted))
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Notification permission granted');
        } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
            console.log('Notification permission denied');
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            console.log('Notification permission denied with "Never ask again"');
        }
        getFcmToken()
 
    }
    else if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();

        if (isSimulator()) {
            await messaging().setAPNSToken('74657374696E67746F6B656E', 'unknown');
        }
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
            getFcmToken()
        }
    }
    await notificationListeners()
}

const getFcmToken = async () => {

    try {
        const token = await messaging().getToken()
        console.log("fcm token:", token,)
    } catch (error) {
        console.log("error in creating token", error)
    }

}





export async function notificationListeners() {


    messaging().setBackgroundMessageHandler(async remoteMessage => {
        __DEV__ && console.log('Message handled in the background!---->Notification service', remoteMessage);
    });


    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage,
        );

        // if (!!remoteMessage?.data && remoteMessage?.data?.screen_name == "Watchlist") {
        //     NavigationServices.navigate("Watchlist", { data: remoteMessage?.data })
        // }

        // else if (!!remoteMessage?.data && remoteMessage?.data?.screen_name == "PortfolioDetail") {
        //     NavigationServices.navigate("DetailedRoboPortfolio", { item: { portfolio_id: remoteMessage?.data.portfolio_id } })
        // }
    });

    // Check whether an initial notification is available
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
                // if (!!remoteMessage?.data && remoteMessage?.data?.screen_name == "Watchlist") {
                //     NavigationServices.navigate("Watchlist", { data: remoteMessage?.data })
                // }
                // else if (!!remoteMessage?.data && remoteMessage?.data?.screen_name == "PortfolioDetail") {
                //     NavigationServices.navigate("DetailedRoboPortfolio", { item: { portfolio_id: remoteMessage?.data.portfolio_id } })
                // }
            }
        });


}

export async function foreGroundNotification() {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
        // try {
            
            console.log('A new FCM message arrived 2!..........', remoteMessage);
            onDisplayNotification(remoteMessage)
            return unsubscribe;
        // } catch (error) {
        //     console.error(error)
        // }
    });


}

async function onDisplayNotification(data) {
    // console.log("hello", data?.data)
    // Request permissions (required for iOS)
    if (Platform.OS == 'ios') {
        await notifee.requestPermission()
    }


    const onForegroundEvent = notifee.onForegroundEvent(({ type, detail, data }) => {

        if (type === EventType.PRESS) {
            // console.log(detail?.notification?.data, "foreground notification", type, EventType.PRESS, "......", new Date(), detail?.notification?.id)

            if (detail?.notification?.data?.screen_name == 'Watchlist') {
                removeNotification(detail?.notification?.id);
                // NavigationServices.navigate("Watchlist", { data: {} })
            }
            // else if (detail?.notification?.data?.screen_name == ("PortfolioDetail")) {
            //     removeNotification(detail?.notification?.id);
            //     NavigationServices.navigate("DetailedRoboPortfolio", { item: { portfolio_id: detail?.notification?.data?.portfolio_id } })
            // }
        }
    });



    const removeNotification = async (notificationId) => {
        try {
            await notifee.cancelNotification(notificationId);
            console.log('Notification removed successfully:', notificationId);
        } catch (error) {
            console.error('Error removing notification:', error);
        }
    };


    return notifee.offForegroundEvent(onForegroundEvent);



}

