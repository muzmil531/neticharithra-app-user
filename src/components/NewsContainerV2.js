import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'

import imageBg from '../assets/branding/logo.png'
import { timeAgo } from '../handelers/ReusableHandeler';
import { TouchableOpacity } from 'react-native-gesture-handler';
const height = Dimensions.get('screen').height;

const NewsContainerV2 = () => {
    let route = useRoute();
    let navigation = useNavigation();
    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    console.log(route.params)

                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData(); // Call the async function when the screen gains focus
        }, [])
    );
    return (
        <View style={styles.container}>
            <View style={{ height: height * 0.35 }}>
                <Image
                    source={{ uri: route?.params?.data?.images?.[0]?.tempURL || 'https://upload.wikimedia.org/wikipedia/commons/3/32/Googleplex_HQ_%28cropped%29.jpg' }}

                    style={styles.image}
                />
                <View style={[styles.textContainer]}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>

                        <Ionicons name={'chevron-back'} color={"#fff"} style={[{ fontSize: 30, fontWeight: 'bold2' }, styles.textStyleShadowLeft, styles.textStyleShadowRight, styles.textStyleShadowTop, styles.textStyleShadowBottom]} />
                    </TouchableOpacity>
                    <Ionicons name={'share-social-sharp'} color={"#fff"} style={[{ fontSize: 25, paddingHorizontal: 10 }, styles.textStyleShadowLeft, styles.textStyleShadowRight, styles.textStyleShadowTop, styles.textStyleShadowBottom]} />
                    {/* <Text>HU</Text> */}
                </View>
                <View style={[styles.textContainer, { position: 'absolute', bottom: 0, width: "100%", bottom: 20, padding: 15 }]}>
                    {
                        route?.params?.data?.approvedOn &&
                        <Text style={[styles.textStyle, styles.textStyleShadowLeft, styles.textStyleShadowRight, styles.textStyleShadowTop, styles.textStyleShadowBottom]}>

                            {timeAgo(new Date(route?.params?.data?.approvedOn))}
                        </Text>


                    }
                </View>
            </View>
            <View style={{
                height: height * 0.65, justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
            }}>
                <Image
                    source={imageBg}
                    style={styles.backgroundImage}
                />
                <View style={styles.overlayText}>
                    <ScrollView>
                        <Text style={{ fontSize: 30, color: '#000', borderLeftWidth: 3, borderLeftColor: "#B61F24", paddingLeft: 20, fontWeight: 'bold' }}>{route?.params?.data?.title}</Text>
                        <Text style={{ fontSize: 14, color: '#000', paddingLeft: 0, marginTop: 15 }}>{route?.params?.data?.description}</Text>

                    </ScrollView>
                </View>
            </View>
        </View>
    )
}

export default NewsContainerV2

const styles = StyleSheet.create({
    container: {
        flex: 1
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
        // textAlign: 'center',
        top: 0, left: 0, width: '100%', height: "85%", paddingHorizontal: 20
    },
    image: {
        width: "100%",
        height: "100%",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        position: 'absolute', borderWidth: 3, top: -15,
        zIndex: 999
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 9999,
        padding: 5,
        // backgroundColor: "#0009",
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black'
    },


    timeAgo: {
        textShadowColor: '#fff', // Shadow color
        textShadowOffset: { width: 3, height: 3 }, // Shadow offset
        textShadowRadius: 1, // Shadow blur radius
        fontSize: 50,
        color: "#000"
    },
    textStyle: {
        fontSize: 16,
        color: "#fff",
        textShadowColor: '#000',
        textShadowOffset: { width: 3, height: 3 }, // Bottom-right shadow
        textShadowRadius: 1, // Shadow blur radius
    },
    textStyleShadowLeft: {
        textShadowColor: '#000',
        textShadowOffset: { width: -3, height: 0 }, // Left shadow
        textShadowRadius: 1, // Shadow blur radius
    },
    textStyleShadowRight: {
        textShadowColor: '#000',
        textShadowOffset: { width: 3, height: 0 }, // Right shadow
        textShadowRadius: 1, // Shadow blur radius
    },
    textStyleShadowTop: {
        textShadowColor: '#000',
        textShadowOffset: { width: 0, height: -3 }, // Top shadow
        textShadowRadius: 1, // Shadow blur radius
    },
    textStyleShadowBottom: {
        textShadowColor: '#000',
        textShadowOffset: { width: 0, height: 3 }, // Bottom shadow
        textShadowRadius: 1, // Shadow blur radius
    }


})
