import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, Animated } from 'react-native';
import { Button } from 'react-native-paper';
import { scaleFont } from '../handelers/ReusableHandeler';
import { useTranslation } from 'react-i18next';
import i18next from './../../services/i18next';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { retrieveData, saveData } from '../handelers/AsyncStorageHandeler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ToasterService from '../components/ToasterService';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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

    const { t } = useTranslation();

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
                ToasterService.showError("Error saving language preference");
            }
        } else {
            ToasterService.showError("Please select a language to continue");
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            
            {/* Modern Header */}
            <View style={styles.header}>
                <View style={styles.headerIconContainer}>
                    <MaterialCommunityIcons 
                        name="translate" 
                        size={wp('8%')} 
                        color="#007bff" 
                    />
                </View>
                <Text style={styles.headerTitle}>Choose Language</Text>
                <Text style={styles.headerSubtitle}>
                    Select your preferred language for reading news
                </Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons 
                        name="earth" 
                        size={wp('5%')} 
                        color="#6c757d" 
                    />
                    <Text style={styles.sectionTitle}>Available Languages</Text>
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
                                    selectedLanguage === lang.code && styles.selectedCard
                                ]}
                            >
                                {/* Language Icon/Letter */}
                                <View style={[
                                    styles.languageIcon,
                                    selectedLanguage === lang.code && styles.selectedIcon
                                ]}>
                                    <Text style={[
                                        styles.languageIconText,
                                        selectedLanguage === lang.code && styles.selectedIconText
                                    ]}>
                                        {lang.letter}
                                    </Text>
                                </View>

                                {/* Language Info */}
                                <View style={styles.languageInfo}>
                                    <Text style={[
                                        styles.languageNativeName,
                                        selectedLanguage === lang.code && styles.selectedLanguageName
                                    ]}>
                                        {lang.nativeName}
                                    </Text>
                                    <Text style={[
                                        styles.languageEnglishName,
                                        selectedLanguage === lang.code && styles.selectedLanguageSubtext
                                    ]}>
                                        {lang.name}
                                    </Text>
                                </View>

                                {/* Selection Indicator */}
                                <View style={styles.selectionContainer}>
                                    <View style={[
                                        styles.radioButton,
                                        selectedLanguage === lang.code && styles.radioButtonSelected
                                    ]}>
                                        {selectedLanguage === lang.code && (
                                            <View style={styles.radioButtonInner} />
                                        )}
                                    </View>
                                </View>

                                {/* Selected Badge */}
                                {selectedLanguage === lang.code && (
                                    <View style={styles.selectedBadge}>
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
                        style={styles.saveButton} 
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


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: 'white',
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
        backgroundColor: '#e3f2fd',
        padding: wp('3%'),
        borderRadius: wp('6%'),
        marginBottom: hp('2%'),
    },
    headerTitle: {
        fontSize: wp('7%'),
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: hp('1%'),
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: wp('3.8%'),
        color: '#6c757d',
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
        color: '#495057',
        marginLeft: wp('2%'),
    },
    languageContainer: {
        marginBottom: hp('4%'),
    },
    languageCardWrapper: {
        marginBottom: hp('2%'),
    },
    languageCard: {
        backgroundColor: 'white',
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
        borderColor: '#e9ecef',
        position: 'relative',
    },
    selectedCard: {
        backgroundColor: '#007bff',
        borderColor: '#0056b3',
        elevation: 4,
        shadowOpacity: 0.15,
    },
    languageIcon: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%'),
        backgroundColor: '#e3f2fd',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('4%'),
    },
    selectedIcon: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    languageIconText: {
        fontSize: wp('6%'),
        fontWeight: '600',
        color: '#007bff',
    },
    selectedIconText: {
        color: '#007bff',
    },
    languageInfo: {
        flex: 1,
        marginRight: wp('3%'),
    },
    languageNativeName: {
        fontSize: wp('5%'),
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: hp('0.5%'),
    },
    selectedLanguageName: {
        color: 'white',
    },
    languageEnglishName: {
        fontSize: wp('3.5%'),
        color: '#6c757d',
        fontWeight: '400',
    },
    selectedLanguageSubtext: {
        color: 'rgba(255, 255, 255, 0.8)',
    },
    selectionContainer: {
        marginRight: wp('2%'),
    },
    radioButton: {
        width: wp('5%'),
        height: wp('5%'),
        borderRadius: wp('2.5%'),
        borderWidth: 2,
        borderColor: '#dee2e6',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    radioButtonSelected: {
        borderColor: 'white',
        backgroundColor: 'white',
    },
    radioButtonInner: {
        width: wp('2.5%'),
        height: wp('2.5%'),
        borderRadius: wp('1.25%'),
        backgroundColor: '#007bff',
    },
    selectedBadge: {
        position: 'absolute',
        top: -wp('1%'),
        right: -wp('1%'),
        backgroundColor: '#28a745',
        borderRadius: wp('3%'),
        width: wp('6%'),
        height: wp('6%'),
        justifyContent: 'center',
        alignItems: 'center',
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
        backgroundColor: '#007bff',
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
        color: 'white',
        fontSize: wp('4.2%'),
        fontWeight: '600',
    },
});

export default LanguageSelectionScreen;
