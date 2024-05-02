

import React from 'react';
import { Modal, ActivityIndicator, View, StyleSheet } from 'react-native';

const LoaderScreen = ({ loading }) => {
    return (
        <Modal transparent animationType="none" visible={loading}>
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator animating={loading} size="large" color="#fff" />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    activityIndicatorWrapper: {
        // backgroundColor: '#000',
        borderRadius: 10,
        padding: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
});

export default LoaderScreen;
