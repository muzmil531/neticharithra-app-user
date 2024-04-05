import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar, Avatar, Card, Checkbox } from 'react-native-paper';
import { scaleFont } from '../handelers/ReusableHandeler';

const LanguageSelectionScreen = ({ navigation }) => {
    const [selectedLanguage, setSelectedLanguage] = useState(null);


    const languageList = [
        {
            "image": require('./../assets/languageImages/telugu.jpg'),
            "english": "Telugu",
            "regional": "తెలుగు",
            "color": "red"
        }
    ]

    const CustomHeader = ({ title, subtitle }) => (
        <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Choose your preferred <Text style={{ fontWeight: 'bold' }}>language</Text> to read the <Text style={{ fontWeight: 'bold' }}>News</Text></Text>
        </View>
    );

    return (
        <>
            <View style={styles.container}>
                <Appbar.Header style={styles.header}>
                    <CustomHeader />
                </Appbar.Header>
                <View style={styles.content}>
                    {languageList?.map(lang => {
                        return (
                            <Card style={[styles.card, { borderBottomColor: 'red', borderBottomWidth: 2, height:'auto'}]} elevation={4}>
                                <Card.Content style={styles.cardContent}>
                                    <View style={styles.logo}>
                                        <Avatar.Image size={48} source={lang?.image} />
                                    </View>
                                    <View style={styles.textContainer}>
                                        <View style={styles.textRow}>
                                            <Text style={styles.text}>{lang?.regional}</Text>
                                            <Text style={styles.text}>{lang?.english}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.checkboxContainer}>
                                        <Checkbox status="unchecked" />
                                    </View>
                                </Card.Content>
                                <View style={styles.colorBar} />
                            </Card>
                        )
                    })

                    }
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 'auto',
        elevation: 3, // remove shadow on Android
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
        marginTop: 10, // adjust based on the header height
        padding: 10,
    },
    card: {
        marginBottom: 10,
        backgroundColor: 'white'
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
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
    text: {
        marginBottom: 5,
        marginRight: 5,
    },
    checkboxContainer: {
        marginRight: 10,
    },

});

export default LanguageSelectionScreen;
