import { NativeModules, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { clearAllData, retrieveData, saveData } from '../../handelers/AsyncStorageHandeler'
import { Dropdown } from 'react-native-element-dropdown'
import { getJSONData } from '../../components/dfmFields'
import DFM from '../../components/DFM'
import { post } from '../../handelers/APIHandeler'
import EndPointConfig from '../../handelers/EndPointConfig'
import axios from 'axios'

const SpecificDistrict = () => {

    let [savedLocationInfo, setsavedLocationInfo] = useState();
    let [formValue, setformValue] = useState({});
    let [fieldOptions, setfieldOptions] = useState({});
    let [dfmFields, setDFMFields] = useState(getJSONData('addDistrict'))





    useFocusEffect(
        React.useCallback(() => {
            // clearAllData()
            const fetchData = async () => {
                let data = await retrieveData('userSavedLocation');
                if(data){
                    setsavedLocationInfo(data);

                }
                initialLoad()
            };
            // testAPI();
            fetchData();

            return () => {
                // setfieldOptions({});
                // setformValue({});
                // setDFMFields({})
                // Clean-up code (if any)
            };
        }, [])
    );



    const initialLoad = async () => {
        getMetaData();
    }

    getMetaData = (stateId) => {
        try {
            // 'AP_DISTRICTS', 'AP_DISTRICT_MANDALS'
            const metaList = stateId ? [stateId + '_DISTRICTS', stateId + '_DISTRICT_MANDALS_REGIONAL'] : ['STATES']
            post(EndPointConfig.getMetaData, { metaList })
                .then(function (response) {
                    if (response?.status === 'success') {
                        // Initialize options object
                        let options = {};

                        // Check if stateId is not provided
                        if (!stateId) {
                            options.state = response?.data?.STATES || [];
                        } else {
                            // If stateId is provided, set district and town options
                            options.district = response?.data[metaList[0]] || [];
                            options.town_all = response?.data[metaList[1]] || [];
                        }

                        // Update fieldOptions state using the current state and new options
                        setfieldOptions(prev => ({
                            ...prev,
                            ...options
                        }));
                        // console.log("2responseresponse", response?.data?.metaList[0])
                    }

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



    const formSubmitHandeler =async (event, param1, param2) => {

        if (event?.target?.name === 'state') {
            getMetaData(event?.target?.value?.value)
        } else if(event?.target?.name === 'district'){
            setfieldOptions((prev)=>{
                return {...prev,
                 town: fieldOptions.town_all[event?.target?.value?.value] || []}
            })
        } else if(event?.type === 'submit'){
           let resp =await  saveData('userSavedLocation', JSON.stringify(event?.values) || {})
           setTimeout(() => {
            NativeModules.DevSettings.reload();

           }, 1000);
        }
    }
    return (
        <View>
            {
                savedLocationInfo && <Text>DISTRICT INFO</Text>
            }
            {
                !savedLocationInfo && <>
                    {dfmFields &&
                        <DFM dfmForm={dfmFields} dfmValues={formValue} fieldOptions={fieldOptions} onFormSubmit={formSubmitHandeler} />
                    }



                </>
            }
        </View>
    )
}

export default SpecificDistrict

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});