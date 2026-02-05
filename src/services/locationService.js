import { PermissionsAndroid, Platform, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export async function requestLocationPermission() {
  if (Platform.OS === 'ios') {
    return new Promise((resolve) => {
      Geolocation.requestAuthorization(
        () => {
          console.log('iOS location permission granted');
          resolve(true);
        },
        () => {
          console.log('iOS location permission denied');
          resolve(false);
        }
      );
    });
  }

  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to provide personalized news content.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      console.log('Android location permission result:', granted);
      const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
      console.log('Permission granted:', isGranted);
      return isGranted;
    } catch (err) {
      console.warn('Location permission error:', err);
      return false;
    }
  }

  return false;
}

export async function getCurrentLocation() {
  console.log('Attempting to get current location...');
  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Location retrieved successfully:', { latitude, longitude });
        resolve({ latitude, longitude });
      },
      (error) => {
        console.error('Location error - Code:', error.code);
        console.error('Location error - Message:', error.message);
        console.error('Location error - Full:', JSON.stringify(error));
        resolve({ latitude: null, longitude: null });
      },
      { 
        enableHighAccuracy: true, 
        timeout: 20000, 
        maximumAge: 10000 
      }
    );
  });
}

export async function getLocationWithPermission() {
  console.log('Starting location permission request...');
  const hasPermission = await requestLocationPermission();
  console.log('Has permission:', hasPermission);
  
  if (hasPermission) {
    console.log('Permission granted, getting location...');
    const location = await getCurrentLocation();
    console.log('Final location result:', location);
    return location;
  }
  
  console.log('Permission denied, returning null coordinates');
  return { latitude: null, longitude: null };
}
