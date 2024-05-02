import { StyleSheet, Text, View ,Animated, RefreshControl, TouchableOpacity} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import { retrieveData } from '../../handelers/AsyncStorageHandeler';
import { useTranslation } from 'react-i18next';
import SubHeaderOfScreen from '../../components/SubHeaderOfScreen';
import { scaleFont } from '../../handelers/ReusableHandeler';
import { post } from '../../handelers/APIHandeler';
import EndPointConfig from '../../handelers/EndPointConfig';
import NewsContainer from '../../components/NewsContainer';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { ActivityIndicator } from 'react-native-paper';

const SearchCategory = () => {
  const route = useRoute();

  const { t } = useTranslation();
  const [userLanguage, setUserLanguage] = useState('label');
  const subHeaderElements2 = {
    heading: {
      label: t('searchScreen.tabsName.searchIndex'),
      
      configuration:{
        parent:{
          fontSize:scaleFont(20)
        }
      }

    },
  };
  let [subHeaderElements, setSubheaderElements]=useState()
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {

          console.log("params", route.params)

          let lang = await retrieveData('userLanguageSaved', 'string');
          if (lang) {
            setUserLanguage(lang);

            setSubheaderElements(
             { heading: {
                label: route?.params?.data?.[lang]+' '+t('searchScreen.tabsName.SearchCategory'),
                
                configuration:{
                  parent:{
                    fontSize:scaleFont(20)
                  }
                }
          
              },
            })
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData(); // Call the async function when the screen gains focus
    }, [])
  );
  const styles = StyleSheet.create({
    scrollDownIndicator: {
      position: 'absolute',
      bottom: 100,
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
      justifyContent: 'center',
      height:'100%',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent background
      textAlign:'center',
      zIndex:999
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
  const [showMessage, setShowMessage] = useState(false);

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

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getNewsList(paginationMetaData, true);
  //     return () => { };
  //   }, [])
  // );
  useEffect(() => {
    getNewsList(paginationMetaData, true);

  }, []);
  const getNewsList = (payload, initialLoad = false) => {
    setLoading(true);
    try {
      post(EndPointConfig.getCategoryNews, {...payload, category:route.params.data.label})
        .then(function (response) {
          if (response?.status === 'success') {
            console.log("ressssssssss", response.data.records)
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
  return (
    <View style={{ flex: 1 }}>
      {subHeaderElements && 
                    <SubHeaderOfScreen elements={subHeaderElements} />
      }

<View >
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
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      {showMessage && (
        <View style={styles.scrollDownIndicator}>
          <Text style={styles.scrollDownText}>Scroll down to read more</Text>
        </View>
      )}
      <TouchableOpacity style={{ position: 'absolute', bottom: 100, right: 20 }} onPress={handleRefresh}>
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
    </View>
  )
}

export default SearchCategory



