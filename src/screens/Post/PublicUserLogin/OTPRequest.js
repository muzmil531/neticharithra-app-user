import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import OTPValidate from './OTPValidate';
import ToasterService from '../../../components/ToasterService';
import { useTranslation } from 'react-i18next';
import { post } from '../../../handelers/APIHandeler';
import EndPointConfig from '../../../handelers/EndPointConfig';
import PublicUserInfoRequest from './PublicUserInfoRequest';
import { saveData } from '../../../handelers/AsyncStorageHandeler';
import { useNavigation } from '@react-navigation/native';

const OTPRequest = (props) => {
    const [countryCode, setCountryCode] = useState('+91');
    const [phoneNumber, setPhoneNumber] = useState('');
    const { t } = useTranslation();
    const [showSections, setShowSections] = useState({
        otpField: false,
        userDetails: false
    });
    const navigation = useNavigation();


    const handleRequestOTP = () => {
        // Here you can implement logic to request OTP using the countryCode and phoneNumber states
        if (!checkPhoneNumber(phoneNumber)) {
            ToasterService.showError(t('postScreen.validMobileNumberError1'), t('postScreen.validMobileNumberError2'))
            // Alert.alert(t('postScreen.validMobileNumberError'))
            return;
        }
        console.log('Requesting OTP for:', countryCode, phoneNumber);

        requestForOTP({ countryCode: countryCode, phoneNumber: parseInt(phoneNumber) })
    };

    const requestForOTP = (payload) => {
        try {
            // setShowSections(prev => {
            //     return { ...prev, otpField: true }
            // })
            post(EndPointConfig.requestPublicOTP, payload)
                .then(function (response) {
                    if (response?.status === 'success') {
                        ToasterService.showSuccess(response.message || '')
                        setShowSections(prev => {
                            return { ...prev, otpField: true }
                        })
                        console.log(response?.data);
                    } else {
                        ToasterService.showError(response.message || t('someThingWentWrong'))
                    }
                })
                .catch(function (error) {
                    console.error(error);
                });

        } catch (error) {
            console.error(error);
        }
    };

    function checkPhoneNumber(phoneNumber) {
        const pattern = /^\d{10}$/;
        return pattern.test(phoneNumber);
    }

    const validateOTPTriger = (event) => {
        console.log("R", event)
        try {
            // setShowSections(prev => {
            //     return { ...prev, userDetails: true }
            // })
            post(EndPointConfig.validateUserOTP, { mobileNumber: phoneNumber, otp: event })
                .then(async function (response) {
                    if (response?.status === 'success') {
                        ToasterService.showSuccess(response.message || '')

                        if (response?.nameCode) {
                            setShowSections(prev => {
                                return { ...prev, userDetails: true }
                            })
                            console.log(response?.userData);
                        } else {
                            let data = await saveData('publicUserInfo', JSON.stringify(response?.userData || {}));

                            moveToPublicSummary();
                        }
                    } else {
                        ToasterService.showError(response.message || t('someThingWentWrong'))
                    }
                })
                .catch(function (error) {
                    console.error(error);
                });

        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveTrigger = (event) => {
        console.log("R", event)
        try {
            // setTimeout(() => {
            //     navigation.navigate('PostIndex/PublicUserSummary')
            // }, 500);
            post(EndPointConfig.addPublicUser, { mobileNumber: phoneNumber, ...event })
                .then(function (response) {
                    if (response?.status === 'success' && response?.data) {
                        saveData('publicUserInfo', JSON.stringify(response?.data || {}));
                        ToasterService.showSuccess(response.message || 'USER CREATED');
                        setTimeout(() => {
                            moveToPublicSummary();
                        }, 500);
                        console.log("USER CREATED")
                    } else {
                        ToasterService.showError(response.message || t('someThingWentWrong'))
                    }
                })
                .catch(function (error) {
                    console.error(error);
                });

        } catch (error) {
            console.error(error);
        }
    };


    const moveToPublicSummary = () => {
        console.log("manualFinalStep", props.manualFinalStep)
        if (props?.manualFinalStep) {
            props?.manualFinalStep({ 'status': "success" })
        } else {

            navigation.navigate('PostIndex/PublicUserSummary')
        }
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
                {showSections?.userDetails ? 'Enter your Details' :
                    showSections?.otpField ? 'Enter OTP' : 'Enter Mobile Number'}
            </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, styles.countryCodeInput]}
                    value={countryCode}
                    editable={false}
                />
                <TextInput
                    style={[styles.input, styles.numberContainer]}
                    placeholder="Enter Mobile Number"
                    keyboardType="phone-pad"
                    onChangeText={text => setPhoneNumber(text)}
                    value={phoneNumber}
                />
            </View>
            {!showSections.otpField &&
                <TouchableOpacity style={styles.button} onPress={() => {
                    handleRequestOTP('requestOTP')

                }}>
                    <Text style={styles.buttonText}>Request OTP</Text>
                </TouchableOpacity>
            }
            {showSections.otpField &&
                <OTPValidate onValidateOTPTrigger={validateOTPTriger} hidebutton={!showSections.userDetails} />
            }
            {showSections.userDetails &&
                <PublicUserInfoRequest handleSaveTrigger={handleSaveTrigger} />
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        // flex: 1,
        height: 40,
        marginHorizontal: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    countryCodeInput: {
        width: 50, // Set a fixed width for the country code input
        backgroundColor: '#f0f0f0', // Change the background color of the country code input
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 60,
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    numberContainer: {
        flex: 0.6
    }
});

export default OTPRequest;
