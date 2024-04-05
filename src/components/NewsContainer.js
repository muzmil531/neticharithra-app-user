import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { calculateNumberOfLines, epochToDate, scaleFont } from '../handelers/ReusableHandeler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import logo from './../assets/branding/logo.png'; // Import your logo image

const { height } = Dimensions.get('window');
const maxImageHeight = height * 0.35; // Maximum height for the image
const maxNewsHeight = height * 0.65; // Maximum height for the news content

const NewsContainer = (props) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: '#ffffff',
            // borderRadius: 10,
            overflow: 'hidden',
            ...Platform.select({
                ios: {
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                },
                android: {
                    elevation: 5,
                },
            }),
        },
        image: {
            flex: 1,
            width: '100%',
            resizeMode: 'cover',
        },
        textContainer: {
            padding: 10,
        },
        title: {
            fontSize: scaleFont(14), // Increase font size for title
            fontWeight: 'bold', color: '#666',
            // marginBottom: 5,
        },
        sub_title: {
            fontSize: scaleFont(12), // Increase font size for subTitle
            // color: '#dcc', // Change color for subtitle
            fontWeight: 'bold', // Make subtitle bold
            marginBottom: 5,
            marginTop: 5,
        },
        content: {
            // fontSize: 16, // Increase font size for content
            fontSize: scaleFont(12),
            // lineHeight: 24, // Adjust line height as needed
        },
        userInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: '#00000073',
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
        },
        textInfo: {
            marginLeft: 10,
        },
        textInfo2: {
            flex: 1,
            alignItems: 'flex-end',
        },
        name: {
            fontSize: scaleFont(10),
            fontWeight: 'bold',
            color: 'white',
        },
        location: {
            fontSize: scaleFont(10),
            color: 'white',
        },
        readMoreContainer: {
            bottom: 10,
            right: 10,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 5,
        },
        readMoreText: {
            color: '#007AFF',
            fontWeight: 'bold',
            fontSize: scaleFont(12),
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

    const navigation = useNavigation();

    return (
        <View style={[styles.container, { height: props?.showFullContent ? undefined : (height - 50) }]}>
            <View style={{ height: maxImageHeight, overflow: 'hidden' }}>
                <Image
                    source={props.imageUrl ? { uri: props.imageUrl } : logo}
                    style={[styles.image]}
                />
                <View style={styles.userInfo}>
                    <Image source={logo} style={styles.avatar} />
                    <View style={styles.textInfo}>
                        <Text style={styles.name}>{props?.params?.employeeId || '-'}</Text>
                        <Text style={styles.location}>{props?.params?.category || '-'}</Text>
                    </View>
                    <View style={styles.textInfo2}>
                        <Text style={styles.location}>{epochToDate(props?.params?.createdDate) || '-'}</Text>
                    </View>
                </View>
            </View>
            <ScrollView style={[styles.textContainer, { height: props?.showFullContent ? undefined : maxNewsHeight, overflow: 'hidden' }]}>
                <Text style={styles.title}>{props.title}</Text>
                <Text style={styles.sub_title}>{props.subTitle}</Text>

                {renderContent(props.content)}

                {!props.showFullText && !props.showFullContent && (
                    <TouchableOpacity onPress={() => navigation.navigate('DetailedNewsInfo', { data: { newsId: props.newsId } })} style={styles.readMoreContainer}>
                        <Text style={styles.readMoreText}>మరింత సమాచారం చదవడానికి క్లిక్ చేయండి</Text>
                    </TouchableOpacity>
                )}

            </ScrollView>
        </View>
    );
};

export default NewsContainer;
