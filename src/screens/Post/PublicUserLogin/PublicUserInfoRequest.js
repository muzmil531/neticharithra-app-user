import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;

const PublicUserInfoRequest = ({ handleSaveTrigger }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = () => {
    // Check if name is provided
    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }

    // Trigger the save action
    handleSaveTrigger({ name, email });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email (optional)"
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PublicUserInfoRequest;


const styles = StyleSheet.create({
  container: {
    marginTop:20
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    width:screenWidth-100,
    borderColor: '#ccc',   

    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 25,
    width:screenWidth-150,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
