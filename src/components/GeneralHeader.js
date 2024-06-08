import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import logo_english from './../assets/branding/logo_english.png'
const GeneralHeader = () => {
  return (
    <View style={styles.headerContainer}>
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