import { Dimensions, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import imageBg from '../assets/branding/logo.png';
import { timeAgo } from '../handelers/ReusableHandeler';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar, Card } from 'react-native-paper';
import { post } from '../handelers/APIHandeler';
import EndPointConfig from '../handelers/EndPointConfig';

const height = Dimensions.get('screen').height;

const NewsContainerV2 = () => {
    let route = useRoute();
    let [newsInfo, setNewsInfo] = useState()
    let navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    // console.log(route.params);
                    getnewsInfo(route.params.data)
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData(); // Call the async function when the screen gains focus
        }, [route.params])
    );




    const openSourceLink = () => {
        if (newsInfo?.source !== 'Neti Charithra' && newsInfo?.sourceLink) {
            Linking.openURL(newsInfo?.sourceLink);
        }
    };

    const getnewsInfo = (payload) => {
        try {
            post(EndPointConfig.getIndividualNewsInfo, payload)
                .then(function (response) {
                    if (response?.status === 'success') {

                        setNewsInfo(response?.data?.specificRecord?.[0] || {})
                        console.log(response?.data?.specificRecord?.[0])
                    }
                })
                .catch(function (error) {
                    console.error(error);
                });

        } catch (error) {
            console.error(error);
        }
    };
    return (

        <>
            {
                newsInfo &&
                <View style={styles.container}>
                    <View style={{ height: height * 0.35 }}>
                        <Image
                            source={{
                                uri:
                                    newsInfo?.images?.[0]?.['externalURL'] ||
                                    newsInfo?.images?.[0]?.tempURL ||
                                    'https://upload.wikimedia.org/wikipedia/commons/3/32/Googleplex_HQ_%28cropped%29.jpg',
                            }}
                            style={styles.image}
                        />
                        <View style={[styles.textContainer]}>
                            <TouchableOpacity onPress={() => { navigation.goBack(); }}>
                                <Ionicons
                                    name={'chevron-back'}
                                    color={'#fff'}
                                    style={[{
                                        fontSize: 30, fontWeight: 'bold2', backgroundColor: '#0000007d', padding: 5,
                                    }, styles.textStyleShadowLeft, styles.textStyleShadowRight, styles.textStyleShadowTop, styles.textStyleShadowBottom]}
                                />
                            </TouchableOpacity>
                            <Ionicons
                                name={'share-social-sharp'}
                                color={'#fff'}
                                style={[{
                                    fontSize: 25, padding: 5, backgroundColor: '#0000007d',
                                }, styles.textStyleShadowLeft, styles.textStyleShadowRight, styles.textStyleShadowTop, styles.textStyleShadowBottom]}
                            />
                        </View>
                        <View style={[styles.textContainer, { position: 'absolute', bottom: 0, width: '100%', padding: 0, marginBottom: 10 }]}>
                            {newsInfo?.approvedOn && (
                                <Text style={[styles.textStyle, styles.textStyleShadowLeft, styles.textStyleShadowRight, styles.textStyleShadowTop, styles.textStyleShadowBottom]}>
                                    {timeAgo(new Date(newsInfo?.approvedOn))}
                                </Text>
                            )}
                        </View>
                    </View>
                    <View style={{ height: height * 0.65, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        <Image source={imageBg} style={styles.backgroundImage} />
                        <View style={styles.overlayText}>
                            <ScrollView>
                                <Text style={{ fontSize: 18, color: '#000', borderLeftWidth: 3, borderLeftColor: '#B61F24', fontWeight: 'bold' }}>
                                    {newsInfo?.title}
                                </Text>
                                <Text style={{ fontSize: 14, color: '#000', paddingLeft: 0, marginTop: 15 }}>
                                    {newsInfo?.description}
                                </Text>
                                {
                                    newsInfo?.source === 'Neti Charithra'
                                    &&

                                    <Text style={{ marginTop: 10, color: '#cccddd' }}>Reported By</Text>

                                }
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 10,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#ccc',
                                    backgroundColor: '#fff',
                                    margin: 10,
                                    marginBottom: 20,

                                    borderRadius: 5,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowRadius: 2,
                                    elevation: 1,
                                }}>


                                    {
                                        newsInfo?.source === 'Neti Charithra'
                                        &&

                                        <Image source={{ uri: newsInfo?.reportedBy?.['profilePicture']?.['tempURL'] }} style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            marginRight: 10,
                                        }} />
                                    }
                                    <View style={{ flex: 1 }}>
                                        {
                                            newsInfo?.source === 'Neti Charithra'
                                            &&

                                            <View>
                                                <Text style={{
                                                    fontSize: 14,
                                                    fontWeight: 'bold',
                                                    color: '#333',
                                                }}>{newsInfo?.reportedBy?.name}

                                                </Text>
                                                <Text style={{
                                                    fontSize: 12,
                                                    color: '#ccc',
                                                }}>{newsInfo?.reportedBy?.role}</Text>

                                            </View>
                                        }
                                        <Pressable onPress={openSourceLink}>

                                            <Text style={{
                                                fontSize: 12,
                                                marginTop: newsInfo?.source === 'Neti Charithra' ? 10 : 'auto',
                                                color: '#aaa',
                                            }}>Source / Credits: &nbsp;
                                                {newsInfo?.source}
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>

                            </ScrollView>
                        </View>
                    </View>


                </View>
            }
        </>
    );
};

export default NewsContainerV2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
    image: {
        width: '100%',
        height: '100%',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        position: 'absolute',
        borderWidth: 3,
        top: -15,
        zIndex: 999,
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 9999,
        padding: 5,
    },
    textStyle: {
        backgroundColor: '#0000007d',
        width: "100%",
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 16,
        color: '#fff',
        textShadowColor: '#000',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 1,
    },
    textStyleShadowLeft: {
        textShadowColor: '#000',
        textShadowOffset: { width: -3, height: 0 },
        textShadowRadius: 1,
    },
    textStyleShadowRight: {
        textShadowColor: '#000',
        textShadowOffset: { width: 3, height: 0 },
        textShadowRadius: 1,
    },
    textStyleShadowTop: {
        textShadowColor: '#000',
        textShadowOffset: { width: 0, height: -3 },
        textShadowRadius: 1,
    },
    textStyleShadowBottom: {
        textShadowColor: '#000',
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 1,
    },
    card: {
        // margin: 10,
        zIndex: 999999, marginBottom: 15
    },
    credits: {
        fontSize: 12,
        color: '#888',
        // marginTop: 5,
    },
});
