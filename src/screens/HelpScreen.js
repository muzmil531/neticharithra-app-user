// HelpScreen.js

import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Linking, 
    Image, 
    FlatList,
    ScrollView,
    StatusBar,
    Platform,
    SafeAreaView
} from 'react-native';
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
        Linking.openURL('https://neticharithra.com/');
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
                    console.log("response", response)
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
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={styles.headerSpacer} />
            </View>
            
            <ScrollView 
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* App Logo Section */}
                <View style={styles.logoSection}>
                    <View style={styles.logoContainer}>
                        <Image source={t('languageCode') === 'te' ? te : en} style={styles.logo} />
                    </View>
                    <Text style={styles.appTitle}>Neti Charithra</Text>
                    <Text style={styles.appSubtitle}>Your trusted news source</Text>
                </View>

                {/* Contact Information */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="call-outline" size={20} color="#007bff" />
                        <Text style={styles.sectionTitle}>Contact Information</Text>
                    </View>
                    
                    <View style={styles.contactCard}>
                        <TouchableOpacity 
                            style={styles.contactItem}
                            onPress={() => Linking.openURL('tel:+916362923654')}
                        >
                            <View style={styles.contactIcon}>
                                <Ionicons name="call" size={18} color="#007bff" />
                            </View>
                            <View style={styles.contactDetails}>
                                <Text style={styles.contactLabel}>Phone</Text>
                                <Text style={styles.contactValue}>+91 6362923654</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#ccc" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.contactItem}
                            onPress={handleEmail}
                        >
                            <View style={styles.contactIcon}>
                                <Ionicons name="mail" size={18} color="#007bff" />
                            </View>
                            <View style={styles.contactDetails}>
                                <Text style={styles.contactLabel}>Email</Text>
                                <Text style={styles.contactValue}>netichatithra@gmail.com</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#ccc" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.contactItem}
                            onPress={handleWebsite}
                        >
                            <View style={styles.contactIcon}>
                                <Ionicons name="globe" size={18} color="#007bff" />
                            </View>
                            <View style={styles.contactDetails}>
                                <Text style={styles.contactLabel}>Website</Text>
                                <Text style={styles.contactValue}>neticharithra.com</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#ccc" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Team Section */}
                {teamInfo.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="people-outline" size={20} color="#007bff" />
                            <Text style={styles.sectionTitle}>Our Team</Text>
                        </View>
                        
                        <View style={styles.teamGrid}>
                            {teamInfo.map((item, index) => (
                                <View key={index} style={styles.teamCard}>
                                    <Image 
                                        source={{ uri: item?.tempURLProfile || 'https://via.placeholder.com/80' }} 
                                        style={styles.teamImage} 
                                    />
                                    <Text style={styles.teamName}>{item.name}</Text>
                                    <Text style={styles.teamRole}>{item.role}</Text>
                                    <TouchableOpacity 
                                        onPress={() => Linking.openURL(`mailto:${item.email}`)}
                                        style={styles.emailButton}
                                    >
                                        <Ionicons name="mail-outline" size={14} color="#007bff" />
                                        <Text style={styles.emailText}>Contact</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Quick Actions */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="flash-outline" size={20} color="#007bff" />
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                    </View>
                    
                    <View style={styles.actionsGrid}>
                        <TouchableOpacity style={styles.actionCard} onPress={handleWhatsAppMessage}>
                            <View style={styles.actionIcon}>
                                <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                            </View>
                            <Text style={styles.actionTitle}>WhatsApp</Text>
                            <Text style={styles.actionSubtitle}>Message us directly</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.actionCard} onPress={handleEmail}>
                            <View style={styles.actionIcon}>
                                <Ionicons name="mail-outline" size={24} color="#007bff" />
                            </View>
                            <Text style={styles.actionTitle}>Email</Text>
                            <Text style={styles.actionSubtitle}>Send us an email</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.actionCard} onPress={handleWebsite}>
                            <View style={styles.actionIcon}>
                                <Ionicons name="globe-outline" size={24} color="#007bff" />
                            </View>
                            <Text style={styles.actionTitle}>Website</Text>
                            <Text style={styles.actionSubtitle}>Visit our site</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Disclaimer */}
                <View style={styles.disclaimerCard}>
                    <View style={styles.disclaimerHeader}>
                        <Ionicons name="information-circle-outline" size={20} color="#28a745" />
                        <Text style={styles.disclaimerTitle}>Free News Publishing</Text>
                    </View>
                    <Text style={styles.disclaimerText}>
                        We do not charge for publishing news articles. Contact us via email, WhatsApp, or visit our website to publish your news for free.
                    </Text>
                </View>
                
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        letterSpacing: -0.2,
    },
    headerSpacer: {
        width: 40,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    logoSection: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    logo: {
        width: 60,
        height: 40,
        resizeMode: 'contain',
    },
    appTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    appSubtitle: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    section: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.05,
                shadowRadius: 3,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
        marginLeft: 8,
        letterSpacing: -0.1,
    },
    contactCard: {
        paddingVertical: 8,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    contactIcon: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contactDetails: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 14,
        color: '#1a1a1a',
        fontWeight: '600',
    },
    teamGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        justifyContent: 'space-between',
    },
    teamCard: {
        width: '48%',
        alignItems: 'center',
        paddingVertical: 16,
        marginBottom: 16,
    },
    teamImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 8,
        backgroundColor: '#f0f0f0',
    },
    teamName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 2,
    },
    teamRole: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginBottom: 8,
    },
    emailButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    emailText: {
        fontSize: 12,
        color: '#007bff',
        fontWeight: '600',
        marginLeft: 4,
    },
    actionsGrid: {
        flexDirection: 'row',
        padding: 16,
        justifyContent: 'space-between',
    },
    actionCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
        marginHorizontal: 4,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    actionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 2,
    },
    actionSubtitle: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
    },
    disclaimerCard: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#28a745',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.05,
                shadowRadius: 3,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    disclaimerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    disclaimerTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#28a745',
        marginLeft: 8,
    },
    disclaimerText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
});

export default HelpScreen;
