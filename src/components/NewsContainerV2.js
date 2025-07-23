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
// import LinearGradient from 'react-native-linear-gradient'; // Removed to fix runtime error

import imageBg from '../assets/branding/logo.png';
import { timeAgo } from '../handelers/ReusableHandeler';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar, Card } from 'react-native-paper';
import { post } from '../handelers/APIHandeler';
import EndPointConfig from '../handelers/EndPointConfig';

const { height, width } = Dimensions.get('screen');

const NewsContainerV2 = () => {
    let route = useRoute();
    let [newsInfo, setNewsInfo] = useState();
    let [loading, setLoading] = useState(true);
    let navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    await getnewsInfo(route.params.data);
                    
                    // Animate content in
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 800,
                            useNativeDriver: true,
                        }),
                        Animated.timing(slideAnim, {
                            toValue: 0,
                            duration: 600,
                            useNativeDriver: true,
                        })
                    ]).start();
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                }
            };

            fetchData();
        }, [route.params])
    );


    const handleShare = async () => {
        try {

            const url = `https://neticharithra-ncmedia.web.app/#/view-news/${newsInfo.language}/${newsInfo.newsId}`;  // Replace with your actual URL
            console.log(url)
            const imageUrl = newsInfo?.images?.[0]?.['externalURL'] ||
                newsInfo?.images?.[0]?.tempURL;  // Replace with your actual image URL
            const subtitle = 'Neti Charithra';

            // Copy URL to clipboard
            await Clipboard.setString(url);

            // Share content
            await Share.share({
                message: subtitle,
                url: imageUrl,
                title: newsInfo.title,  // Optional title for Android
            });

        } catch (error) {
            Alert.alert('Error', 'Failed to share content');
        }
    };

    const openSourceLink = () => {
        if (newsInfo?.source !== 'Neti Charithra' && newsInfo?.sourceLink) {
            Linking.openURL(newsInfo?.sourceLink);
        }
    };

    const getnewsInfo = async (payload) => {
        try {
            console.log("payload", payload);
            const response = await post(EndPointConfig.getIndividualNewsInfo, payload);
            console.log("response", response);
            
            if (response?.status === 'success') {
                setNewsInfo(response?.data?.[0] || {});
                console.log(response?.data?.[0]);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
                <View style={styles.loadingContent}>
                    <Animated.View style={[styles.loadingSpinner, { opacity: fadeAnim }]}>
                        <Text style={styles.loadingText}>Loading...</Text>
                    </Animated.View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            {
                newsInfo &&
                <Animated.View style={[styles.mainContainer, { opacity: fadeAnim }]}>
                    {/* Hero Image Section */}
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
                        
                        {/* Gradient Overlay */}
                        <View style={styles.gradientOverlay} />
                        
                        {/* Header Actions */}
                        <View style={styles.headerActions}>
                            <TouchableOpacity 
                                style={styles.actionButton}
                                onPress={() => navigation.goBack()}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="chevron-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.actionButton}
                                onPress={handleShare}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="share-social" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        
                        {/* Time Badge */}
                        {newsInfo?.approvedOn && (
                            <View style={styles.timeBadge}>
                                <Text style={styles.timeText}>
                                    {timeAgo(new Date(newsInfo?.approvedOn))}
                                </Text>
                            </View>
                        )}
                    </View>
                    {/* Content Section */}
                    <Animated.View 
                        style={[
                            styles.contentSection, 
                            { transform: [{ translateY: slideAnim }] }
                        ]}
                    >
                        <ScrollView 
                            style={styles.scrollContainer}
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                        >
                            {/* Title */}
                            <View style={styles.titleContainer}>
                                <Text style={styles.newsTitle}>
                                    {newsInfo?.title}
                                </Text>
                            </View>

                            {/* Description */}
                            <View style={styles.descriptionContainer}>
                                <Text style={styles.newsDescription}>
                                    {newsInfo?.description}
                                </Text>
                            </View>

                            {/* Author/Source Card */}
                            <View style={styles.authorCard}>
                                <View style={styles.authorInfo}>
                                    <View style={styles.avatarContainer}>
                                        {
                                            newsInfo?.reportedBy?.profilePic
                                                ?
                                                <Avatar.Image
                                                    size={48}
                                                    source={{
                                                        uri: newsInfo?.reportedBy?.profilePic?.externalURL ||
                                                            newsInfo?.reportedBy?.profilePic?.tempURL
                                                    }}
                                                />
                                                :
                                                <Avatar.Text
                                                    size={48}
                                                    label={newsInfo?.reportedBy?.name?.charAt(0) || 'N'}
                                                    style={styles.avatarText}
                                                />
                                        }
                                    </View>
                                    
                                    <View style={styles.authorDetails}>
                                        {
                                            newsInfo?.source === 'Neti Charithra' && (
                                                <View style={styles.reporterInfo}>
                                                    <Text style={styles.authorName}>
                                                        {newsInfo?.reportedBy?.name}
                                                    </Text>
                                                    <Text style={styles.authorRole}>
                                                        {newsInfo?.reportedBy?.role}
                                                    </Text>
                                                </View>
                                            )
                                        }
                                        
                                        <Pressable onPress={openSourceLink} style={styles.sourceContainer}>
                                            <Text style={styles.sourceLabel}>Source:</Text>
                                            <Text style={styles.sourceName}>
                                                {newsInfo?.source}
                                            </Text>
                                            {newsInfo?.source !== 'Neti Charithra' && newsInfo?.sourceLink && (
                                                <Ionicons name="open-outline" size={14} color="#007bff" style={styles.externalIcon} />
                                            )}
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                            
                            {/* Bottom Spacing */}
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
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    loadingContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingSpinner: {
        padding: 20,
    },
    loadingText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    mainContainer: {
        flex: 1,
    },
    heroSection: {
        height: height * 0.45,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    headerActions: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
    },
    timeBadge: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    timeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    contentSection: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -24,
        paddingTop: 8,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    titleContainer: {
        marginTop: 20,
        marginBottom: 16,
    },
    newsTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        lineHeight: 36,
        letterSpacing: -0.5,
    },
    descriptionContainer: {
        marginBottom: 24,
    },
    newsDescription: {
        fontSize: 16,
        color: '#4a4a4a',
        lineHeight: 26,
        textAlign: 'justify',
        letterSpacing: 0.2,
    },
    authorCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    authorInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatarText: {
        backgroundColor: '#007bff',
    },
    authorDetails: {
        flex: 1,
    },
    reporterInfo: {
        marginBottom: 12,
    },
    authorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 2,
    },
    authorRole: {
        fontSize: 14,
        color: '#6c757d',
        fontStyle: 'italic',
    },
    sourceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#007bff',
    },
    sourceLabel: {
        fontSize: 12,
        color: '#6c757d',
        fontWeight: '500',
        marginRight: 6,
    },
    sourceName: {
        fontSize: 14,
        color: '#007bff',
        fontWeight: '600',
        flex: 1,
    },
    externalIcon: {
        marginLeft: 4,
    },
    bottomSpacing: {
        height: 40,
    },
    // Legacy styles (keeping for compatibility)
    backgroundImage: {
        width: '50%',
        height: '50%',
        resizeMode: 'contain',
        position: 'absolute',
        opacity: 0.2,
    },
    overlayText: {
        position: 'absolute',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        top: 0,
        left: 0,
        width: '100%',
        height: '85%',
        paddingHorizontal: 20,
    },
});
