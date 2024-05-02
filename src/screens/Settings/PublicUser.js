import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native'
import React, { useState, useTransition } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { removeData, retrieveData, saveData } from '../../handelers/AsyncStorageHandeler';
import OTPRequest from '../Post/PublicUserLogin/OTPRequest';
const { height } = Dimensions.get('window');

const PublicUser = ({ navigation }) => {

    let [userLoggedInfo, setUserLoggedInfo] = useState();
    let [userLangPreference, setUserLangPreference] = useState();
    useFocusEffect(
        React.useCallback(() => {
            const fetchInitialLoad = async () => {
                try {
                    let dd = await retrieveData('publicUserInfo')
                    setUserLoggedInfo(dd);
                    let lang = await retrieveData('userSavedLocation');
                    setUserLangPreference(lang)
                    console.log("dddddd", lang)
                    // let tabs = await t(dd?.publicUserId ? 'postScreen.tabsNewsAccess':'postScreen.tabsInitialOTPRequest', { returnObjects: true }) || [];
                    // console.log(tabs)
                    // setScreensList(tabs)
                } catch (error) {
                    console.error('Error fetching and changing language:', error);
                }
            };

            fetchInitialLoad();

            return () => {
                // Cleanup function (if needed)
            };
        }, []) // Dependency array includes i18n to re-trigger effect when i18n changes
    );


    const [userInfo, setUserInfo] = useState({
        name: 'John Doe',
        mobile: '123-456-7890',
        email: 'john.doe@example.com',
        address: '123 Main St, Anytown, USA',
    });
    const { t } = useTranslation()
    // State for modal visibility
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [newsPreferencesModalVisible, setNewsPreferencesModalVisible] = useState(false);
    // State for news preferences
    const [newsPreferences, setNewsPreferences] = useState({
        mandal: '',
        district: '',
        state: '',
    });

    // State for counts
    const [counts, setCounts] = useState({
        pending: 10,
        approved: 20,
        rejected: 5,
    });

    const handleEditProfile = () => {
        // Handle edit profile button click
    };

    const handleEditNewsPreferences = () => {
        // Handle edit news preferences button click
    };

    const moveToPublicSummaryHandler = async (event) => {
        console.log(event)
        if (event.status === 'success') {
            let dd = await retrieveData('publicUserInfo')
            setUserLoggedInfo(dd)
        }
    }

    const handleLogout = async () => {
        // Perform logout actions here, such as clearing user data, resetting authentication state, etc.
        // Then navigate back to the login or splash screen
        let aa = await removeData('publicUserInfo');
        setUserLoggedInfo()

    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={publicUserStyles.indexParentContainer}>
                {
                    userLoggedInfo &&


                    <View style={publicUserStyles.sectionContainer}>
                        <Text style={publicUserStyles.sectionTitle}>
                            {t('settingsScreen.yourDetails')}
                            <TouchableOpacity onPress={handleEditProfile}>
                                <Text style={publicUserStyles.editButtonText}>Edit</Text>
                            </TouchableOpacity>
                        </Text>
                        <View style={[publicUserStyles.userInfo, { alignItems: 'center' }]}>
                            <View style={publicUserStyles.imageAndName}>
                                <Image
                                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/10337/10337609.png' }}
                                    style={publicUserStyles.profileImage}
                                />
                            </View>
                            <View style={publicUserStyles.imageAndName}>
                                <Text style={[publicUserStyles.value, { textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }]}>{userLoggedInfo.name || '-'}</Text>
                            </View>
                            <View style={publicUserStyles.infoRow}>
                                <Text style={publicUserStyles.label}>{t('settingsScreen.mobileNumber')}:</Text>
                                <Text style={publicUserStyles.value}>
                                    {(userLoggedInfo?.mobileNumber ? ` (${userLoggedInfo?.countryCode}) ${userLoggedInfo?.mobileNumber}` : '-')}
                                </Text>
                            </View>
                            <View style={publicUserStyles.infoRow}>
                                <Text style={publicUserStyles.label}>{t('settingsScreen.emailId')}:</Text>
                                <Text style={publicUserStyles.value}>{userLoggedInfo?.email || '-'}</Text>
                            </View>
                            <View style={publicUserStyles.infoRow}>
                                <Text style={publicUserStyles.label}>{t('settingsScreen.address')}:</Text>
                                <Text style={publicUserStyles.value}>{userLoggedInfo?.address || '-'}</Text>
                            </View>
                        </View>
                    </View>
                }
                {
                    !userLoggedInfo &&

                    <View style={[publicUserStyles.sectionContainer, { paddingVertical: 20 }]}>
                        <OTPRequest manualFinalStep={moveToPublicSummaryHandler} />
                    </View>
                }
                <View style={publicUserStyles.sectionContainer}>
                    <Text style={publicUserStyles.sectionTitle}>
                        {t('settingsScreen.newsPreferance')} <TouchableOpacity onPress={handleEditNewsPreferences}>
                            <Text style={publicUserStyles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                    </Text>
                    <View style={publicUserStyles.newsPreferences}>
                        <View style={publicUserStyles.infoRow}>
                            <Text style={publicUserStyles.label}>{t('settingsScreen.mandal')}:</Text>
                            <Text style={publicUserStyles.value}>{userLangPreference?.town?.regionalLanguage || '-'}</Text>
                        </View>
                        <View style={publicUserStyles.infoRow}>
                            <Text style={publicUserStyles.label}>{t('settingsScreen.district')}:</Text>
                            <Text style={publicUserStyles.value}>{userLangPreference?.state?.teluguLabel || '-'}</Text>
                        </View>
                        <View style={publicUserStyles.infoRow}>
                            <Text style={publicUserStyles.label}>{t('settingsScreen.state')}:</Text>
                            <Text style={publicUserStyles.value}>{userLangPreference?.district?.regionalLanguage || '-'}</Text>
                        </View>
                    </View>
                </View>


                {
                    userLoggedInfo &&

                    <View style={publicUserStyles.sectionContainer}>
                        <Text style={publicUserStyles.sectionTitle}>Counts</Text>
                        <View style={publicUserStyles.newsCount}>
                            <View style={publicUserStyles.newsRow}>
                                <Text style={publicUserStyles.newsType}>Pending:</Text>
                                <Text>{counts.pending}</Text>
                            </View>
                            <View style={publicUserStyles.newsRow}>
                                <Text style={publicUserStyles.newsType}>Approved:</Text>
                                <Text>{counts.approved}</Text>
                            </View>
                            <View style={publicUserStyles.newsRow}>
                                <Text style={publicUserStyles.newsType}>Rejected:</Text>
                                <Text>{counts.rejected}</Text>
                            </View>
                        </View>
                    </View>
                }


                {
                    userLoggedInfo &&

                    <TouchableOpacity style={publicUserStyles.logoutButton} onPress={handleLogout}>
                        <Text style={publicUserStyles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                }
            </View>
            {/* Logout Button */}
        </ScrollView>
    )
}

export default PublicUser

const publicUserStyles = StyleSheet.create({
    indexParentContainer: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
        height: height - 10
    },
    sectionContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '80%',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingHorizontal: 20,
        paddingTop: 10,
        textAlign: 'center',
    },
    userInfo: {
        alignItems: 'center',
        padding: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 10,
        color: '#333',
    },
    value: {
        flex: 1,
        marginRight: 10,
        color: '#555',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    imageAndName: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButtonText: {
        color: '#007bff', // Adjust color as needed
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
    newsPreferences: {
        padding: 20,
    },
    newsRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    newsType: {
        fontWeight: 'bold',
        marginRight: 10,
    },
    newsCount: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: '#ff6347', // Adjust color as needed
        paddingVertical: 10,
        width: '80%',
        alignSelf: 'center',
        borderRadius: 5,
        marginBottom: 20,
    },
    logoutButtonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
})
