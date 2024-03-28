import React, { useRef, useState } from 'react';
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { epochToDate } from '../handelers/ReusableHandeler';

const { height } = Dimensions.get('window');
const maxImageHeight = height * 0.35; // Maximum height for the image
const maxNewsHeight = height * 0.65; // Maximum height for the image

const NewsContainer = (props) => {

    const [showFullText, setShowFullText] = useState(false);

    const styles = StyleSheet.create({
        container: {
            backgroundColor: '#ffffff',
            borderRadius: 10,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
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
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 5,
        },
        content: {
            fontSize: 14,
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
            fontSize: 16,
            fontWeight: 'bold',
            color: "white",
        },
        location: {
            fontSize: 14,
            color: "white",
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
            fontSize: 14,
        },
    });
    const truncateContent = (text, maxWords) => {
        const words = text.split(' ');
        return words.slice(0, words.length - 5).join(' ') + '...'; // Removing the last 5 words
    };

    const contentRef = useRef(null);

    return (
        <View style={[styles.container, { height: height - 50 }]}>
            <View style={{ height: maxImageHeight, borderWidth: 2, overflow: 'hidden' }}>
                <Image source={{ uri: props.imageUrl }} style={[styles.image]} />
                <View style={styles.userInfo}>
                    <Image source={{ uri: props.imageUrl }} style={styles.avatar} />
                    <View style={styles.textInfo}>
                        <Text style={styles.name}>{props?.params?.employeeId || '-'}</Text>
                        <Text style={styles.location}>{props?.params?.category || '-'}</Text>
                    </View>
                    <View style={styles.textInfo2}>
                        <Text style={styles.location}>{epochToDate(props?.params?.createdDate) || '-'}</Text>
                    </View>
                </View>
            </View>
            <View style={[styles.textContainer, { height: maxNewsHeight, overflow: 'hidden' }]}>
                <Text style={styles.title}>{props.title}</Text>

                <Text
                ref={contentRef}
                    numberOfLines={showFullText ? undefined : (maxNewsHeight - 150) / 20}
                    ellipsizeMode="tail"
                    style={styles.content}
                >
                    {/* {props.content} */}
                    {truncateContent(props.content, 5)}
                </Text>
                <TouchableOpacity onPress={() =>{console.log(contentRef)}} style={styles.readMoreContainer}>
                        <Text style={styles.readMoreText}>మరింత సమాచారం చదవడానికి క్లిక్ చేయండి</Text>
                    </TouchableOpacity>
             

            </View>
        </View>
    );
};

export default NewsContainer;
