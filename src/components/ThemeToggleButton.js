import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const ThemeToggleButton = () => {
  const themeData = useTheme();
  const colors = themeData?.colors || {};
  const isDark = themeData?.isDark || false;
  const setTheme = themeData?.setTheme || (() => {});

  // Simple toggle between light and dark
  const toggleTheme = () => {
    console.log('Toggling theme from:', isDark ? 'dark' : 'light');
    if (setTheme && typeof setTheme === 'function') {
      setTheme(isDark ? 'light' : 'dark');
    } else {
      console.warn('setTheme is not available');
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.toggleButton,
        { backgroundColor: colors?.brandSecondary || '#B61F24' },
      ]}
      onPress={toggleTheme}
      activeOpacity={0.8}
    >
      {isDark ? (
        <Ionicons name="moon" size={24} color="#fff" />
      ) : (
        <Ionicons name="sunny" size={24} color="#fff" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 999,
  }
});

export default ThemeToggleButton;
