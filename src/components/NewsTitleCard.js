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

const { width } = Dimensions.get('window');

const NewsTitleCard = (props) => {
    const navigation = useNavigation();
    
    return (
        <TouchableOpacity 
            onPress={() => navigation.navigate('NewsContainerV2', { data: props.item })}
            style={styles.container}
            activeOpacity={0.8}
        >
            <View style={styles.card}>
                {/* Image Section */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ 
                            uri: props?.item?.images?.[0]?.externalURL || 
                                 props?.item?.images?.[0]?.tempURL || 
                                 'https://upload.wikimedia.org/wikipedia/commons/3/32/Googleplex_HQ_%28cropped%29.jpg' 
                        }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    
                    {/* Category Badge */}
                    {props?.item?.category && (
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{String(props.item.category)}</Text>
                        </View>
                    )}
                </View>

                {/* Content Section */}
                <View style={styles.contentContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.title} numberOfLines={3}>
                            {props?.item?.title || 'No Title'}
                        </Text>
                        
                        {props?.item?.sub_title && (
                            <Text style={styles.subtitle} numberOfLines={2}>
                                {props.item.sub_title || ''}
                            </Text>
                        )}
                        
                        <View style={styles.metaContainer}>
                            <View style={styles.timeContainer}>
                                <Ionicons name="time-outline" size={14} color="#666" />
                                <Text style={styles.timeText}>
                                    {(() => {
                                        try {
                                            if (props?.item?.approvedOn) {
                                                const timeResult = timeAgo(new Date(props.item.approvedOn));
                                                return timeResult ? String(timeResult) : 'Just now';
                                            }
                                            return 'Just now';
                                        } catch (error) {
                                            return 'Just now';
                                        }
                                    })()}
                                </Text>
                            </View>
                            
                            {(() => {
                                try {
                                    const viewCount = props?.item?.viewCount;
                                    if (viewCount !== undefined && viewCount !== null && viewCount !== '') {
                                        return (
                                            <View style={styles.viewContainer}>
                                                <Ionicons name="eye-outline" size={14} color="#666" />
                                                <Text style={styles.viewText}>{String(viewCount)}</Text>
                                            </View>
                                        );
                                    }
                                    return null;
                                } catch (error) {
                                    return null;
                                }
                            })()}
                        </View>
                    </View>
                    
                    {/* Read More Arrow */}
                    <View style={styles.arrowContainer}>
                        <Ionicons name="chevron-forward" size={20} color="#007bff" />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 8,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        flexDirection: 'row',
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
        width: 120,
        height: 120,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    categoryBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#007bff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    categoryText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
        minHeight: 120,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
        lineHeight: 22,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 8,
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
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
    arrowContainer: {
        paddingRight: 16,
        justifyContent: 'center',
    },
});

export default NewsTitleCard;
