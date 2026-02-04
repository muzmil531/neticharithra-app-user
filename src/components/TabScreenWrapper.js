import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
let screenHeight = Dimensions.get('screen').height;

const TabScreenWrapper = ({ children }) => {
    const { colors } = useTheme();
    return (
        <View style={[styles.screenWrapper, { backgroundColor: colors.screenBackground }]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    screenWrapper: {
        // flex: 0,
        height: Platform.OS === 'ios' ? screenHeight * 0.685 : '100%', // Ensures the screen takes up the full available height
        // borderWidth: 2, // Optional: Adjust the border width as needed
        // borderColor: 'black', // Optional: Adjust the border color as needed
        // borderRadius: 10, // Optional: Add border radius if you want rounded corners
        // margin: 10, // Optional: Add margin if you want space around the border
    },
});

export default TabScreenWrapper;
