import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { retrieveData } from '../../../handelers/AsyncStorageHandeler';
import { useTranslation } from 'react-i18next';
import { post } from '../../../handelers/APIHandeler';
import EndPointConfig from '../../../handelers/EndPointConfig';
import logo from '../../../assets/branding/logo.png'
import { epochToDate } from '../../../handelers/ReusableHandeler';
import PublicUserNewsCard from '../../../components/PublicUserNewsCard';
import LoaderScreen from '../../../components/LoaderScreen';
const PublicUserSummary = () => {
    const defaultPaginationMetaData = {
        page: 1,
        count: 5
    };
    const defaultCountData = {
        "approvedCount": 0,
        "rejectedCount": 0,
        "pendingCount": 0
    }

    let [countData, setCountData] = useState(defaultCountData)
    const [paginationMetaData, setPaginationMetaData] = useState(defaultPaginationMetaData);
    const navigation = useNavigation()
    let [loader, setLoader]=useState(false)
    const { t } = useTranslation();
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef(null);

    const [userinfo, SetuserInfo] = useState();
    let [listOfEntries, setListOfEntries] = useState([]);
    useFocusEffect(
        React.useCallback(() => {
            const fetchInitialLoad = async () => {
                try {
                    setSelectedFilter('all')
                    let dd = await retrieveData('publicUserInfo');
                    console.log("dddddd", dd);
                    SetuserInfo(dd);
                    getNewsList({ ...defaultPaginationMetaData }, true);

                } catch (error) {
                    console.error('Error fetching and changing language:', error);
                }
            };

            setPaginationMetaData(defaultPaginationMetaData)
            fetchInitialLoad();

            return () => {
                // Cleanup function (if needed)
            };
        }, []) // Dependency array includes i18n to re-trigger effect when i18n changes
    );



    const [selectedFilter, setSelectedFilter] = useState('all');




    // Function to handle adding news
    const handleAddNews = () => {
        // Implement navigation or modal to add news
        navigation.navigate('PostIndex/PublicNewsPost')
    };

    // Function to handle filter change
    const handleFilterChange = (value) => {
        setPaginationMetaData(defaultPaginationMetaData)
        getNewsList({ ...defaultPaginationMetaData }, true, value);


        setSelectedFilter(value);
    };

    const getNewsList = async (payload, initialLoad = false, filterStatus) => {
        // setLoading(true);
        try {
            setLoader(true)
            let dd = await retrieveData('publicUserInfo');

            let lang = await retrieveData('userLanguageSaved', 'string');
            var obj = {
                employeeId: dd?.publicUserId,
                status: filterStatus ? filterStatus : selectedFilter,
                language: lang
            }

            post(EndPointConfig.listPublicUserNews, { ...payload, ...obj })
                .then(function (response) {
                    if (response?.status === 'success') {
                        if (initialLoad) {
                            setListOfEntries(response?.data?.records || []);
                            if (response?.data?.records?.length <= 1) {
                                return;
                            }


                            if (response?.data?.counts) {
                                setCountData(response?.data?.counts)
                            }
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
                    setLoader(false)
                    console.error(error);
                })
                .finally(() => {
                    setLoader(false)
                    //   setLoading(false);
                });
                
            } catch (error) {
            setLoader(false)
            console.error(error);
        }
    };


    const renderItem = ({ item }) => {
        // Define badge color based on status
        let badgeColor;
        switch (true) {
            case item.rejected:
                badgeColor = '#ff6347'; // Red color for rejected
                // badgeColor = '#8B0000'; // Red color for rejected
                break;
            case item.approved:
                badgeColor = '#013220'; // Green color for approved
                break;
            default:
                badgeColor = '#8B8000'; // Yellow color for pending
                break;
        }

        return (
            <TouchableOpacity onPress={() => navigation.navigate('DetailedNewsInfo', { data: { newsId: item.newsId } })}>


                <PublicUserNewsCard data={
                    {
                        photo: item?.images?.[0]?.tempURL || null,
                        title: item.title,
                        subtitle: item.sub_title,
                        description: item.description,
                        date: epochToDate(item.createdDate),
                        badge: item.rejected ? 'Rejected' :
                            item.approved ? 'Published' :
                                'Pending',
                    }
                    
                } badgeColor={badgeColor} />



            </TouchableOpacity>
        );
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setPaginationMetaData(defaultPaginationMetaData);
        getNewsList(defaultPaginationMetaData, true);
        setRefreshing(false);
        flatListRef?.current?.scrollToOffset({ offset: 0, animated: true });
    };

    return (
        <View style={styles.container}>
            {/* Header Message */}
            <Text style={styles.header}>Hi {userinfo?.name},</Text>
            {/* Display counts for each status */}
            <View style={styles.countContainer}>
                <Text>Approved: {countData?.approvedCount || 0}</Text>
                <Text>Pending: {countData?.pendingCount || 0}</Text>
                <Text>Rejected: {countData?.rejectedCount || 0}</Text>
            </View>
            {/* Filter dropdown */}
            <Picker
                selectedValue={selectedFilter}
                style={{ height: 50, width: '100%' }}
                onValueChange={(itemValue) => handleFilterChange(itemValue)}
            >
                <Picker.Item label="All" value="all" />
                <Picker.Item label="Approved" value="approved" />
                <Picker.Item label="Pending" value="pending" />
                <Picker.Item label="Rejected" value="rejected" />
            </Picker>
            {/* Button to add news */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddNews}>
                <Text style={styles.addButtonText}>Add News</Text>
            </TouchableOpacity>
            {/* Display list of news */}

            {/* {listOfEntries?.length > 0 && */}

<LoaderScreen loading={loader}/>
            <FlatList
                ref={flatListRef}
                // style={{borderWidth:2}}
                data={listOfEntries}
                renderItem={renderItem}
                keyExtractor={(item, index) => 'public_id' + index}
                ListEmptyComponent={() => (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>{t('postScreen.noNewsAvailable')}</Text>
                    </View>
                )}
                onEndReached={() => {
                    if (!paginationMetaData?.endOfRecords) {
                        setPaginationMetaData((prev) => {
                            return {
                                ...prev,
                                page: prev.page + 1
                            }
                        })

                        console.log("TRUGGERE AT END")
                        getNewsList({ ...paginationMetaData, page: paginationMetaData.page + 1 })
                    }
                }}
                onEndReachedThreshold={0.1}

                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            // Implement other FlatList props as needed
            />
            {/* } */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    countContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: 'lightgreen',
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 60,
        borderRadius: 25,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    newsItem: {
        flexDirection: 'row',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },
    newsImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    newsContentContainer: {
        flex: 1,
    },
    newsTitle: {
        fontWeight: 'bold',
        // marginBottom: 5,
    },
    newsSubtitle: {
        fontStyle: 'italic',
        // marginBottom: 5,
    },
    newsContent: {
        // marginBottom: 5,
    },
    newsDate: {
        alignSelf: 'flex-end',
        // marginBottom: 5,
    },
    newsStatus: {
        alignSelf: 'flex-end',
    },
    badgeText: {
        color: "#fff",
        fontWeight: 'bold'
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default PublicUserSummary;
