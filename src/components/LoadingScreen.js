import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import logoImage from '../assets/branding/logo.png';

const LoadingScreen = (props) => {
  const [loadingText, setLoadingText] = useState(props.message || 'Loading');

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === `${props.message || 'Loading'}....`) {
          return `${props.message || 'Loading'}`;
        }
        return prev + '.';
      });
    }, 200);

    return () => clearInterval(interval);
  }, [props.message]);

  return (
    <View style={styles.container}>
      <Image source={logoImage} style={styles.image} />
      <Text style={styles.text}>{loadingText}</Text>
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
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    opacity: 0.2,
  },
  text: {
    fontSize: 18,
    opacity: 0.5,
    fontWeight: 'bold',
    marginTop: 20, // Adding margin to space out the text from the image
  },
});

export default LoadingScreen;
