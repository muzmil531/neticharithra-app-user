import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const SkeletonItem = ({ style }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const { isDark } = useTheme();

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    const backgroundColor = isDark ? '#333' : '#e1e4e8';

    return (
        <Animated.View style={[style, { opacity, backgroundColor }]} />
    );
};

const NewsSkeletonLoader = () => {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.screenBackground }]}>
            {/* Search Bar Skeleton */}
            <View style={styles.searchContainer}>
                <SkeletonItem style={styles.searchBar} />
            </View>

            {/* Carousel Skeleton */}
            <View style={styles.carouselContainer}>
                <SkeletonItem style={styles.carouselCard} />
                <View style={styles.paginationContainer}>
                    <SkeletonItem style={styles.dot} />
                    <SkeletonItem style={styles.dot} />
                    <SkeletonItem style={styles.dot} />
                </View>
            </View>

            {/* News List Skeleton */}
            <View style={styles.listContainer}>
                {[1, 2, 3, 4, 5].map((item) => (
                    <View key={item} style={[styles.newsItem, { borderBottomColor: colors.borderLight }]}>
                        <View style={styles.textContainer}>
                            <SkeletonItem style={styles.metaRow} />
                            <SkeletonItem style={styles.titleLine1} />
                            <SkeletonItem style={styles.titleLine2} />
                        </View>
                        <SkeletonItem style={styles.thumbnail} />
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
    },
    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    searchBar: {
        height: 40,
        borderRadius: 20,
        width: '100%',
    },
    carouselContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    carouselCard: {
        width: width - 32,
        height: 220,
        borderRadius: 16,
    },
    paginationContainer: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    listContainer: {
        flex: 1,
    },
    newsItem: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 0.5,
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginRight: 12,
    },
    metaRow: {
        width: 100,
        height: 12,
        borderRadius: 4,
        marginBottom: 8,
    },
    titleLine1: {
        width: '90%',
        height: 16,
        borderRadius: 4,
        marginBottom: 6,
    },
    titleLine2: {
        width: '60%',
        height: 16,
        borderRadius: 4,
    },
    thumbnail: {
        width: 65,
        height: 65,
        borderRadius: 8,
    },
});

export default NewsSkeletonLoader;
