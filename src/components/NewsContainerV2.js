import {
    Clipboard,
    Dimensions,
    Image,
    Linking,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    View,
    StatusBar,
    SafeAreaView,
    Alert,
    Animated
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

import imageBg from '../assets/branding/logo.png';
import { timeAgo } from '../handelers/ReusableHandeler';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar, Card } from 'react-native-paper';
import { post } from '../handelers/APIHandeler';
import EndPointConfig from '../handelers/EndPointConfig';

const { height, width } = Dimensions.get('screen');

const NewsContainerV2 = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { colors, isDark } = useTheme();
    const [newsInfo, setNewsInfo] = useState(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useFocusEffect(
        React.useCallback(() => {
            if (route?.params?.data) {
                setNewsInfo(route.params.data);

                // Fade in animation
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start();
            }

            return () => {
                fadeAnim.setValue(0);
                slideAnim.setValue(20);
            };
        }, [route?.params?.data])
    );

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: `${newsInfo?.title}\n\nRead more at Neti Charithra`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.screenBackground }]}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            {
                newsInfo &&
                <Animated.View style={[styles.mainContainer, { opacity: fadeAnim }]}>
                    {/* Compact Hero Image Section */}
                    <View style={styles.heroSection}>
                        <Image
                            source={{
                                uri:
                                    newsInfo?.images?.[0]?.['externalURL'] ||
                                    newsInfo?.images?.[0]?.tempURL ||
                                    'https://upload.wikimedia.org/wikipedia/commons/3/32/Googleplex_HQ_%28cropped%29.jpg',
                            }}
                            style={styles.heroImage}
                            resizeMode="cover"
                        />

                        {/* Subtle Gradient Overlay */}
                        <LinearGradient
                            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.5)']}
                            style={styles.gradientOverlay}
                        />

                        {/* Header Actions */}
                        <View style={styles.headerActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: 'rgba(255,255,255,0.3)' }]}
                                onPress={() => navigation.goBack()}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="chevron-back" size={22} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: 'rgba(255,255,255,0.3)' }]}
                                onPress={handleShare}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="share-social" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Content Section */}
                    <Animated.View
                        style={[
                            styles.contentSection,
                            { backgroundColor: colors.screenBackground },
                            { transform: [{ translateY: slideAnim }] }
                        ]}
                    >
                        <ScrollView
                            style={styles.scrollContainer}
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                        >
                            {/* Meta Info */}
                            <View style={styles.metaContainer}>
                                {newsInfo?.category && (
                                    <View style={[styles.categoryBadge, { backgroundColor: isDark ? colors.backgroundColor : '#f5f5f5' }]}>
                                        <View style={[styles.categoryDot, { backgroundColor: colors.brandSecondary }]} />
                                        <Text style={[styles.categoryText, { color: colors.brandSecondary }]}>
                                            {String(newsInfo?.category).toUpperCase()}
                                        </Text>
                                    </View>
                                )}

                                {newsInfo?.approvedOn && (
                                    <View style={styles.timeContainer}>
                                        <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                                        <Text style={[styles.timeText, { color: colors.textTertiary }]}>
                                            {timeAgo(new Date(newsInfo?.approvedOn))}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Title */}
                            <View style={styles.titleContainer}>
                                <Text style={[styles.newsTitle, { color: colors.textPrimary }]}>
                                    {newsInfo?.title}
                                </Text>
                            </View>

                            {/* Subtitle */}
                            {newsInfo?.subTitle && (
                                <View style={styles.descriptionContainer}>
                                    <Text style={[styles.newsDescription, { color: colors.textSecondary }]}>
                                        {newsInfo?.subTitle}
                                    </Text>
                                </View>
                            )}

                            {/* Author Card */}
                            {newsInfo?.author && (
                                <View style={[styles.authorCard, { backgroundColor: colors.cardBackground, borderColor: colors.borderLight }]}>
                                    <Avatar.Text
                                        size={36}
                                        label={newsInfo?.author?.charAt(0)?.toUpperCase() || 'A'}
                                        style={{ backgroundColor: colors.brandSecondary }}
                                    />
                                    <View style={styles.authorInfo}>
                                        <Text style={[styles.authorName, { color: colors.textPrimary }]}>
                                            {newsInfo?.author}
                                        </Text>
                                        <Text style={[styles.authorRole, { color: colors.textSecondary }]}>
                                            Contributor
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Description/Content */}
                            {newsInfo?.description && (
                                <View style={styles.contentContainer}>
                                    <Text style={[styles.contentText, { color: colors.textPrimary }]}>
                                        {newsInfo?.description}
                                    </Text>
                                </View>
                            )}

                            {/* Additional Images */}
                            {newsInfo?.images && newsInfo.images.length > 1 && (
                                <View style={styles.additionalImagesContainer}>
                                    {newsInfo.images.slice(1).map((img, index) => (
                                        <Image
                                            key={index}
                                            source={{ uri: img?.externalURL || img?.tempURL }}
                                            style={[styles.additionalImage, { backgroundColor: colors.backgroundColor }]}
                                            resizeMode="cover"
                                        />
                                    ))}
                                </View>
                            )}

                            {/* Source */}
                            {newsInfo?.source && (
                                <View style={[styles.sourceCard, { backgroundColor: colors.cardBackground, borderColor: colors.borderLight }]}>
                                    <Ionicons name="newspaper-outline" size={16} color={colors.textSecondary} />
                                    <Text style={[styles.sourceText, { color: colors.textSecondary }]}>
                                        Source: {newsInfo?.source}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.bottomSpacing} />
                        </ScrollView>
                    </Animated.View>
                </Animated.View>
            }
        </SafeAreaView>
    );
};

export default NewsContainerV2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContainer: {
        flex: 1,
    },
    heroSection: {
        height: height * 0.35,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    headerActions: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        zIndex: 10,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentSection: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: 16,
        marginBottom: 12,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 12,
    },
    categoryDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginRight: 4,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.4,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 11,
        fontWeight: '500',
        marginLeft: 4,
    },
    titleContainer: {
        marginBottom: 12,
    },
    newsTitle: {
        fontSize: 22,
        fontWeight: '700',
        lineHeight: 30,
        letterSpacing: -0.4,
    },
    descriptionContainer: {
        marginBottom: 16,
    },
    newsDescription: {
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '400',
    },
    authorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
    },
    authorInfo: {
        marginLeft: 12,
        flex: 1,
    },
    authorName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    authorRole: {
        fontSize: 12,
    },
    contentContainer: {
        marginBottom: 20,
    },
    contentText: {
        fontSize: 15,
        lineHeight: 24,
        fontWeight: '400',
    },
    additionalImagesContainer: {
        marginBottom: 20,
    },
    additionalImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 12,
    },
    sourceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
    },
    sourceText: {
        fontSize: 12,
        marginLeft: 8,
        fontWeight: '500',
    },
    bottomSpacing: {
        height: 40,
    },
});
