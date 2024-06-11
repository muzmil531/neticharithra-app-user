

import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ExampleParallaxCarousel from '../../components/ExampleParallaxCarousel'
import NewsTitleCard from '../../components/NewsTitleCard'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import { retrieveData } from '../../handelers/AsyncStorageHandeler'
import { post } from '../../handelers/APIHandeler'
import EndPointConfig from '../../handelers/EndPointConfig'
import { ActivityIndicator } from 'react-native-paper'
import EmptyListComponent from '../../components/EmptyListComponent'
import LoadingScreen from '../../components/LoadingScreen'
import TabScreenWrapper from '../../components/TabScreenWrapper'

const Categorised = () => {
  let [topPriorityNews, setTopPriorityNews] = useState([])
  let [latestNews, setlatestNews] = useState([]);
  let [initalLoading, setInitialLoading] = useState(true)

  let route = useRoute()
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
          let lang = await retrieveData('userLanguageSaved', 'string');
          setInitialLoading(true)
          if (lang) {
            // setUserLanguage(lang);
            getNewsInfoV2(lang);
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
  const getNewsInfoV2 = (lang) => {
    try {
      // const metaList = ['NEWS_CATEGORIES_REGIONAL'];
      let payload = { ...paginationMetaData, ...{ language: lang } }
      payload = { ...payload, ...{ category: route?.params?.mainProp?.label } }
      post(EndPointConfig.getNewsInfoV2, payload)
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
      additionalPayload = { ...additionalPayload, ...{ category: route?.params?.mainProp?.label } }

      post(EndPointConfig.getLatestNewsV2, { ...{ language: lang }, ...additionalPayload || {} })
        .then(function (response) {
          setLoading(false)
          setInitialLoading(false)

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
        <>

          <Text style={styles.latestNews}>Latest news</Text>
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
              ListEmptyComponent={() => {
                return (<EmptyListComponent />)
              }} // Add the empty component here

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
        </>

      }
    </TabScreenWrapper>
  )
}

export default Categorised

const styles = StyleSheet.create({
  latestNews: {
    fontSize: 20, marginLeft: 20, color: 'black', marginBottom: 10, fontFamily: 'Inter', fontWeight: 'bold'
  },
  footer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
})