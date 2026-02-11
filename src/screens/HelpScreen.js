import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Image,
    ScrollView,
    StatusBar,
    Platform,
    Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import te from './../assets/branding/te.png'
import en from './../assets/branding/en.png'
import { useTranslation } from 'react-i18next';
import { post } from '../handelers/APIHandeler';
import EndPointConfig from '../handelers/EndPointConfig';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const HelpScreen = () => {
    const { colors, isDark } = useTheme();
    const { t } = useTranslation()
    const navigation = useNavigation()
    const [teamInfo, setTeamInfo] = useState([])

    const handleWhatsAppMessage = () => {
        Linking.openURL('https://wa.me/+916362923654');
    };

    const handleEmail = () => {
        Linking.openURL('mailto:netichatithra@gmail.com');
    };

    const handleWebsite = () => {
        Linking.openURL('https://neticharithra.com/');
    };

    useFocusEffect(
        React.useCallback(() => {
            getTeamInfo()
            return () => {
                console.log('Screen unfocused');
            };
        }, [])
    );

    const getTeamInfo = () => {
        try {
            post(EndPointConfig.getHelpTeam, {})
                .then(function (response) {
                    if (response?.status === 'success') {
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
        <View style={[styles.container, { backgroundColor: colors.screenBackground }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.screenBackground} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.headerThemeBg, borderBottomColor: colors.borderLight }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Help & Support</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* App Logo Section */}
                <View style={[styles.logoSection, { backgroundColor: colors.cardBackground }]}>
                    <View style={[styles.logoContainer, { backgroundColor: colors.backgroundColor }]}>
                        <Image source={t('languageCode') === 'te' ? te : en} style={styles.logo} />
                    </View>
                    <Text style={[styles.appTitle, { color: colors.textPrimary }]}>Neti Charithra</Text>
                    <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>Your trusted news source</Text>
                </View>

                {/* Contact Information */}
                <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
                    <View style={[styles.sectionHeader, { borderBottomColor: colors.borderLight }]}>
                        <Ionicons name="call-outline" size={18} color={colors.brandSecondary} />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Contact Information</Text>
                    </View>

                    <View style={styles.contactCard}>
                        <TouchableOpacity
                            style={styles.contactItem}
                            onPress={() => Linking.openURL('tel:+916362923654')}
                        >
                            <View style={[styles.contactIcon, { backgroundColor: colors.backgroundColor }]}>
                                <Ionicons name="call" size={16} color={colors.brandSecondary} />
                            </View>
                            <View style={styles.contactDetails}>
                                <Text style={[styles.contactLabel, { color: colors.textSecondary }]}>Phone</Text>
                                <Text style={[styles.contactValue, { color: colors.textPrimary }]}>+91 6362923654</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color={colors.borderColor} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.contactItem}
                            onPress={handleEmail}
                        >
                            <View style={[styles.contactIcon, { backgroundColor: colors.backgroundColor }]}>
                                <Ionicons name="mail" size={16} color={colors.brandSecondary} />
                            </View>
                            <View style={styles.contactDetails}>
                                <Text style={[styles.contactLabel, { color: colors.textSecondary }]}>Email</Text>
                                <Text style={[styles.contactValue, { color: colors.textPrimary }]}>netichatithra@gmail.com</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color={colors.borderColor} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.contactItem}
                            onPress={handleWebsite}
                        >
                            <View style={[styles.contactIcon, { backgroundColor: colors.backgroundColor }]}>
                                <Ionicons name="globe" size={16} color={colors.brandSecondary} />
                            </View>
                            <View style={styles.contactDetails}>
                                <Text style={[styles.contactLabel, { color: colors.textSecondary }]}>Website</Text>
                                <Text style={[styles.contactValue, { color: colors.textPrimary }]}>neticharithra.com</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color={colors.borderColor} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Team Section */}
                {teamInfo.length > 0 && (
                    <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
                        <View style={[styles.sectionHeader, { borderBottomColor: colors.borderLight }]}>
                            <Ionicons name="people-outline" size={18} color={colors.brandSecondary} />
                            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Our Team</Text>
                        </View>

                        <View style={styles.teamGrid}>
                            {teamInfo.map((item, index) => (
                                <View key={index} style={styles.teamCard}>
                                    <Image
                                        source={{ uri: item?.tempURLProfile || 'https://via.placeholder.com/80' }}
                                        style={styles.teamImage}
                                    />
                                    <Text style={[styles.teamName, { color: colors.textPrimary }]}>{item.name}</Text>
                                    <Text style={[styles.teamRole, { color: colors.textSecondary }]}>{item.role}</Text>
                                    <TouchableOpacity
                                        onPress={() => Linking.openURL(`mailto:${item.email}`)}
                                        style={styles.emailButton}
                                    >
                                        <Ionicons name="mail-outline" size={12} color={colors.brandSecondary} />
                                        <Text style={[styles.emailText, { color: colors.brandSecondary }]}>Contact</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Quick Actions */}
                <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
                    <View style={[styles.sectionHeader, { borderBottomColor: colors.borderLight }]}>
                        <Ionicons name="flash-outline" size={18} color={colors.brandSecondary} />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Quick Actions</Text>
                    </View>

                    <View style={styles.actionsGrid}>
                        <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.backgroundColor }]} onPress={handleWhatsAppMessage}>
                            <View style={[styles.actionIcon, { backgroundColor: colors.cardBackground }]}>
                                <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                            </View>
                            <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>WhatsApp</Text>
                            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>Message us</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.backgroundColor }]} onPress={handleEmail}>
                            <View style={[styles.actionIcon, { backgroundColor: colors.cardBackground }]}>
                                <Ionicons name="mail-outline" size={20} color={colors.brandSecondary} />
                            </View>
                            <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>Email</Text>
                            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>Send email</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.backgroundColor }]} onPress={handleWebsite}>
                            <View style={[styles.actionIcon, { backgroundColor: colors.cardBackground }]}>
                                <Ionicons name="globe-outline" size={20} color={colors.brandSecondary} />
                            </View>
                            <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>Website</Text>
                            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>Visit site</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Disclaimer */}
                <View style={[styles.disclaimerCard, { backgroundColor: colors.cardBackground, borderLeftColor: colors.success }]}>
                    <View style={styles.disclaimerHeader}>
                        <Ionicons name="information-circle-outline" size={18} color={colors.success} />
                        <Text style={[styles.disclaimerTitle, { color: colors.success }]}>Free News Publishing</Text>
                    </View>
                    <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
                        We do not charge for publishing news articles. Contact us via email, WhatsApp, or visit our website to publish your news for free.
                    </Text>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
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
        paddingVertical: 24,
        marginBottom: 12,
    },
    logoContainer: {
        width: 70,
        height: 70,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 3,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    logo: {
        width: 55,
        height: 35,
        resizeMode: 'contain',
    },
    appTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    appSubtitle: {
        fontSize: 13,
        fontWeight: '500',
    },
    section: {
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 8,
        letterSpacing: -0.1,
    },
    contactCard: {
        paddingVertical: 4,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    contactIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contactDetails: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 11,
        fontWeight: '500',
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 13,
        fontWeight: '600',
    },
    teamGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 12,
        justifyContent: 'space-between',
    },
    teamCard: {
        width: '48%',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 12,
    },
    teamImage: {
        width: 55,
        height: 55,
        borderRadius: 28,
        marginBottom: 8,
        backgroundColor: '#f0f0f0',
    },
    teamName: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 2,
    },
    teamRole: {
        fontSize: 11,
        textAlign: 'center',
        marginBottom: 6,
    },
    emailButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 3,
    },
    emailText: {
        fontSize: 11,
        fontWeight: '600',
        marginLeft: 3,
    },
    actionsGrid: {
        flexDirection: 'row',
        padding: 12,
        justifyContent: 'space-between',
    },
    actionCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        marginHorizontal: 3,
        borderRadius: 8,
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    actionTitle: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 2,
    },
    actionSubtitle: {
        fontSize: 9,
        textAlign: 'center',
    },
    disclaimerCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 12,
        borderRadius: 12,
        borderLeftWidth: 3,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    disclaimerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    disclaimerTitle: {
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 6,
    },
    disclaimerText: {
        fontSize: 12,
        lineHeight: 17,
    },
});

export default HelpScreen;
