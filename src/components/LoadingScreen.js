
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Animated } from 'react-native';
import PropTypes from 'prop-types';
import logoImage from '../assets/branding/logo_size.png';
import { useTheme } from '../context/ThemeContext';

const LoadingScreen = (props) => {
  const [loadingText, setLoadingText] = useState(props.message || 'Loading');
  const { colors, isDark } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Pulse animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === `${props.message || 'Loading'}...`) {
          return `${props.message || 'Loading'}`;
        }
        return prev + '.';
      });
    }, 400);

    return () => clearInterval(interval);
  }, [props.message]);

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundColor }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: pulseAnim }],
          }
        ]}
      >
        <Image source={logoImage} style={styles.image} />
      </Animated.View>

      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.brandPrimary}
          style={styles.spinner}
        />
        <Text style={[styles.text, { color: colors.textPrimary }]}>
          {loadingText}
        </Text>
      </View>
    </View>
  );
};

LoadingScreen.propTypes = {
  message: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 180,
    height: 180,
    opacity: 0.3,
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default LoadingScreen;
