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
    {
        "imageName": require('./../assets/languageImages/telugu.jpg'),
        "color": "#000B49",
        "name": "English",
        "nativeName": "English",
        "code": "en",
        "styles":{
            fontWeight:"bold", fontSize: scaleFont(30)
        }
    },
    {
        "imageName": require('./../assets/languageImages/telugu.jpg'),
        "color": "#FF6969",
        "name": "Telugu",
        "nativeName": "తెలుగు",
        "code": "te"
    }
];

const LanguageSelectionScreen = ({ }) => {
    const [selectedLanguage, setSelectedLanguage] = useState(null);

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
                    setSelectedLanguage(language);
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
            <Appbar.Header style={styles.header}>
                <CustomHeader />
            </Appbar.Header>
            <View style={styles.content}>
                {languageList.map((lang, index) => (
                    <TouchableOpacity key={index} onPress={() => setSelectedLanguage(lang.code)} activeOpacity={0.8}>
                        <Card style={[styles.card, { borderBottomColor: lang.color, borderBottomWidth: 2 }]} elevation={4}>
                            <Card.Content style={styles.cardContent}>
                                <View style={styles.logo}>
                                    {lang.imageName && <Avatar.Image size={48} source={lang.imageName} />}
                                </View>
                                <View style={styles.textContainer}>
                                    <View style={styles.textRow}>
                                        <Text style={[styles.nativeNameText, { color: lang.color }, lang.styles || {}]}>{lang.nativeName}</Text>
                                        <Text style={styles.nameText}>{lang.name}</Text>
                                    </View>
                                </View>
                                <View style={styles.checkboxContainer}>
                                    <Checkbox status={selectedLanguage === lang?.code ? "checked" : "unchecked"}

                                        onPress={() => {

                                            console.log(lang.code)
                                            // setSelectedLanguage(lang.code)
                                        }}

                                    />
                                </View>
                            </Card.Content>
                            <View style={styles.colorBar} />
                        </Card>
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
        flex: 1,
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
        fontSize: scaleFont(20)
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
});

export default LanguageSelectionScreen;
