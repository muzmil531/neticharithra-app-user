import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Text, Animated, StyleSheet } from 'react-native';
import NewsContainer from '../../components/NewsContainer';
import { post } from '../../handelers/APIHandeler';
import EndPointConfig from '../../handelers/EndPointConfig';
import { useFocusEffect } from '@react-navigation/native';

const News = () => {

  let [paginationMetaData, setPaginationMetaData] = useState({
    page:1, 
    count:10
  })

  let [listOfEntries, setListOfEntries] = useState([])
  // Animation setup
  const translateYAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(
      translateYAnim,
      {
        toValue: 0,
        duration: 1000, // Adjust duration as needed
        useNativeDriver: true,
      }
    ).start();
  }, [translateYAnim]);

  // State to manage if end is reached and show message
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if(listOfEntries?.length<=1){
      return;
    }
    setShowMessage(true)
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 6000); // Adjust time as needed

    return () => clearTimeout(timer);
  }, [listOfEntries]);

  
  useFocusEffect(
    React.useCallback(() => {
        // clearAllData()
        getNewsList(paginationMetaData, true)
        return () => {
            // setfieldOptions({});
            // setformValue({});
            // setDFMFields({})
            // Clean-up code (if any)
        };
    }, [])
);


  getNewsList = (payload, initialLoad=false) => {
    try {
        // 'AP_DISTRICTS', 'AP_DISTRICT_MANDALS'
        post(EndPointConfig.getHomeData, payload)
            .then(function (response) {
                if (response?.status === 'success') {
                
                  if(initialLoad){
                    setListOfEntries(response?.data?.records || [])
                  } else {
                    setListOfEntries((prev)=>{
                      return [...prev, response?.data?.records || []]
                    })
                  }
                  setPaginationMetaData((prev)=>{
                    return {...prev, endOfRecords:response?.data?.endOfRecords || false}
                  })
                  console.log(response)
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
  // Render
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={listOfEntries}
        id='news'
        renderItem={({ item, index }) =>
          index !== listOfEntries.length - 1 ? (
            <Animated.View
              style={{
                transform: [{ translateY: translateYAnim }],
              }}
            >
                 <NewsContainer
                 params={item}
              imageUrl={item?.images?.[0]?.tempURL}
              title={item?.title || ''}
              subTitle={item?.sub_title || ''}
              content={item?.description || ''}
            />
            </Animated.View>
          ) : (
            <NewsContainer
            params={item}

              imageUrl={item?.images?.[0]?.tempURL}
              title={item?.title || ''}
              subTitle={item?.sub_title || ''}
              content={item?.description || ''}
            />
          )
        }
        keyExtractor={(item, index) => 'activeEmp' + index}
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          // No animation on reaching end
        }}
      />
      {showMessage && (
        <View style={styles.scrollDownIndicator}>
          <Text style={styles.scrollDownText}>Scroll down to read more</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollDownIndicator: {
    position: 'absolute',
    bottom: 20,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default News;
