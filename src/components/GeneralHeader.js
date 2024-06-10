import { Image, StyleSheet, Text, View, useColorScheme } from 'react-native'
import React from 'react'
import logo_english from './../assets/branding/logo_english.png'
import Colors from '../colors/Colors'
const GeneralHeader = () => {
  const colors = Colors[useColorScheme()]
  return (
    <View style={[styles.headerContainer, {backgroundColor:colors.headerThemeBg, color:colors.headerThemeText}]}>
        <Image source={logo_english} style={styles.headerImage}/>
    </View>
  )
}

export default GeneralHeader

const styles = StyleSheet.create({
    headerContainer:{
        padding:16
    },
    headerImage:{
        width: 200,
        height:25
    }
})