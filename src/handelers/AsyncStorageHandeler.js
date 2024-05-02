// storage.js

import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data
export const saveData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
        return "Successfully Saved"
        // 
    } catch (error) {
        console.error('Error saving data:', error);
    }
};
export const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        // 
    } catch (error) {
        console.error('Error saving data:', error);
    }
};

// Retrieve data
export const retrieveData = async (key, type='') => {
    try {
        const value = await AsyncStorage.getItem(key);
        //
        if (value !== null && type !== 'string') {
            return JSON.parse(value);
        } else if(value && type === 'string') {
            //
            return value;
        } else {
            return null
        }
    } catch (error) {
        console.error('Error retrieving data:', error);
        return null;
    }
};

export const clearAllData = async ()=>{
    try{
        await AsyncStorage.clear();
        return null;
    }
    catch(error){
        console.error('Error retrieving data:', error);
        return null;
    }
}
export const removeAllItems = async () => {
    try {
        // Get all keys in AsyncStorage
        const keys = await AsyncStorage.getAllKeys();

        // Use Promise.all() to delete all items asynchronously
        await Promise.all(keys.map(async key => await AsyncStorage.removeItem(key)));

        
    } catch (error) {
        console.error('Error removing items from AsyncStorage:', error);
    }
};