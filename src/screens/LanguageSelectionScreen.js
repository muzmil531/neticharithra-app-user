import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, Animated } from 'react-native';
import { Button } from 'react-native-paper';
import { scaleFont } from '../handelers/ReusableHandeler';
import { useTranslation } from 'react-i18next';
import i18next from './../../services/i18next';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { retrieveData, saveData } from '../handelers/AsyncStorageHandeler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useTheme } from '../context/ThemeContext';

export const languageList = [
    //     "nativeName": "English",
    //     "code": "en",
    //     'letter': "A",
    //     "styles": {
    //         fontWeight: "bold", fontSize: scaleFont(30)
    //     }
    // },
    {
        "imageName": require('./../assets/languageImages/telugu.jpg'),
        "color": "#007bff",
        "name": "Telugu",
        "nativeName": "తెలుగు",
        "code": "te",
        letter: "అ",
        icon: "translate"
    }
];

const LanguageSelectionScreen = ({ }) => {
    const [selectedLanguage, setSelectedLanguage] = useState("te");
    const [scaleAnim] = useState(new Animated.Value(1));
    const themeData = useTheme();
    const colors = themeData?.colors || {
        screenBackground: '#f8f9fa',
        headerThemeBg: '#fff',
        cardBackground: '#fff',
        brandSecondary: '#007bff',
        textPrimary: '#1a1a1a',
        textSecondary: '#666',
        textTertiary: '#999'
    };
    const isDark = themeData?.isDark || false;
    const { t } = useTranslation();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        header: {
            paddingTop: hp('6%'),
            paddingBottom: hp('4%'),
            paddingHorizontal: wp('6%'),
            alignItems: 'center',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            borderBottomLeftRadius: wp('6%'),
            borderBottomRightRadius: wp('6%'),
        },
        headerIconContainer: {
            padding: wp('3%'),
            borderRadius: wp('6%'),
            marginBottom: hp('2%'),
        },
        headerTitle: {
            fontSize: wp('7%'),
            fontWeight: '700',
            marginBottom: hp('1%'),
            textAlign: 'center',
        },
        headerSubtitle: {
            fontSize: wp('3.8%'),
            textAlign: 'center',
            lineHeight: wp('5.5%'),
            paddingHorizontal: wp('4%'),
        },
        content: {
            flex: 1,
            paddingHorizontal: wp('5%'),
            paddingTop: hp('3%'),
        },
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: hp('2.5%'),
            paddingHorizontal: wp('2%'),
        },
        sectionTitle: {
            fontSize: wp('4.5%'),
            fontWeight: '600',
            marginLeft: wp('2%'),
        },
        languageContainer: {
            marginBottom: hp('4%'),
        },
        languageCardWrapper: {
            marginBottom: hp('2%'),
        },
        languageCard: {
            borderRadius: wp('4%'),
            padding: wp('4%'),
            flexDirection: 'row',
            alignItems: 'center',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.08,
            shadowRadius: 2.22,
            borderWidth: 1,
            position: 'relative',
        },
        selectedCard: {
            elevation: 4,
            shadowOpacity: 0.15,
        },
        languageIcon: {
            width: wp('12%'),
            height: wp('12%'),
            borderRadius: wp('6%'),
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: wp('4%'),
        },
        selectedIcon: {
        },
        languageIconText: {
            fontSize: wp('6%'),
            fontWeight: '600',
        },
        selectedIconText: {
        },
        languageInfo: {
            flex: 1,
            marginRight: wp('3%'),
        },
        languageNativeName: {
            fontSize: wp('5%'),
            fontWeight: '600',
            marginBottom: hp('0.5%'),
        },
        selectedLanguageName: {
        },
        languageEnglishName: {
            fontSize: wp('3.5%'),
            fontWeight: '400',
        },
        selectedLanguageSubtext: {
            color: colors.textSecondary,
        },
        selectionContainer: {
            marginRight: wp('2%'),
        },
        radioButton: {
            width: wp('6%'),
            height: wp('6%'),
            borderRadius: wp('3%'),
            borderWidth: 2,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.cardBackground,
        },
        radioButtonSelected: {
        },
        radioButtonInner: {
            width: wp('3%'),
            height: wp('3%'),
            borderRadius: wp('1.5%'),
            backgroundColor: colors.brandSecondary,
        },
        selectedBadge: {
            position: 'absolute',
            top: wp('2%'),
            right: wp('2%'),
            borderRadius: wp('3%'),
            width: wp('6%'),
            height: wp('6%'),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.brandSecondary,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
        },
        buttonContainer: {
            paddingBottom: hp('4%'),
            paddingHorizontal: wp('2%'),
        },
        saveButton: {
            borderRadius: wp('3%'),
            paddingVertical: hp('2%'),
            paddingHorizontal: wp('6%'),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.15,
            shadowRadius: 3.84,
        },
        saveButtonIcon: {
            marginRight: wp('2%'),
        },
        saveButtonText: {
            fontSize: wp('4.2%'),
            fontWeight: '600',
            color: '#fff',
        },
    });
    const changeLang = (lang) => {
        i18next.changeLanguage(lang);
    }

    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    let language = await retrieveData('userLanguageSaved', 'string');
                    if (language) {
                        setSelectedLanguage(language);
                    }
                } catch (error) {
                    console.error('Error retrieving user language:', error);
                }
            };

            fetchData();

            return () => {
                console.log('Screen blurred');
            };
        }, [])
    );

    const handleLanguageSelect = (langCode) => {
        setSelectedLanguage(langCode);
        // Add subtle animation feedback
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleSavePreferences = async () => {
        if (selectedLanguage) {
            try {
                await saveData('userLanguageSaved', selectedLanguage);
                changeLang(selectedLanguage);
                navigation.navigate('IndexScreen');
            } catch (error) {
                console.error("Error saving language preference");
            }
        } else {
            console.error("Please select a language to continue");
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.screenBackground }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.headerThemeBg} />

            {/* Modern Header */}
            <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.headerIconContainer}>
                    <MaterialCommunityIcons
                        name="translate"
                        size={wp('8%')}
                        color={colors.brandSecondary}
                    />
                </View>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Choose Language</Text>
                <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                    Select your preferred language for reading news
                </Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons
                        name="earth"
                        size={wp('5%')}
                        color={colors.textSecondary}
                    />
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Available Languages</Text>
                </View>

                {/* Language Cards */}
                <View style={styles.languageContainer}>
                    {languageList.map((lang, index) => (
                        <Animated.View
                            key={index}
                            style={[styles.languageCardWrapper, { transform: [{ scale: scaleAnim }] }]}
                        >
                            <TouchableOpacity
                                onPress={() => handleLanguageSelect(lang.code)}
                                activeOpacity={0.7}
                                style={[
                                    styles.languageCard,
                                    { backgroundColor: colors.cardBackground, borderColor: colors.borderLight },
                                    selectedLanguage === lang.code && { borderColor: colors.brandSecondary, borderWidth: 2 }
                                ]}
                            >
                                {/* Language Icon/Letter */}
                                <View style={[
                                    styles.languageIcon,
                                    { backgroundColor: colors.backgroundColor },
                                    selectedLanguage === lang.code && { backgroundColor: colors.brandSecondary }
                                ]}>
                                    <Text style={[
                                        styles.languageIconText,
                                        { color: colors.textPrimary },
                                        selectedLanguage === lang.code && { color: '#fff' }
                                    ]}>
                                        {lang.letter}
                                    </Text>
                                </View>

                                {/* Language Info */}
                                <View style={styles.languageInfo}>
                                    <Text style={[
                                        styles.languageNativeName,
                                        { color: colors.textPrimary },
                                        selectedLanguage === lang.code && { color: colors.brandSecondary }
                                    ]}>
                                        {lang.nativeName}
                                    </Text>
                                    <Text style={[
                                        styles.languageEnglishName,
                                        { color: colors.textSecondary },
                                        selectedLanguage === lang.code && { color: colors.brandSecondary }
                                    ]}>
                                        {lang.name}
                                    </Text>
                                </View>

                                {/* Selection Indicator */}
                                <View style={styles.selectionContainer}>
                                    <View style={[
                                        styles.radioButton,
                                        { borderColor: colors.borderColor },
                                        selectedLanguage === lang.code && { borderColor: colors.brandSecondary }
                                    ]}>
                                        {selectedLanguage === lang.code && (
                                            <View style={[styles.radioButtonInner, { backgroundColor: colors.brandSecondary }]} />
                                        )}
                                    </View>
                                </View>

                                {/* Selected Badge */}
                                {selectedLanguage === lang.code && (
                                    <View style={[styles.selectedBadge, { backgroundColor: colors.brandSecondary }]}>
                                        <MaterialCommunityIcons
                                            name="check"
                                            size={wp('4%')}
                                            color="white"
                                        />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                {/* Save Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: colors.brandSecondary }]}
                        onPress={handleSavePreferences}
                        activeOpacity={0.8}
                    >
                        <MaterialCommunityIcons
                            name="content-save"
                            size={wp('5%')}
                            color="white"
                            style={styles.saveButtonIcon}
                        />
                        <Text style={styles.saveButtonText}>Save Preferences</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};




export default LanguageSelectionScreen;
