import React from 'react';
import { 
    View, 
    Image, 
    Text, 
    StyleSheet, 
    Dimensions, 
    TouchableOpacity, 
    Platform, 
    ScrollView,
    SafeAreaView
} from 'react-native';
import { calculateNumberOfLines, epochToDate, scaleFont } from '../handelers/ReusableHandeler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import logo from './../assets/branding/logo.png';
import { useTheme } from '../context/ThemeContext';

const { height, width } = Dimensions.get('window');
const maxImageHeight = height * 0.4;
const maxNewsHeight = height * 0.6;

const NewsContainer = (props) => {
    const navigation = useNavigation();
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            overflow: 'hidden',
            marginHorizontal: 16,
            marginVertical: 8,
            ...Platform.select({
                ios: {
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                    shadowOpacity: 0.12,
                    shadowRadius: 8,
                },
                android: {
                    elevation: 8,
                },
            }),
        },
        imageContainer: {
            position: 'relative',
            height: maxImageHeight,
        },
        image: {
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
        },
        imageOverlay: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        categoryBadge: {
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: colors.brandSecondary,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
        },
        categoryText: {
            color: '#fff',
            fontSize: 12,
            fontWeight: '600',
        },
        userInfo: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        avatar: {
            width: 32,
            height: 32,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: '#fff',
        },
        userDetails: {
            marginLeft: 10,
            flex: 1,
        },
        userName: {
            fontSize: 13,
            fontWeight: '600',
            color: '#fff',
        },
        userLocation: {
            fontSize: 11,
            color: 'rgba(255,255,255,0.8)',
            marginTop: 2,
        },
        dateContainer: {
            alignItems: 'flex-end',
        },
        dateText: {
            fontSize: 11,
            color: 'rgba(255,255,255,0.8)',
        },
        contentContainer: {
            padding: 20,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.textPrimary,
            lineHeight: 28,
            marginBottom: 8,
        },
        subTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textSecondary,
            lineHeight: 22,
            marginBottom: 12,
        },
        content: {
            fontSize: 15,
            lineHeight: 24,
            color: colors.textSecondary,
            textAlign: 'justify',
        },
        readMoreContainer: {
            marginTop: 16,
            alignItems: 'flex-end',
        },
        readMoreButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.brandSecondary,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 20,
        },
        readMoreText: {
            color: '#fff',
            fontWeight: '600',
            fontSize: 14,
            marginRight: 6,
        },
        readMoreIcon: {
            marginLeft: 4,
        },
    });

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen comes into focus


            // Cleanup function, executed when the component unmounts or the effect is re-run
            return () => {
                // Do cleanup here if necessary
                console.log('Screen unfocused');
            };
        }, [])
    );



    const renderContent = (content) => {

        return (
            <Text
                style={styles.content}
                numberOfLines={props?.showFullContent ? undefined : calculateNumberOfLines(30, scaleFont(12))}
                ellipsizeMode="tail"
            >
                {content}
            </Text>

        );
    };

    return (
        <View style={[styles.container, { height: props?.showFullContent ? undefined : (height - 100) }]}>
            {/* Image Section with Overlay */}
            <View style={styles.imageContainer}>
                <Image
                    source={props.imageUrl ? { uri: props.imageUrl } : logo}
                    style={styles.image}
                />
                
                {/* Category Badge */}
                {props?.params?.category && (
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{String(props.params.category)}</Text>
                    </View>
                )}
                
                {/* User Info Overlay */}
                <View style={styles.imageOverlay}>
                    <View style={styles.userInfo}>
                        <Image source={logo} style={styles.avatar} />
                        <View style={styles.userDetails}>
                            <Text style={styles.userName}>{String(props?.params?.employeeId || 'Neti Charithra')}</Text>
                            <Text style={styles.userLocation}>{String(props?.params?.category || 'News')}</Text>
                        </View>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{String(epochToDate(props?.params?.createdDate) || '-')}</Text>
                        </View>
                    </View>
                </View>
            </View>
            
            {/* Content Section */}
            <ScrollView 
                style={[styles.contentContainer, { height: props?.showFullContent ? undefined : maxNewsHeight }]}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>{String(props.title || '')}</Text>
                {props.subTitle && (
                    <Text style={styles.subTitle}>{String(props.subTitle)}</Text>
                )}
                
                {renderContent(props.content)}
                
                {!props.showFullText && !props.showFullContent && (
                    <View style={styles.readMoreContainer}>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('DetailedNewsInfo', { data: { newsId: props.newsId } })} 
                            style={styles.readMoreButton}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.readMoreText}>మరింత చదవండి</Text>
                            <Ionicons name="arrow-forward" size={16} color="#fff" style={styles.readMoreIcon} />
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default NewsContainer;
