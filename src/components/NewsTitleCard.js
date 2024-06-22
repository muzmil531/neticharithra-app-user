import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { timeAgo } from '../handelers/ReusableHandeler';
import { useNavigation } from '@react-navigation/native';
// import { Icon } from 'react-native-elements';

const NewsTitleCard = (props) => {
    let navigation = useNavigation()
    return (
        <TouchableOpacity onPress={() => { navigation.navigate('NewsContainerV2', { data: props.item }) }}>


            <View style={{ display: 'flex', flexDirection: 'row', minHeight: 10, margin: 5, marginLeft: 20 }}>
                {/* <View> */}
                <Image
                    source={{ uri: props?.item?.images?.[0]?.externalURL || props?.item?.images?.[0]?.tempURL || 'https://upload.wikimedia.org/wikipedia/commons/3/32/Googleplex_HQ_%28cropped%29.jpg' }}

                    style={styles.image}
                />
                {/* </View> */}


                <View style={styles.card}>

                    <View style={styles.textContainer}>
                        <Text style={styles.title} numberOfLines={2}>{props?.item?.title}</Text>
                        {
                            props?.item?.approvedOn &&
                            <Text style={styles.time}>
                                {timeAgo(new Date(props?.item?.approvedOn))}
                            </Text>
                        }
                    </View>

                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        height: 100,
        width: "99%",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        margin: 10, marginRight: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0, marginLeft: 25, marginTop: 15
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        position: 'absolute',
        zIndex: 99999
    },
    textContainer: {
        flex: 1, flexDirection: 'column',
        marginLeft: 80, zIndex: -1,
        justifyContent: 'space-between', // Distribute space evenly between top and bottom text
        // alignItems: 'center', // Center the text horizontally
        // paddingVertical: 20, // Add some vertical padding if needed
        // justifyContent: 'center',
        // justifyContent:'space-evenly'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        width: "95%"
    },
    time: {
        fontSize: 12,
        color: 'grey', marginBottom: 10
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default NewsTitleCard;
