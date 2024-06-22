import React, { useState, useCallback } from 'react'
import { Button, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View, useColorScheme, useTheme } from 'react-native'
import { ActivityIndicator, Searchbar } from 'react-native-paper'
import debounce from 'lodash/debounce'
import Colors from '../../colors/Colors'
import { useFocusEffect } from '@react-navigation/native'
import { retrieveData } from '../../handelers/AsyncStorageHandeler'
import { post } from '../../handelers/APIHandeler'
import EndPointConfig from '../../handelers/EndPointConfig'
import EmptyListComponent from '../../components/EmptyListComponent'
import AntDesign from 'react-native-vector-icons/AntDesign'
import NewsTitleCard from '../../components/NewsTitleCard'

const SearchScreenV2 = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const colors = Colors[useColorScheme()];
  let [selectedCategory, setSelectedCategory] = useState()
  let [selectedDate, setSelectedDate] = useState()

  const [modalVisible, setModalVisible] = useState(false);
  let [userLanguage, setUserLanguage] = useState('label');
  let [listOfCategories, setListOfCategories] = useState([]);
  let [listOfNews, setListOfNews] = useState([])
  let [loading, setLoading] = useState(false)
  let [paginationMetaData, setPaginationMetaData] = useState({
    "count": 5,
    "page": 0,
    endOfRecords: false
  })
  // Debounced function to log search query
  const logSearchQuery = useCallback(
    debounce((query) => {
      console.log('Search value:', query)
      setPaginationMetaData({
        "count": 5,
        "page": 0,
        endOfRecords: true
      })
      getSearchedData({
        ...{ search: query }, ...{
          "count": 5,
          "page": 0
        }
      }, true)
    }, 500),
    []
  )


  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          let lang = await retrieveData('userLanguageSaved', 'string');
          if (lang) {
            setUserLanguage(lang);
            getMetaData();
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData(); // Call the async function when the screen gains focus
    }, [])
  );

  const onChangeSearch = query => {
    setSearchQuery(query)
    logSearchQuery(query)
  }

  const getMetaData = () => {
    try {
      const metaList = ['NEWS_CATEGORIES_REGIONAL'];
      post(EndPointConfig.getMetaData, { metaList })
        .then(function (response) {
          if (response?.status === 'success') {
            setListOfCategories(response?.data?.['NEWS_CATEGORIES_REGIONAL']);
          }
        })
        .catch(function (error) {
          console.error(error);
        });

    } catch (error) {
      console.error(error);
    }
  };
  const getSearchedData = (payloadP1, newSearch) => {
    try {
      setLoading(true)
      let payload = { ...payloadP1 }
      console.log(payload)
      if (selectedCategory && !newSearch) {
        payload['category'] = selectedCategory?.label
      }
      post(EndPointConfig.searchNewsV2, payload)
        .then(function (response) {
          if (response?.status === 'success') {
            if (newSearch) {
              setListOfNews(response?.data || [])
              console.log(response?.data?.length)
            } else {
              setListOfNews((prev) => {
                return [...prev, ...response?.data || []]
              })

            }
            setPaginationMetaData((prev) => {
              return {
                ...prev,
                endOfRecords: response?.endOfRecords
              }
            })

          }
          setLoading(false)
        })
        .catch(function (error) {
          console.error(error); setLoading(false)

        });

    } catch (error) {
      console.error(error); setLoading(false)

    }
  };
  const changeOfCategory = (param1) => {
    console.log(param1)
    setSelectedCategory(param1);

    getSearchedData({
      ...{ search: searchQuery, category: param1.label }, ...{
        "count": 5,
        "page": 0
      }
    }, true)
    setTimeout(() => {

      setModalVisible(false)
    }, 300);
  }
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search with Title | Location"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={[styles.searchbar, { backgroundColor: colors.surface }]} // Set background color from theme
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 10 }} >
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View >
            <Text>
              {selectedCategory ? '' : 'Select'} Category
              {selectedCategory && (
                <Text>
                  : {selectedCategory?.[userLanguage || 'label']} &nbsp;
                  <AntDesign name="caretdown" size={15} />
                </Text>
              )}
            </Text>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View>
            <Text>Select Date</Text>
          </View>
        </TouchableOpacity> */}
      </View>
      <View style={styles.content}>
        <FlatList
          data={listOfNews}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <NewsTitleCard item={item} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          onEndReached={() => {
            console.log("EDN REACHED22", paginationMetaData?.endOfRecords)
            if (!(paginationMetaData?.endOfRecords)) {
              console.log("END", searchQuery)
              getSearchedData({ search: searchQuery, ...paginationMetaData, page: paginationMetaData.page + 1 });
              setPaginationMetaData((prev) => ({
                ...prev,
                page: prev.page + 1
              }));
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => {
            if (!loading) return (<></>);
            return (
              <View style={styles.footer}>
                <ActivityIndicator size="small" />
              </View>
            );
          }}
        />
      </View>



      <Modal
        animationType="slide"
        transparent={true}
        // visible={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={stylesModal.centeredView}>
          <View style={stylesModal.modalView}>
            <Text style={stylesModal.modalText}>Select Category</Text>

            <View style={{ width: "100%" }}>


              {listOfCategories?.map((element, index) => {
                return (
                  <TouchableOpacity key={index} onPress={() => { changeOfCategory(element) }} activeOpacity={0.8}>

                    <View style={{ margin: 5, padding: 5, borderRadius: 20, backgroundColor: selectedCategory?.label === element?.label ? '#3AA2DB' : '#fff', flexDirection: 'row', alignItems: 'center' }}>

                      <View style={{}}>
                        <View style={{ width: 14, height: 14, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderColor: selectedCategory?.label === element?.label ? 'white' : 'black', borderWidth: 1 }}>

                          {
                            selectedCategory?.label === element?.label &&

                            <View style={{ width: 8, height: 8, backgroundColor: 'white', borderRadius: 50 }}>

                            </View>
                          }
                        </View>
                      </View>
                      <View style={{}}>

                        <View style={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{ fontSize: 20, color: selectedCategory?.label === element?.label ? '#fff' : '#000' }}>{element?.[userLanguage || 'label']}</Text>
                        </View>
                      </View>

                    </View>

                  </TouchableOpacity>
                  // <View style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, paddingHorizontal: 30, margin: 5 }}><Text>{element?.[userLanguage || 'label']}</Text></View>
                )
              })}
            </View>

            <Button
              title="Cancel"
              onPress={() => {
                getSearchedData({
                  ...{ search: searchQuery }, ...{
                    "count": 5,
                    "page": 0
                  }
                }, true); setSelectedCategory(); setModalVisible(!modalVisible)
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default SearchScreenV2

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
    backgroundColor: '#f4f3f38f'
  },
  searchContainer: {
    margin: 16,
    elevation: 3, // Set elevation here
    shadowColor: '#000', // Set shadow color if needed
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchbar: {
    // margin: 16, // You can remove this margin if not needed
  },
  footer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center'
  }
})


const stylesModal = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center', fontWeight: 'bold', fontSize: 16
  },
});
