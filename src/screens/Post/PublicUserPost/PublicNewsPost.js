import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { retrieveData } from '../../../handelers/AsyncStorageHandeler';
import { useTranslation } from 'react-i18next';
import DFM from '../../../components/DFM';
import EndPointConfig from '../../../handelers/EndPointConfig';
import { post } from '../../../handelers/APIHandeler';
import ToasterService from '../../../components/ToasterService';

const PublicNewsPost = () => {
    const navigation = useNavigation()

    const [userInfo, setUserInfo] = useState();
    let [dfmFields, setDFMFeilds] = useState(

    );
    let [formValue, SetDFMValues] = useState({
        // "images":[{"ContentType": "image/jpeg", "fileName": "FileNew1713423066762_0", "tempURL": "https://neti-charithra-uploads.s3.ap-south-1.amazonaws.com/FileNew1713423066762_0?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAU6GDWITECAIXNR5M%2F20240418%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240418T065107Z&X-Amz-Expires=3600&X-Amz-Signature=d2a4f806f275dc2e921384ea6e50ddc7323ab34dd122ec57cc4ea27e599ff1cb&X-Amz-SignedHeaders=host&x-id=GetObject"},{"ContentType": "image/jpeg", "fileName": "FileNew1713423066762_0", "tempURL": "https://neti-charithra-uploads.s3.ap-south-1.amazonaws.com/FileNew1713423066762_0?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAU6GDWITECAIXNR5M%2F20240418%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240418T065107Z&X-Amz-Expires=3600&X-Amz-Signature=d2a4f806f275dc2e921384ea6e50ddc7323ab34dd122ec57cc4ea27e599ff1cb&X-Amz-SignedHeaders=host&x-id=GetObject"},{"ContentType": "image/jpeg", "fileName": "FileNew1713423066762_0", "tempURL": "https://neti-charithra-uploads.s3.ap-south-1.amazonaws.com/FileNew1713423066762_0?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAU6GDWITECAIXNR5M%2F20240418%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240418T065107Z&X-Amz-Expires=3600&X-Amz-Signature=d2a4f806f275dc2e921384ea6e50ddc7323ab34dd122ec57cc4ea27e599ff1cb&X-Amz-SignedHeaders=host&x-id=GetObject"}]
    });
    let [fieldOptions, setFieldOptions] = useState({});
    const { t } = useTranslation();



    getMetaData = (stateId) => {
        try {
            // 'AP_DISTRICTS', 'AP_DISTRICT_MANDALS'
            const metaList = stateId ? [stateId + '_DISTRICTS', stateId + '_DISTRICT_MANDALS_REGIONAL'] : ['STATES', 'NEWS_CATEGORIES_REGIONAL', 'NEWS_TYPE_REGIONAL']
            post(EndPointConfig.getMetaData, { metaList })
                .then(function (response) {
                    if (response?.status === 'success') {
                        // Initialize options object
                        let options = {};

                        // Check if stateId is not provided
                        if (!stateId) {
                            options.state = response?.data?.STATES || [];
                            options.newsType = response?.data?.NEWS_TYPE_REGIONAL || [];
                            options.category = response?.data?.NEWS_CATEGORIES_REGIONAL || [];

                        } else {
                            // If stateId is provided, set district and town options
                            options.district = response?.data[metaList[0]] || [];
                            options.mandal_all = response?.data[metaList[1]] || [];
                        }

                        console.log(options)
                        // Update fieldOptions state using the current state and new options
                        setFieldOptions(prev => ({
                            ...prev,
                            ...options
                        }));
                        // console.log("2responseresponse", response?.data?.metaList[0])
                    }
                    // setShowScreen(true);
                })


                .catch(function (error) {
                    console.error(error);
                    //   setRefreshing(false);
                    //   setLoader(false);
                });

        } catch (error) {
            console.error(error)
        }
    }
    useFocusEffect(
        React.useCallback(() => {
            const fetchInitialLoad = async () => {
                try {
                    let dd = await retrieveData('publicUserInfo');
                    setUserInfo(dd);

                    let dfm = t('postScreen.addNews', { returnObjects: true });

                    setDFMFeilds(dfm)
                    console.log(dfm)
                    getMetaData();

                } catch (error) {
                    console.error('Error fetching and changing language:', error);
                }
            };

            fetchInitialLoad();

            return () => {
                // Cleanup function (if needed)
            };
        }, []) // Dependency array includes i18n to re-trigger effect when i18n changes
    );

    const formSubmitHandeler = async (event, param2, param3) => {
        // console.log(event, param2, param3)
        if (event?.target?.name === 'state') {
            getMetaData(event?.target?.value?.value)
        } else if (event?.target?.name === 'district') {
            console.log("/n/n/n/n/n")
            console.log(fieldOptions.mandal_all)
            console.log(event?.target?.value?.value)
            setFieldOptions((prev) => {
                return {
                    ...prev,
                    mandal: fieldOptions.mandal_all[event?.target?.value?.value] || []
                }
            })
        } else if (event?.type === 'submit') {
            console.log("SUBMIT HERE", event.values)
            let lang = await retrieveData('userLanguageSaved', 'string');

            let payload = {
                employeeId: userInfo?.publicUserId || '',
                "type": "create",
                data: { ...event.values, language: lang }
            }

            saveNewsInfo(payload)

        }
    }


    const saveNewsInfo = (payload) => {
        try {
            // setTimeout(() => {
            //     navigation.navigate('PostIndex/PublicUserSummary')
            // }, 500);
            post(EndPointConfig.addPublicUserNews, payload)
                .then(function (response) {
                    if (response?.status === 'success') {

                        ToasterService.showSuccess(response.message === 'success' ? t(message) : response?.message || t('success'));
                        navigation.navigate('PostIndex/PublicUserSummary')
                    } else {
                        ToasterService.showError(response.message || t('someThingWentWrong'))
                    }
                })
                .catch(function (error) {
                    console.error(error); 
                    ToasterService.showError(t('someThingWentWrong'))

                });

        } catch (error) {
            ToasterService.showError(t('someThingWentWrong'))
            console.error(error);
        }
    }
    return (
        <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: "#000", textAlign: 'center', marginTop: 10 }}>
                {t('postScreen.newPost')}    </Text>
            {dfmFields &&
                <DFM dfmForm={dfmFields} dfmValues={formValue} fieldOptions={fieldOptions} onFormSubmit={formSubmitHandeler} />
            }

        </View>
    )
}

export default PublicNewsPost

const styles = StyleSheet.create({})