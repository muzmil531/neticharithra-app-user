
import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Text, Animated, StyleSheet, RefreshControl, TouchableOpacity, NativeModules } from 'react-native';
import NewsContainer from '../../components/NewsContainer';
import { post } from '../../handelers/APIHandeler';
import EndPointConfig from '../../handelers/EndPointConfig';
import { useFocusEffect } from '@react-navigation/native';
import { scaleFont } from '../../handelers/ReusableHandeler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { ActivityIndicator } from 'react-native-paper';
import { getJSONData } from '../../components/dfmFields';
import { retrieveData, saveData } from '../../handelers/AsyncStorageHandeler';
import { useTranslation } from 'react-i18next';
import DFM from '../../components/DFM';

const SpecificDistrict = () => {
    const styles = StyleSheet.create({
        scrollDownIndicator: {
            position: 'absolute',
            bottom: 40,
            alignSelf: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#fff',
            elevation: 5,
        },
        scrollDownText: {
            color: 'white',
            fontSize: scaleFont(12),
            fontWeight: 'bold',
        },
        loadingContainer: {
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent background
        },
    });

    const defaultPaginationMetaData = {
        page: 1,
        count: 5
    };

    const [paginationMetaData, setPaginationMetaData] = useState(defaultPaginationMetaData);
    const [refreshing, setRefreshing] = useState(false);
    const [listOfEntries, setListOfEntries] = useState([]);
    const translateYAnim = useRef(new Animated.Value(300)).current;
    const [loading, setLoading] = useState(false);
    const flatListRef = useRef(null);

    let [savedLocationInfo, setsavedLocationInfo] = useState();
    let [formValue, setformValue] = useState({});
    let [fieldOptions, setfieldOptions] = useState({});
    let [dfmFields, setDFMFields] = useState();
    let [showScreen, setShowScreen] = useState(false)
    const [showMessage, setShowMessage] = useState(false);
    const { t } = useTranslation();


    useEffect(() => {
        Animated.timing(
            translateYAnim,
            {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }
        ).start();
    }, [translateYAnim]);


    const getNewsList = (payload, initialLoad = false) => {
        setLoading(true);
        try {
            post(EndPointConfig.getDistrictNewsList, { ...payload, ...savedLocationInfo || {} })
                .then(function (response) {
                    console.log("RECIVED BACK")

                    if (response?.status === 'success') {
                        console.log("TTRR")
                        if (initialLoad) {
                            setListOfEntries(response?.data?.records || []);
                            animateList();
                            if (response?.data?.records?.length <= 1) {
                                return;
                            }


                            setShowMessage(true);
                            setTimeout(() => {
                                setShowMessage(false);
                            }, 3000)
                        } else {
                            setListOfEntries((prev) => {
                                return [...prev, ...response?.data?.records || []];
                            });
                        }
                        setPaginationMetaData((prev) => {
                            return { ...prev, endOfRecords: response?.data?.endOfRecords || false };
                        });
                    }
                })
                .catch(function (error) {
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                });

        } catch (error) {
            console.error(error);
        }
    };

    const animateList = () => {
        flatListRef?.current?.scrollToOffset({ offset: 0, animated: true });

        Animated.timing(
            translateYAnim,
            {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }
        ).start();
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setPaginationMetaData(defaultPaginationMetaData);
        getNewsList(defaultPaginationMetaData, true);
        setRefreshing(false);
        flatListRef?.current?.scrollToOffset({ offset: 0, animated: true });
    };




    useFocusEffect(
        React.useCallback(() => {
            // clearAllData()
            const fetchData = async () => {

                let data = await retrieveData('userSavedLocation');
                if (data) {
                    setsavedLocationInfo(data);
                    console.log(data);
                    setShowScreen(true);
                    getNewsList({ ...paginationMetaData, ...data }, true);

                } else {
                    let dfm = await t('homeScreen.addDistrictDFM', { returnObjects: true }) || [];
                    setDFMFields(dfm)
                    getMetaData();
                }
                // initialLoad()
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
                    setShowScreen(true);
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



    const formSubmitHandeler = async (event, param1, param2) => {

        if (event?.target?.name === 'state') {
            getMetaData(event?.target?.value?.value)
        } else if (event?.target?.name === 'district') {
            setfieldOptions((prev) => {
                return {
                    ...prev,
                    town: fieldOptions.town_all[event?.target?.value?.value] || []
                }
            })
        } else if (event?.type === 'submit') {
            let resp = await saveData('userSavedLocation', JSON.stringify(event?.values) || {})
            setTimeout(() => {
                NativeModules.DevSettings.reload();

            }, 1000);
        }
    }

    return (
        <>
            {showScreen &&


                <>

                    {
                        savedLocationInfo &&

                        <>
                            <View style={{ flex: 1 }}>
                                {listOfEntries.length === 0 && !loading && (
                                    <View style={styles.loadingContainer}>
                                        <Text>{t('homeScreen.noNews')}</Text>
                                    </View>
                                )}
                                <Animated.FlatList
                                    ref={flatListRef}
                                    data={listOfEntries}
                                    renderItem={({ item, index }) =>
                                        index !== listOfEntries.length - 1 ? (
                                            <Animated.View
                                                style={{
                                                    transform: [{ translateY: translateYAnim }],
                                                }}
                                            >
                                                <NewsContainer
                                                    params={item}
                                                    newsId={item?.newsId}
                                                    imageUrl={item?.images?.[0]?.tempURL}
                                                    title={item?.title || ''}
                                                    subTitle={item?.sub_title || ''}
                                                    content={item?.description || ''}
                                                />
                                            </Animated.View>
                                        ) : (
                                            <NewsContainer
                                                params={item}
                                                newsId={item?.newsId}
                                                imageUrl={item?.images?.[0]?.tempURL}
                                                title={item?.title || ''}
                                                subTitle={item?.sub_title || ''}
                                                content={item?.description || ''}
                                            />
                                        )
                                    }
                                    keyExtractor={(item, index) => 'activeEmp' + index}
                                    onEndReachedThreshold={0.5}
                                    onEndReached={() => {
                                        if (!paginationMetaData?.endOfRecords) {
                                            setPaginationMetaData((prev) => {
                                                return {
                                                    ...prev,
                                                    page: prev.page + 1
                                                }
                                            })

                                            getNewsList({ ...paginationMetaData, page: paginationMetaData.page + 1 })
                                        }
                                    }}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={handleRefresh}
                                        />
                                    }
                                />
                                {showMessage && (
                                    <View style={styles.scrollDownIndicator}>
                                        <Text style={styles.scrollDownText}>Scroll down to read more</Text>
                                    </View>
                                )}
                                {loading && (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator size="large" color="white" />
                                    </View>
                                )}
                                <TouchableOpacity style={{ position: 'absolute', bottom: 20, right: 20 }} onPress={handleRefresh}>
                                    <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 20, padding: 10, elevation: 5 }}>
                                        <FontAwesome5
                                            style={{
                                                fontSize: 15,
                                                fontWeight: 'bold',
                                            }}
                                            name={"sync-alt"}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </>
                    }
                    {
                        !savedLocationInfo && <>
                            {dfmFields &&
                                <DFM dfmForm={dfmFields} dfmValues={formValue} fieldOptions={fieldOptions} onFormSubmit={formSubmitHandeler} />
                            }



                        </>
                    }


                </>}
        </>

    );
};

export default SpecificDistrict;
