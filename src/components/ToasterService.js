// ToastService.js

import Toast from 'react-native-toast-message';

const showToast = (type, text, text2) => {

    
    Toast.show({
        type: type,
        // position: 'bottom',
        text1: text,
        text2:text2,
        visibilityTime: 3000,
        // customComponent: <CustomToast message="Hello, Custom Toast!" />,

    });





};



export default {
    showSuccess: (text) => {showToast('success', text)},
    showError: (text, text2) => showToast('error', text || "Something went wrong.. Try after sometime...", text2 || null),
};