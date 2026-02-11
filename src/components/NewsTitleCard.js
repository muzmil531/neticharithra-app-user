import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Platform
} from 'react-native';
import { timeAgo } from '../handelers/ReusableHandeler';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const NewsTitleCard = (props) => {
    const navigation = useNavigation();
    const { colors, isDark } = useTheme();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => {
                navigation.navigate('NewsContainerV2', { data: props.item })
            }}
            activeOpacity={0.7}
        >
            <View style={[styles.card, { backgroundColor: colors.cardBackground, borderBottomColor: colors.borderLight }]}>
                {/* Horizontal Layout */}
                <View style={styles.contentRow}>
                    {/* Left: Text Content */}
                    <View style={styles.textSection}>
                        {/* Category & Time Row */}
                        <View style={styles.metaRow}>
                            {props?.item?.category && (
                                <View style={[styles.categoryBadge, { backgroundColor: isDark ? colors.backgroundColor : '#f5f5f5' }]}>
                                    <View style={[styles.categoryDot, { backgroundColor: colors.brandSecondary }]} />
                                    <Text style={[styles.categoryText, { color: colors.brandSecondary }]}>
                                        {String(props?.item?.category || 'News').toUpperCase()}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.timeContainer}>
                                <Ionicons name="time-outline" size={11} color={colors.textTertiary} />
                                <Text style={[styles.timeText, { color: colors.textTertiary }]}>
                                    {(() => {
                                        try {
                                            if (props?.item?.approvedOn) {
                                                const timeString = timeAgo(new Date(props.item.approvedOn));
                                                return String(timeString || 'Just now');
                                            }
                                            return 'Just now';
                                        } catch (error) {
                                            return 'Just now';
                                        }
                                    })()}
                                </Text>
                            </View>
                        </View>

                        {/* Title */}
                        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={3}>
                            {String(props?.item?.title || 'No Title Available')}
                        </Text>

                        {/* Subtitle (optional) */}
                        {props?.item?.subTitle && (
                            <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                                {String(props?.item?.subTitle)}
                            </Text>
                        )}
                    </View>

                    {/* Right: Thumbnail Image */}
                    <View style={[styles.imageContainer, { backgroundColor: colors.backgroundColor }]}>
                        <Image
                            source={{
                                uri: props?.item?.images?.[0]?.externalURL ||
                                    props?.item?.images?.[0]?.tempURL ||
                                    'https://via.placeholder.com/90x90?text=News'
                            }}
                            style={styles.thumbnail}
                            resizeMode="cover"
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 0,
    },
    card: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 0.5,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    textSection: {
        flex: 1,
        marginRight: 12,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        flexWrap: 'wrap',
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        marginRight: 8,
    },
    categoryDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginRight: 4,
    },
    categoryText: {
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 11,
        fontWeight: '500',
        marginLeft: 3,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 18,
        marginBottom: 2,
        letterSpacing: -0.1,
    },
    subtitle: {
        fontSize: 11,
        lineHeight: 15,
        fontWeight: '400',
        marginTop: 2,
    },
    imageContainer: {
        width: 65,
        height: 65,
        borderRadius: 8,
        overflow: 'hidden',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
});

export default NewsTitleCard;
