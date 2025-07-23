import React from 'react';
import { 
    View, 
    Image, 
    Text, 
    StyleSheet, 
    Dimensions,
    Platform,
    TouchableOpacity 
} from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';

import logo from '../assets/branding/logo.png';

const { width } = Dimensions.get('window');

const PublicUserNewsCard = ({ data, badgeColor, onPress }) => {
    const { photo, title, subtitle, description, date, badge, viewCount, category } = data || {};

    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.card}>
                {/* Image Section */}
                <View style={styles.imageContainer}>
                    <Image
                        source={photo ? { uri: photo } : logo}
                        style={styles.newsImage}
                        resizeMode="cover"
                        accessibilityLabel="News Image"
                    />
                    
                    {/* Category Badge */}
                    {category && (
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{String(category)}</Text>
                        </View>
                    )}
                </View>

                {/* Content Section */}
                <View style={styles.contentSection}>
                    <View style={styles.textContainer}>
                        <Text numberOfLines={2} style={styles.title}>
                            {String(title || "No Title")}
                        </Text>
                        
                        {subtitle && (
                            <Text numberOfLines={1} style={styles.subtitle}>
                                {String(subtitle)}
                            </Text>
                        )}
                        
                        <Text numberOfLines={3} style={styles.description}>
                            {String(description || "No Description")}
                        </Text>
                    </View>
                    
                    {/* Meta Information */}
                    <View style={styles.metaContainer}>
                        <View style={styles.leftMeta}>
                            <View style={styles.dateContainer}>
                                <Ionicons name="time-outline" size={12} color="#666" />
                                <Text style={styles.date}>{String(date || "No Date")}</Text>
                            </View>
                            
                            {viewCount && (
                                <View style={styles.viewContainer}>
                                    <Ionicons name="eye-outline" size={12} color="#666" />
                                    <Text style={styles.viewText}>{String(viewCount)}</Text>
                                </View>
                            )}
                        </View>
                        
                        {badge && (
                            <View style={[styles.badge, { backgroundColor: badgeColor || '#007bff' }]}>
                                <Text style={styles.badgeText}>{String(badge)}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

PublicUserNewsCard.propTypes = {
    data: PropTypes.shape({
        photo: PropTypes.string,
        title: PropTypes.string,
        subtitle: PropTypes.string,
        description: PropTypes.string,
        date: PropTypes.string,
        badge: PropTypes.string,
        viewCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        category: PropTypes.string
    }),
    badgeColor: PropTypes.string,
    onPress: PropTypes.func
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 8,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    imageContainer: {
        width: '100%',
        height: 200,
        position: 'relative',
    },
    newsImage: {
        width: '100%',
        height: '100%',
    },
    categoryBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#007bff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    categoryText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },
    contentSection: {
        padding: 16,
    },
    textContainer: {
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        lineHeight: 24,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        marginBottom: 8,
        lineHeight: 20,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
        textAlign: 'justify',
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    date: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
        fontWeight: '500',
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
        fontWeight: '500',
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    badgeText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 12,
    },
});

export default PublicUserNewsCard;
