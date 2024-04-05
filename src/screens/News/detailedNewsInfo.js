import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { post } from '../../handelers/APIHandeler';
import EndPointConfig from '../../handelers/EndPointConfig';
import NewsContainer from '../../components/NewsContainer';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import SubHeaderOfScreen from '../../components/SubHeaderOfScreen';

const detailedNewsInfo = () => {

    const route = useRoute();
var[newsInfo, setNewsInfo]=useState()
    useFocusEffect(
        React.useCallback(() => {
          // Do something when the screen comes into focus
    
          getNewsInfo(route?.params?.data)
          // Cleanup function, executed when the component unmounts or the effect is re-run
          return () => {
            // Do cleanup here if necessary
            console.log('Screen unfocused');
          };
        }, [])
      );    getNewsInfo = (payload) => {
        try {
            // 'AP_DISTRICTS', 'AP_DISTRICT_MANDALS'
            post(EndPointConfig.getNewsInfo, payload)
                .then(function (response) {
                    if (response?.status === 'success') {

                        // console.log(response?.data?.specificRecord[0])
                        setNewsInfo(response?.data?.specificRecord?.[0] || null)
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

    const subHeaderElements = {
        heading: {
          label: 'Back',
        },
      };
    return (

        <>
        <SubHeaderOfScreen elements={subHeaderElements} />
        
        <ScrollView>
            <NewsContainer
                params={newsInfo}
                imageUrl={newsInfo?.images?.[0]?.tempURL}
                title={newsInfo?.title || ''}
                subTitle={newsInfo?.sub_title || ''}
                content={newsInfo?.description || ''}
                showFullContent={true}
            />        
            </ScrollView>
        </>
    )
}

export default detailedNewsInfo

const styles = StyleSheet.create({})