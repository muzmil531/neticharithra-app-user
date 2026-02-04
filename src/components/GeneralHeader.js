import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import te from './../assets/branding/te.png'
import en from './../assets/branding/en.png'
import { useTheme } from '../context/ThemeContext'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Ionicons from 'react-native-vector-icons/Ionicons'

const GeneralHeader = () => {
  const themeData = useTheme();
  const colors = themeData?.colors || { headerThemeBg: '#fff', textPrimary: '#000' };
  const isDark = themeData?.isDark || false;
  const setTheme = themeData?.setTheme || (() => {});
  const navigation = useNavigation();

  const { t } = useTranslation();
  const userLanguage = t('languageCode')

  const toggleTheme = () => {
    if (setTheme && typeof setTheme === 'function') {
      setTheme(isDark ? 'light' : 'dark');
    }
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor: colors?.headerThemeBg || '#fff' }]}>
      <Image source={userLanguage === 'te' ? te : en} style={styles.headerImage} />
      <View style={styles.rightActions}>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <Ionicons 
            name={isDark ? 'moon' : 'sunny'} 
            size={20} 
            color={colors?.textPrimary || '#000'} 
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate('HelpScreen') }}>
          <Text style={{ color: colors?.textPrimary || '#000' }}>Help </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default GeneralHeader

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: "row",
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center'
  },
  headerImage: {
    width: 200,
    height: 25
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  themeToggle: {
    padding: 4
  }
})