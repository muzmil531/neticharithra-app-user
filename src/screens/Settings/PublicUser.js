import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native'
import React, { useState, useTransition } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { removeData, retrieveData, saveData } from '../../handelers/AsyncStorageHandeler';
import OTPRequest from '../Post/PublicUserLogin/OTPRequest';
import { Modal } from 'react-native-paper';
import SpecificDistrict from '../News/SpecificDistrict';
const { height } = Dimensions.get('window');
import FontAwesome5 from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DFM from '../../components/DFM';
import { post } from '../../handelers/APIHandeler';
import EndPointConfig from '../../handelers/EndPointConfig';
import ToasterService from '../../components/ToasterService';
import { useTheme } from '../../context/ThemeContext';

const PublicUser = ({ }) => {

    const navigation = useNavigation()
    const { colors, isDark, themeMode, setTheme } = useTheme();
    let [userLoggedInfo, setUserLoggedInfo] = useState();
    let [userLangPreference, setUserLangPreference] = useState();
    let [useLangCode, setUserLangCode] = useState();
    let [userDetailsDFM, setUserDetailsDFM] = useState();
    useFocusEffect(
        React.useCallback(() => {


            fetchInitialLoad();

            return () => {
                // Cleanup function (if needed)
            };
        }, []) // Dependency array includes i18n to re-trigger effect when i18n changes
    );

    const fetchInitialLoad = async () => {
        try {
            let langugage = await retrieveData('userLanguageSaved', 'string');
            setUserLangCode(langugage)
            let dd = await retrieveData('publicUserInfo')
            setUserLoggedInfo(dd);
            let lang = await retrieveData('userSavedLocation');
            console.log("lang", lang)
            setUserLangPreference(lang)
            console.log("dddddd", lang)
            let dfm = t('userDetailsDFM', { returnObjects: true });
            setUserDetailsDFM(dfm);
            if (dd) {

                getNewsCount(dd)
            }
            // let tabs = await t(dd?.publicUserId ? 'postScreen.tabsNewsAccess':'postScreen.tabsInitialOTPRequest', { returnObjects: true }) || [];
            // console.log(tabs)
            // setScreensList(tabs)
        } catch (error) {
            console.error('Error fetching and changing language:', error);
        }
    };

    const { t } = useTranslation()
    // State for modal visibility

    // State for counts
    const [counts, setCounts] = useState({
        pending: 0,
        approved: 0,
        rejected: 0,
    });




    const moveToPublicSummaryHandler = async (event) => {
        console.log(event)
        if (event.status === 'success') {
            let dd = await retrieveData('publicUserInfo')
            setUserLoggedInfo(dd)
        }
    }
    const [visible, setVisible] = React.useState(false);
    const [userModalVisible, setUserModalVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);



    const showUserModal = () => setUserModalVisible(true);
    const hideUserModal = () => setUserModalVisible(false);


    const handleLogout = async () => {
        let aa = await removeData('publicUserInfo');
        setUserLoggedInfo()

    }

    const redirectBackHandeler = () => {
        hideModal();
        fetchInitialLoad();
    }

    const formSubmitHandeler = (event) => {
        console.log(event)
        if (event?.type === 'submit') {
            console.log(event.values)

            try {

                post(EndPointConfig.updateUserInfo, event.values)
                    .then(function (response) {
                        if (response?.status === 'success' && response?.data) {
                            // console.log(response.data)
                            saveData('publicUserInfo', JSON.stringify(response?.data || {}));
                            ToasterService.showSuccess(response?.message || t('success'));
                            if (response.newsCount) {
                                setCounts(response.newsCount)
                            }
                            setUserLoggedInfo(response?.data || {})
                            hideUserModal()

                            console.log("USER CREATED")
                        } else {
                            ToasterService.showError(response.message || t('someThingWentWrong'))
                        }
                    })
                    .catch(function (error) {
                        ToasterService.showError(t('someThingWentWrong'))
                        console.error(error);
                    });

            } catch (error) {
                ToasterService.showError(t('someThingWentWrong'))
                console.error(error);
            }
        }
    }
    const getNewsCount = (event) => {

        try {

            post(EndPointConfig.getUserNewsCount, event)
                .then(function (response) {
                    if (response?.status === 'success') {
                        // console.log(response.data)
                        if (response.newsCount) {
                            setCounts(response.newsCount)
                        }


                    } else {
                        ToasterService.showError(response.message || t('someThingWentWrong'))
                    }
                })
                .catch(function (error) {
                    ToasterService.showError(t('someThingWentWrong'))
                    console.error(error);
                });

        } catch (error) {
            ToasterService.showError(t('someThingWentWrong'))
            console.error(error);
        }

    }
    return (
        <>
            <ScrollView style={{ backgroundColor: colors.backgroundColor }}>
                <View style={[publicUserStyles.indexParentContainer, { backgroundColor: colors.backgroundColor }]}>
                    {
                        userLoggedInfo &&


                        <View style={[publicUserStyles.sectionContainer, { backgroundColor: colors.cardBackground }]}>
                            <Text style={[publicUserStyles.sectionTitle, { color: colors.textPrimary }]}>
                                {t('settingsScreen.yourDetails')}
                            </Text>
                            <TouchableOpacity style={closeButtonStyle} onPress={showUserModal}>
                                <FontAwesome5
                                    style={{
                                        fontSize: 15,
                                        fontWeight: 'bold',
                                        color: colors.textPrimary
                                    }}
                                    name="edit"
                                />
                                {/*  */}

                            </TouchableOpacity>
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
                                    <Text style={[publicUserStyles.label, { color: colors.textPrimary }]}>{t('settingsScreen.mobileNumber')}:</Text>
                                    <Text style={[publicUserStyles.value, { color: colors.textSecondary }]}>
                                        {(userLoggedInfo?.mobileNumber ? ` (${userLoggedInfo?.countryCode}) ${userLoggedInfo?.mobileNumber}` : '-')}
                                    </Text>
                                </View>
                                <View style={publicUserStyles.infoRow}>
                                    <Text style={[publicUserStyles.label, { color: colors.textPrimary }]}>{t('settingsScreen.emailId')}:</Text>
                                    <Text style={[publicUserStyles.value, { color: colors.textSecondary }]}>{userLoggedInfo?.mail || '-'}</Text>
                                </View>
                                <View style={publicUserStyles.infoRow}>
                                    <Text style={[publicUserStyles.label, { color: colors.textPrimary }]}>{t('settingsScreen.address')}:</Text>
                                    <Text style={[publicUserStyles.value, { color: colors.textSecondary }]}>{userLoggedInfo?.address || '-'}</Text>
                                </View>
                            </View>
                        </View>
                    }
                    {
                        !userLoggedInfo &&

                        <View style={[publicUserStyles.sectionContainer, { paddingVertical: 20, backgroundColor: colors.cardBackground }]}>
                            <OTPRequest manualFinalStep={moveToPublicSummaryHandler} />
                        </View>
                    }
                    <View style={[publicUserStyles.sectionContainer, { backgroundColor: colors.cardBackground }]}>
                        <Text style={[publicUserStyles.sectionTitle, { color: colors.textPrimary }]}>
                            {t('settingsScreen.newsPreferance')}
                        </Text>
                        <TouchableOpacity style={closeButtonStyle} onPress={showModal}>
                            {/* <Text>Close</Text> */}
                            <FontAwesome5
                                style={{
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                }}
                                name="edit"
                            />
                            {/*  */}

                        </TouchableOpacity>
                        <View style={publicUserStyles.newsPreferences}>
                            <View style={publicUserStyles.infoRow}>
                                <Text style={[publicUserStyles.label, { color: colors.textPrimary }]}>{t('settingsScreen.mandal')}:</Text>
                                <Text style={[publicUserStyles.value, { color: colors.textSecondary }]}>{userLangPreference?.town?.[useLangCode] || '-'}</Text>
                            </View>
                            <View style={publicUserStyles.infoRow}>
                                <Text style={[publicUserStyles.label, { color: colors.textPrimary }]}>{t('settingsScreen.district')}:</Text>
                                <Text style={[publicUserStyles.value, { color: colors.textSecondary }]}>{userLangPreference?.district?.[useLangCode] || '-'}</Text>
                            </View>
                            <View style={publicUserStyles.infoRow}>
                                <Text style={[publicUserStyles.label, { color: colors.textPrimary }]}>{t('settingsScreen.state')}:</Text>
                                <Text style={[publicUserStyles.value, { color: colors.textSecondary }]}>{userLangPreference?.state?.[useLangCode] || '-'}</Text>
                            </View>
                        </View>
                    </View>


                    {
                        userLoggedInfo &&

                        <View style={[publicUserStyles.sectionContainer, { backgroundColor: colors.cardBackground }]}>
                            <Text style={[publicUserStyles.sectionTitle, { color: colors.textPrimary }]}>Counts</Text>
                            <View style={publicUserStyles.newsCount}>
                                <View style={publicUserStyles.newsRow}>
                                    <Text style={[publicUserStyles.newsType, { color: colors.textPrimary }]}>Pending:</Text>
                                    <Text style={{ color: colors.textSecondary }}>{counts.pending}</Text>
                                </View>
                                <View style={publicUserStyles.newsRow}>
                                    <Text style={[publicUserStyles.newsType, { color: colors.textPrimary }]}>Approved:</Text>
                                    <Text style={{ color: colors.textSecondary }}>{counts.approved}</Text>
                                </View>
                                <View style={publicUserStyles.newsRow}>
                                    <Text style={[publicUserStyles.newsType, { color: colors.textPrimary }]}>Rejected:</Text>
                                    <Text style={{ color: colors.textSecondary }}>{counts.rejected}</Text>
                                </View>
                            </View>
                        </View>
                    }
                    <View style={[publicUserStyles.sectionContainer, { backgroundColor: colors.cardBackground }]}>
                        <Text style={[publicUserStyles.sectionTitle, { color: colors.textPrimary }]}>
                            {t('settingsScreen.themeSettings') || 'Theme Settings'}
                        </Text>
                        <View style={publicUserStyles.themeContainer}>
                            <TouchableOpacity 
                                style={[
                                    publicUserStyles.themeOption,
                                    { backgroundColor: colors.backgroundColor, borderColor: colors.borderLight },
                                    themeMode === 'light' && { borderColor: colors.brandSecondary, borderWidth: 2 }
                                ]}
                                onPress={() => setTheme('light')}
                            >
                                <Ionicons name="sunny" size={24} color={themeMode === 'light' ? colors.brandSecondary : colors.textSecondary} />
                                <Text style={[
                                    publicUserStyles.themeOptionText,
                                    { color: themeMode === 'light' ? colors.brandSecondary : colors.textSecondary }
                                ]}>
                                    {t('settingsScreen.lightTheme') || 'Light'}
                                </Text>
                                {themeMode === 'light' && (
                                    <Ionicons name="checkmark-circle" size={20} color={colors.brandSecondary} style={publicUserStyles.checkIcon} />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[
                                    publicUserStyles.themeOption,
                                    { backgroundColor: colors.backgroundColor, borderColor: colors.borderLight },
                                    themeMode === 'dark' && { borderColor: colors.brandSecondary, borderWidth: 2 }
                                ]}
                                onPress={() => setTheme('dark')}
                            >
                                <Ionicons name="moon" size={24} color={themeMode === 'dark' ? colors.brandSecondary : colors.textSecondary} />
                                <Text style={[
                                    publicUserStyles.themeOptionText,
                                    { color: themeMode === 'dark' ? colors.brandSecondary : colors.textSecondary }
                                ]}>
                                    {t('settingsScreen.darkTheme') || 'Dark'}
                                </Text>
                                {themeMode === 'dark' && (
                                    <Ionicons name="checkmark-circle" size={20} color={colors.brandSecondary} style={publicUserStyles.checkIcon} />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[
                                    publicUserStyles.themeOption,
                                    { backgroundColor: colors.backgroundColor, borderColor: colors.borderLight },
                                    themeMode === 'system' && { borderColor: colors.brandSecondary, borderWidth: 2 }
                                ]}
                                onPress={() => setTheme('system')}
                            >
                                <MaterialCommunityIcons name="theme-light-dark" size={24} color={themeMode === 'system' ? colors.brandSecondary : colors.textSecondary} />
                                <Text style={[
                                    publicUserStyles.themeOptionText,
                                    { color: themeMode === 'system' ? colors.brandSecondary : colors.textSecondary }
                                ]}>
                                    {t('settingsScreen.systemTheme') || 'System'}
                                </Text>
                                {themeMode === 'system' && (
                                    <Ionicons name="checkmark-circle" size={20} color={colors.brandSecondary} style={publicUserStyles.checkIcon} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={[publicUserStyles.logoutButton, { backgroundColor: colors.brandSecondary }]} onPress={()=>{navigation.navigate('MainScreen')}}>
                        <Text style={publicUserStyles.logoutButtonText}>Change Language</Text>
                    </TouchableOpacity>

                    {
                        userLoggedInfo &&

                        <TouchableOpacity style={[publicUserStyles.logoutButton, { backgroundColor: colors.error }]} onPress={handleLogout}>
                            <Text style={publicUserStyles.logoutButtonText}>Logout</Text>
                        </TouchableOpacity>
                    }
                </View>
                {/* Logout Button */}

            </ScrollView>
            <Modal visible={userModalVisible} onDismiss={hideUserModal} dismissable={false} >
                <View style={[containerStyle, { backgroundColor: colors.modalBackground }]}>
                    <Text style={[publicUserStyles.sectionTitle, { color: colors.textPrimary }]}>

                        {t('settingsScreen.yourDetails')}
                    </Text>
                    {userDetailsDFM &&
                        <DFM dfmForm={userDetailsDFM} dfmValues={userLoggedInfo} onFormSubmit={formSubmitHandeler} />
                    }
                    <TouchableOpacity style={closeButtonStyle} onPress={hideUserModal} >
                        {/* <Text>Close</Text> */}
                        <FontAwesome5
                            style={{
                                fontSize: 15,
                                fontWeight: 'bold',
                            }}
                            name="close"
                        />
                        {/*  */}


                    </TouchableOpacity>
                </View>
            </Modal>
            <Modal visible={visible} onDismiss={hideModal} dismissable={false} >
                <View style={[containerStyle, { backgroundColor: colors.modalBackground }]}>
                    <Text style={[publicUserStyles.sectionTitle, { color: colors.textPrimary }]}>    {t('settingsScreen.newsPreferance')} </Text>
                    <SpecificDistrict directDFM={true} redirectBack={redirectBackHandeler} />
                    <TouchableOpacity style={closeButtonStyle} onPress={hideModal} >
                        {/* <Text>Close</Text> */}
                        <FontAwesome5
                            style={{
                                fontSize: 15,
                                fontWeight: 'bold',
                                color: colors.textPrimary
                            }}
                            name="close"
                        />
                      
                    </TouchableOpacity>
                </View>
            </Modal>

        </>
    )
}


const closeButtonStyle = {
    position: 'absolute',
    top: 10,
    right: 10,
};

export default PublicUser
// const containerStyle = { marginHorizontal: 10, backgroundColor: 'white', textAlign: 'center' };
const containerStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingTop: 10
};
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
        marginLeft: 10
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
    },
    themeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 10,
    },
    themeOption: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        position: 'relative',
    },
    themeOptionText: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    checkIcon: {
        position: 'absolute',
        top: 5,
        right: 5,
    }
})
