import { Dimensions, FlatList, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ExampleParallaxCarousel from '../../components/ExampleParallaxCarousel'
import NewsTitleCard from '../../components/NewsTitleCard'
import { useFocusEffect } from '@react-navigation/native'
import { retrieveData } from '../../handelers/AsyncStorageHandeler'
import { post } from '../../handelers/APIHandeler'
import EndPointConfig from '../../handelers/EndPointConfig'
import { ActivityIndicator } from 'react-native-paper'
import LoaderScreen from '../../components/LoaderScreen'
import LoadingScreen from '../../components/LoadingScreen'
import TabScreenWrapper from '../../components/TabScreenWrapper'
import { useTranslation } from 'react-i18next'

let screenHeight = Dimensions.get('screen').height;
const AllNews = () => {
  const { t } = useTranslation();

  let [topPriorityNews, setTopPriorityNews] = useState([])
  let [latestNews, setlatestNews] = useState([]);
  let [initalLoading, setInitialLoading] = useState(true)
  // let [endOfRecords, setEndOfRecords] = useState(true)
  let [paginationMetaData, setPaginationMetaData] = useState({
    "count": 5,
    "page": 0,
    endOfRecords: true
  })
  let [loading, setLoading] = useState(false)
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setInitialLoading(true)
          let lang = await retrieveData('userLanguageSaved', 'string');
          if (lang) {
            // setUserLanguage(lang);
            getMetaData(lang);
            setPaginationMetaData({
              "count": 5,
              "page": 0,
              endOfRecords: true
            })
            getLatestNews();
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData(); // Call the async function when the screen gains focus
    }, [])
  );
  const getMetaData = (lang) => {
    try {
      // const metaList = ['NEWS_CATEGORIES_REGIONAL'];
      post(EndPointConfig.getNewsInfoV2, { ...paginationMetaData, ...{ language: lang } })
        .then(function (response) {
          if (response?.status === 'success') {
            setTopPriorityNews(response?.data || []);
          }
        })
        .catch(function (error) {
          console.error(error);
        });

    } catch (error) {
      console.error(error);
    }
  };
  const getLatestNews = async (payload) => {
    try {
      setLoading(true)
      let lang = await retrieveData('userLanguageSaved', 'string');
      let additionalPayload = payload;
      if (!additionalPayload) {
        additionalPayload = paginationMetaData
      }

      console.log("A2")
      post(EndPointConfig.getLatestNewsV2, { ...{ language: lang }, ...additionalPayload || {} })
        .then(function (response) {
          setLoading(false);
          setInitialLoading(false)
          console.log("RRR2", response)
          if (response?.status === 'success') {
            if (payload) {
              setlatestNews((prev) => {
                return [...prev, ...response?.data || []]
              })
            } else {
              setlatestNews(response?.data || []);
            }
            setPaginationMetaData((prev) => {
              return {
                ...prev,
                endOfRecords: response?.endOfRecords
              }
            })
          }
        })
        .catch(function (error) {
          console.error(error);
          setLoading(false)

        });

    } catch (error) {
      console.error(error);
      setLoading(false)

    }
  };

  return (
    <TabScreenWrapper>
      <ExampleParallaxCarousel newsItems={topPriorityNews} />
      {initalLoading &&

        <LoadingScreen message={"Fetching Latest News"} />
      }
      {
        !initalLoading &&

        <View
        >
          {/* <View style={{ width: '100%' }}> */}

          <Text style={styles.latestNews}>
            {t('latestNews')}
            {/* {'latestNews' | translate} */}
          </Text>
          {/* </View> */}
          <View style={{ height: Platform.OS === 'ios' ? "68%" : '75%' }}>


            <FlatList
              data={latestNews}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <NewsTitleCard item={item} />
                </View>
              )}
              keyExtractor={item => item.id}
              onEndReached={() => {
                if (!paginationMetaData?.endOfRecords) {
                  getLatestNews({ ...paginationMetaData, page: paginationMetaData.page + 1 })
                  setPaginationMetaData((prev) => {
                    return {
                      ...prev,
                      page: prev.page + 1
                    }
                  })

                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() => {

                // const renderFooter = () => {
                if (!loading) return null;
                return (
                  <View style={styles.footer}>
                    <ActivityIndicator size="small" />
                  </View>
                );
                // };
              }}
            />
          </View>

        </View>
      }
    </TabScreenWrapper>
  )
}

export default AllNews

const styles = StyleSheet.create({
  latestNews: {
    fontSize: 20, marginLeft: 20, color: 'black', marginBottom: 10, fontFamily: 'Inter', fontWeight: 'bold',
    backgroundColor: '#00272C', width: 125, padding: 7, color: '#fff'
  },
  footer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
})