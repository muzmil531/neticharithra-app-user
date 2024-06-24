import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import { Appbar, Avatar, Button, Card, Checkbox } from 'react-native-paper';
import { scaleFont } from '../handelers/ReusableHandeler';

import { useTranslation } from 'react-i18next';
import i18next from './../../services/i18next';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { retrieveData, saveData } from '../handelers/AsyncStorageHandeler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ToasterService from '../components/ToasterService';
export const languageList = [
    // {
    //     "imageName": require('./../assets/languageImages/telugu.jpg'),
    //     "color": "#000B49",
    //     "name": "English",
    //     "nativeName": "English",
    //     "code": "en",
    //     'letter': "A",
    //     "styles": {
    //         fontWeight: "bold", fontSize: scaleFont(30)
    //     }
    // },
    {
        "imageName": require('./../assets/languageImages/telugu.jpg'),
        "color": "#FF6969",
        "name": "Telugu",
        "nativeName": "తెలుగు",
        "code": "te",

        letter: "అ"
    }
];

const LanguageSelectionScreen = ({ }) => {
    const [selectedLanguage, setSelectedLanguage] = useState("te");

    const { t } = useTranslation();

    const changeLang = (lang) => {
        i18next.changeLanguage(lang);
    }

    const navigation = useNavigation()
    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    let language = await retrieveData('userLanguageSaved', 'string');
                    // setSelectedLanguage(language);
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
    const CustomHeader = ({ title, subtitle }) => (
        <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
                Choose your preferred <Text style={{ fontWeight: 'bold' }}>language</Text> to read the <Text style={{ fontWeight: 'bold' }}>News</Text>
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <CustomHeader />
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>All Languages</Text>
                {languageList.map((lang, index) => (
                    <TouchableOpacity key={index} onPress={() => setSelectedLanguage(lang.code)} activeOpacity={0.8}>

                        <View style={{ margin: 10, padding: 10, borderRadius: 50, backgroundColor: selectedLanguage === lang?.code ? '#3AA2DB' : '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ backgroundColor: selectedLanguage === lang?.code ? 'white' : '#3AA2DB', padding: 5, borderRadius: 50, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 20, color: selectedLanguage === lang?.code ? '#000' : '#fff' }}>{lang?.letter}</Text>
                                </View>
                                <View style={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 20, color: selectedLanguage === lang?.code ? '#fff' : '#000' }}>{lang?.nativeName}</Text>
                                </View>
                            </View>
                            <View style={{ marginRight: 10 }}>
                                <View style={{ width: 14, height: 14, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderColor: selectedLanguage === lang?.code ? 'white' : 'black', borderWidth: 1 }}>

                                    {
                                        selectedLanguage === lang?.code &&

                                        <View style={{ width: 8, height: 8, backgroundColor: 'white', borderRadius: 50 }}>

                                        </View>
                                    }
                                </View>
                            </View>
                        </View>

                    </TouchableOpacity>
                ))}
                <Button mode="contained" onPress={async () => {
                    console.log("HII", selectedLanguage)
                    if (selectedLanguage) {
                        let data = await saveData('userLanguageSaved', selectedLanguage);
                        changeLang(selectedLanguage)
                        console.log(data)
                        navigation.navigate('IndexScreen')
                    } else {
                        ToasterService.showError("Kindly select Langauge to Save")
                        // Alert.alert("Kindly select Langauge to Save")
                        return

                    }

                }

                } style={styles.saveButton}>
                    Save Preferences
                </Button>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        // height: 'auto',
        elevation: 3,
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    headerContent: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: scaleFont(14)
    },
    content: {
        flex: 1,
        marginTop: 10,
        padding: 10,
    },
    card: {
        marginBottom: 20,
        backgroundColor: 'white'
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    logo: {
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    textRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nativeNameText: {
        marginBottom: 5,
        marginRight: 10,
        fontSize: scaleFont(35)
    },
    nameText: {
        marginRight: 10,
        fontSize: scaleFont(20),
        fontWeight: 'bold'
    },
    checkboxContainer: {
        marginRight: 10,
    },
    saveButton: {
        marginTop: 20,
        backgroundColor: '#000B49', // or any color you prefer
    },
    title: {
        fontSize: scaleFont(14), fontWeight: 'bold'
    }
});

export default LanguageSelectionScreen;
