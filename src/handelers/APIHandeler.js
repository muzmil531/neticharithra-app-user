// api.js

import axios from 'axios';

import { Alert, Linking, Platform, PermissionsAndroid } from 'react-native';
import { retrieveData } from './AsyncStorageHandeler';

// export const BASE_URL = 'http://192.168.10.219:3000/api/v2/';
export const BASE_URL = 'http://192.168.11.238:3000/api/v2/';
// export const BASE_URL = 'https://viridian-slug-sari.cyclic.app/api/v2/';

// const api={};
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000, // Adjust the timeout as needed
    headers: {
        'Content-Type': 'application/json',
    },
});

const handleError = (error) => {
    // Handle errors here (e.g., logging, showing a message to the user)
    console.error("error");
    console.error(error);
    if (error.response) {
        // The request was made and the server responded with a status code
    } else if (error.request) {
        // The request was made but no response was received
        console.log('Request:', error.request);
    } else {
        // Something happened in setting up the request that triggered an error
        console.log('Error:', error.message);
    }
    // ToastService.showError(error.toString());
    return null
    // throw error; // Rethrow the error to propagate it to the caller
};

export const get = async (endpoint, params = {}) => {
    try {
        const response = await api.get(endpoint, { params });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};



export const post = async (endpoint, data = {}) => {
    try {

        let dataLang = await retrieveData('userLanguageSaved', 'string');
        // console.log(dataLang)
        let requestPayLoad = { ...data, language: dataLang || 'en' };





        // console.log(endpoint + ' Request Payload : ', JSON.stringify(requestPayLoad, null, 4));

        const response = await api.post(endpoint, requestPayLoad);

        // console.log(endpoint + ' Response : ', JSON.stringify(response.data, null, 4));
        // return response
        if (([200].indexOf(response?.status) > -1)) {
            return response?.data ? response.data : null;
        }

    } catch (error) {

        // console.log(' Error : ', JSON.stringify(error, null, 4));


        // ToastService.showError('Something went wrong..! Try after some time..!'); // Use the reusable ToastService
        handleError(error);
        Alert.alert(error?.toString())
        return null;

    }
};
