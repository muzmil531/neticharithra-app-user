import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Alert, Text } from 'react-native';
import ToasterService from '../../../components/ToasterService';

const OTPValidate = (props) => {
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const otpInputs = Array(6).fill(0).map((_, index) => useRef(null));

  const handleOTPChange = (text, index) => {
    const newOTP = [...otp];
    newOTP[index] = text;
    setOTP(newOTP);
    if (text !== '' && index < 5) {
      otpInputs[index + 1].current.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      otpInputs[index - 1].current.focus();
    }
  };

  const validateOTP = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      props.onValidateOTPTrigger(otpValue);
    } else {
        ToasterService.showError('Incomplete OTP', 'Please fill all 6 digits.');
    }
  };

  return (
    <View>
      <View style={styles.container}>
        {otp.map((value, index) => (
          <TextInput
            ref={otpInputs[index]}
            key={index}
            keyboardType="phone-pad"
            style={styles.input}
            maxLength={1}
            value={value}
            onChangeText={(text) => handleOTPChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            textAlign='center' // Added textAlign property
          />
        ))}
      </View>
      {props?.hidebutton && 
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={validateOTP}>
          <Text style={styles.buttonText}>Validate</Text>
        </TouchableOpacity>
      </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: 40,
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 10,
    margin: 5,
    textAlign: 'center',
    fontSize: 15,
    color: '#333',
    backgroundColor: '#F5F5F5',
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
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
});

export default OTPValidate;
