import React, { useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { post } from '../../handelers/APIHandeler';
import EndPointConfig from '../../handelers/EndPointConfig';
import { retrieveData } from '../../handelers/AsyncStorageHandeler';
import { FlatList, View, Text, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SubHeaderOfScreen from '../../components/SubHeaderOfScreen';
import { scaleFont } from '../../handelers/ReusableHandeler';

const SearchIndex = ({navigation}) => {
  const { t } = useTranslation();
  const [userLanguage, setUserLanguage] = useState('label');
  const [searchList, setSearchList] = useState([]);
  const colorScheme = useColorScheme();
  const subHeaderElements = {
    heading: {
      label: t('searchScreen.tabsName.searchIndex'),
      hideIcon:true,
      noActions:true,
      configuration:{
        parent:{
          fontSize:scaleFont(20)
        }
      }

    },
  };
  // const navigation = useNavigation();
// const route=useRoute()
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

  const getMetaData = () => {
    try {
      const metaList = ['NEWS_CATEGORIES_REGIONAL'];
      post(EndPointConfig.getMetaData, { metaList })
        .then(function (response) {
          if (response?.status === 'success') {
            setSearchList(response?.data?.NEWS_CATEGORIES_REGIONAL || []);
            console.log(response?.data);
          }
        })
        .catch(function (error) {
          console.error(error);
        });

    } catch (error) {
      console.error(error);
    }
  };

  const randomLightColor = () => {
    // Generate random light hex color code
    const randomNum = Math.floor(Math.random() * 8388608); // Max value is exclusive
    const hexCode = randomNum.toString(16).padStart(6, '0'); // Pad with zeros to ensure six digits
    return '#' + hexCode;
  };

  const randomDarkColor = () => {
    // Generate random dark hex color code
    const randomNum = Math.floor(Math.random() * 8388607); // Max value is exclusive
    const hexCode = randomNum.toString(16).padStart(6, '0'); // Pad with zeros to ensure six digits
    return '#' + hexCode;
  };


  const getThemeColor = () => {
    // Determine theme color based on color scheme
    if (colorScheme === 'dark') {
      // Dark theme, use light random color
      return randomLightColor();
    } else {
      // Light theme, use dark random color
      return randomDarkColor();
    }
  };
  
  const ListItem = ({ item }) => (
    <TouchableOpacity onPress={()=>{
      
      console.log(item)
      
      navigation.navigate('SearchCategory', {data:item})
      
      }}>
      <View style={[styles.item]}>
        <Icon name={item.icon} size={24} color={'black'} style={styles.icon} />
        <Text style={styles.label}>{item?.[userLanguage || 'label']}</Text>
        <Icon name="angle-right" size={24} color="black" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
              <SubHeaderOfScreen elements={subHeaderElements} />

      <FlatList
        data={searchList || []}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default SearchIndex;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10, // Add marginBottom for spacing between items
  },
  icon: {
    marginRight: 10,
  },
  label: {
    flex: 1,
    marginRight: 10,
  },
});
