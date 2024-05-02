import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import logo from '../assets/branding/logo.png';

const PublicUserNewsCard = ({ data, badgeColor }) => {
    const { photo, title, subtitle, description, date, badge } = data || {};

    return (
        <View style={styles.container}>
            <View style={styles.section1}>
                <Image
                    source={photo ? { uri: photo } : logo}
                    style={styles.newsImage}
                    accessibilityLabel="News Image"
                />
                <View style={styles.textContainer}>
                    <Text numberOfLines={1} style={styles.title}>
                        {title || "No Title"}
                    </Text>
                    <Text numberOfLines={1} style={styles.subtitle}>
                        {subtitle || "No Subtitle"}
                    </Text>
                    <Text numberOfLines={2} style={styles.description}>
                        {description || "No Description"}
                    </Text>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <Text style={styles.date}>{date || "No Date"}</Text>
                <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                    <Text style={styles.badgeText}>{badge || "No Badge"}</Text>
                </View>
            </View>
        </View>
    );
};

PublicUserNewsCard.propTypes = {
    data: PropTypes.shape({
        photo: PropTypes.string,
        title: PropTypes.string,
        subtitle: PropTypes.string,
        description: PropTypes.string,
        date: PropTypes.string,
        badge: PropTypes.string
    }),
    badgeColor: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 5,
        margin: 2,
        elevation: 1,
    },
    section1: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    newsImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    textContainer: {
        marginLeft: 10,
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color:"#000"
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 5,
        color: '#888',
    },
    description: {
        fontSize: 14,
        color: '#444',
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    date: {
        fontSize: 12,
        color: '#888',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    badgeText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});

export default PublicUserNewsCard;
