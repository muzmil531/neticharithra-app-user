import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
let screenHeight = Dimensions.get('screen').height;

const TabScreenWrapper = ({ children }) => {
    return (
        <View style={styles.screenWrapper}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    screenWrapper: {
        // flex: 0,
        height: Platform.OS === 'ios' ? screenHeight * 0.685 : '100%', // Ensures the screen takes up the full available height
        backgroundColor: '#f4f3f38f'
        // borderWidth: 2, // Optional: Adjust the border width as needed
        // borderColor: 'black', // Optional: Adjust the border color as needed
        // borderRadius: 10, // Optional: Add border radius if you want rounded corners
        // margin: 10, // Optional: Add margin if you want space around the border
    },
});

export default TabScreenWrapper;
