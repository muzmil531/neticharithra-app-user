import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from '../locales/en.json';
import te from '../locales/te.json';


export const languageResources={
    en:{translation:en},
    te:{translation:te}
}


const initializeI18next = async () => {
    // const lng = await retrieveData('userLanguageSaved', 'string') || 'en'; // Fetch language code from async storage handler

    i18next
        .use(initReactI18next) // Use the react-i18next module
        .init({
            compatibilityJSON: "v3",
            lng: "en",
            fallbackLng: "en", // Set fallback language to the same as selected language
            resources: languageResources
        });
};

initializeI18next(); 

export default i18next;
