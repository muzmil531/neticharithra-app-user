import { Image, StyleSheet, Text, View, useColorScheme } from 'react-native'
import React from 'react'
import te from './../assets/branding/te.png'
import en from './../assets/branding/en.png'
import Colors from '../colors/Colors'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
const GeneralHeader = () => {
  const colors = Colors[useColorScheme()];
  const navigation = useNavigation();

  const { t } = useTranslation();
  const userLanguage = t('languageCode')
  // console

  // const logoURL = require(`./../assets/branding/${t('languageCode')}.png`)
  return (
    <View style={[styles.headerContainer, { backgroundColor: colors.headerThemeBg, color: colors.headerThemeText }]}>
      <Image source={userLanguage === 'te' ? te : en} style={styles.headerImage} />
      <TouchableOpacity onPress={() => { navigation.navigate('HelpScreen') }}>
        <Text>Help </Text>
      </TouchableOpacity>
    </View>
  )
}

export default GeneralHeader

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: "row",
    justifyContent: 'space-between',
    padding: 16
  },
  headerImage: {
    width: 200,
    height: 25
  }
})