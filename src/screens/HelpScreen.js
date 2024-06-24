// HelpScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import te from './../assets/branding/te.png'
import en from './../assets/branding/en.png'
import { useTranslation } from 'react-i18next';
import { post } from '../handelers/APIHandeler';
import EndPointConfig from '../handelers/EndPointConfig';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
// Define team members with their details
const teamMembers = [
    {
        name: 'John Doe',
        role: 'CEO',
        email: 'john.doe@example.com',
        image: 'https://example.com/ceo.jpg',
    },
    {
        name: 'Jane Smith',
        role: 'Technical Director',
        email: 'jane.smith@example.com',
        image: 'https://example.com/technical_director.jpg',
    },
    {
        name: 'Michael Johnson',
        role: 'Incharge Director',
        email: 'michael.johnson@example.com',
        image: 'https://example.com/incharge_director.jpg',
    },
];

const HelpScreen = () => {

    const { t } = useTranslation()
    const handleWhatsAppMessage = () => {
        Linking.openURL('https://wa.me/+916362923654'); // Replace with your WhatsApp number
    };

    const handleEmail = () => {
        Linking.openURL('mailto:netichatithra@gmail.com');
    };

    const handleWebsite = () => {
        Linking.openURL('https://neticharithra-ncmedia.web.app/');
    };

    const [teamInfo, setTeamInfo] = useState([])

    const navigation = useNavigation()

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen comes into focus

            getTeamInfo()
            // console.log("called")
            // Cleanup function, executed when the component unmounts or the effect is re-run
            return () => {
                // Do cleanup here if necessary
                console.log('Screen unfocused');
            };
        }, [])
    );






    const renderTeamMember = ({ item }) => (
        <View style={styles.card}>
            {/* <Text>{item?.tempURL || 'aa'}</Text> */}
            <Image source={{ uri: item?.tempURLProfile }} style={styles.personnelImage} />
            {/* <Image source={t('languageCode') === 'te' ? te : en} style={styles.personnelImage} /> */}
            <Text style={styles.personnelName}>{item.name}</Text>
            <Text style={styles.personnelRole}>{item.role}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${item.email}`)}>
                <Text style={styles.personnelEmail}>{item.email}</Text>
            </TouchableOpacity>
        </View>
    );

    const getTeamInfo = () => {
        try {
            console.log("Called2")
            // const metaList = ['NEWS_CATEGORIES_REGIONAL'];
            post(EndPointConfig.getHelpTeam, {})
                .then(function (response) {
                    if (response?.status === 'success') {
                        console.log(response.data)
                        setTeamInfo(response?.data || []);
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
        <View style={styles.container}>
            <View style={[styles.textContainer]}>
                <TouchableOpacity onPress={() => { navigation.goBack(); }}>
                    <Ionicons
                        name={'chevron-back'}
                        color={'#000'}
                        style={[{
                            fontSize: 30, fontWeight: 'bold2'
                        }, styles.textStyleShadowLeft, styles.textStyleShadowRight, styles.textStyleShadowTop, styles.textStyleShadowBottom]}
                    />
                </TouchableOpacity>

            </View>
            <Image source={t('languageCode') === 'te' ? te : en} style={styles.logo} />

            <Text style={styles.heading}>Help & Contact Us</Text>
            <View style={styles.contactInfo}>
                <Text style={styles.infoItem}>Email: netichatithra@gmail.com</Text>
                <Text style={styles.infoItem}>Phone: +91 63629 23 654</Text>
                <Text style={[styles.infoItem, { marginBottom: 0 }]}>Website: neticharithra-ncmedia.web.app</Text>
            </View>

            <Text style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'Inter', paddingVertical: 5 }}>TEAM</Text>
            <FlatList
                data={teamInfo}
                renderItem={renderTeamMember}

                keyExtractor={(item, index) => index.toString()}
                numColumns={2} // Adjusted to 2 columns for smaller cards
                contentContainerStyle={styles.teamList}
            />

            <Text style={styles.disclaimer}>
                We do not charge for publishing news articles. Contact us via email, WhatsApp, or visit our website to publish your news.
            </Text>
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={handleWhatsAppMessage}>
                    <Text style={styles.actionText}>Message us on WhatsApp</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
                    <Text style={styles.actionText}>Contact us via Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleWebsite}>
                    <Text style={styles.actionText}>Visit our Website</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f0f0f0', // Optional: Set a background color
    },
    logo: {
        width: 200,
        height: 60,
        resizeMode: 'contain',
        // marginBottom: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        // marginTop: 10, // Adjusted top margin for spacing
    },
    contactInfo: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#fff', // Optional: Add background color for contact info box
        width: '100%', // Ensure full width
        alignItems: 'center',
    },
    infoItem: {
        fontSize: 14, // Adjusted font size
        marginBottom: 10,
    },
    disclaimer: {
        fontSize: 12, // Adjusted font size
        textAlign: 'center',
        color: '#666',
        marginBottom: 20,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        width: '100%',
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 5,
        width: "48%", marginTop: 5
    },
    actionText: {
        color: '#fff',
        fontSize: 10, // Adjusted font size
        fontWeight: 'bold',
        textAlign: 'center',
    },
    teamList: {
        marginTop: 0,
        width: '100%', justifyContent: 'space-between'
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        margin: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: 150, // Adjusted card width
    },
    personnelImage: {
        width: 80, // Adjusted image width
        height: 80, // Adjusted image height
        borderRadius: 40,
        marginBottom: 10,
    },
    personnelName: {
        fontSize: 12, // Adjusted font size
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    personnelRole: {
        fontSize: 10, // Adjusted font size
        marginBottom: 5,
        textAlign: 'center',
    },
    personnelEmail: {
        fontSize: 12, // Adjusted font size
        color: '#007bff',
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
    textContainer: {
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems: 'center',
        zIndex: 9999,
        padding: 5,
        position: 'absolute', top: 0, left: 0
    }
});

export default HelpScreen;
