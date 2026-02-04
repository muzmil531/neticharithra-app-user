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
            activeOpacity={0.95}
        >
            <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.divider }]}>
                {/* Main Content */}
                <View style={styles.mainContent}>
                    {/* Text Content */}
                    <View style={styles.textContent}>
                        {/* Category & Meta Row */}
                        <View style={styles.topRow}>
                            {props?.item?.category && (
                                <View style={[styles.categoryChip, { backgroundColor: isDark ? colors.backgroundColor : '#f8f9fa', borderLeftColor: colors.brandSecondary }]}>
                                    <Text style={[styles.categoryText, { color: colors.brandSecondary }]}>
                                        {String(props?.item?.category || 'News').toUpperCase()}
                                    </Text>
                                </View>
                            )}
                            
                            <View style={styles.metaInfo}>
                                <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
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
                        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
                            {String(props?.item?.title || 'No Title Available')}
                        </Text>
                        
                        {/* Subtitle */}
                        {props?.item?.subTitle && (
                            <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                                {String(props?.item?.subTitle)}
                            </Text>
                        )}
                    </View>
                    
                    {/* Image */}
                    <View style={[styles.imageContainer, { backgroundColor: colors.backgroundColor }]}>
                        <Image 
                            source={{
                                uri: props?.item?.images?.[0]?.externalURL || 
                                     props?.item?.images?.[0]?.tempURL || 
                                     'https://via.placeholder.com/100x80?text=News'
                            }} 
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>
                </View>
                
                {/* Bottom Border */}
                <View style={styles.bottomBorder} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 0,
        marginVertical: 0,
    },
    card: {
        marginHorizontal: 16,
        marginVertical: 3,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    mainContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    textContent: {
        flex: 1,
        marginRight: 12,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    categoryChip: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 3,
        borderLeftWidth: 2,
    },
    categoryText: {
        fontSize: 9,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    metaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 10,
        fontWeight: '500',
        marginLeft: 3,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        lineHeight: 20,
        marginBottom: 4,
        letterSpacing: -0.1,
    },
    subtitle: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '400',
    },
    imageContainer: {
        width: 80,
        height: 60,
        borderRadius: 4,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default NewsTitleCard;
