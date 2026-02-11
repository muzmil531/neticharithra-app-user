import { Image, StyleSheet, Text, View, Platform } from 'react-native'
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
  const setTheme = themeData?.setTheme || (() => { });
  const navigation = useNavigation();

  const { t } = useTranslation();
  const userLanguage = t('languageCode')

  const toggleTheme = () => {
    if (setTheme && typeof setTheme === 'function') {
      setTheme(isDark ? 'light' : 'dark');
    }
  };

  return (
    <View style={[
      styles.headerContainer,
      {
        backgroundColor: colors?.headerThemeBg || '#fff',
        // backgroundColor: 'transparent',
        borderBottomColor: colors?.borderLight || '#e9ecef',
      }
    ]}>
      <Image source={userLanguage === 'te' ? te : en} style={styles.headerImage} />
      <View style={styles.rightActions}>
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.themeToggle, { backgroundColor: isDark ? colors.backgroundColor : colors.screenBackground }]}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isDark ? 'moon' : 'sunny'}
            size={22}
            color={colors?.textPrimary || '#000'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { navigation.navigate('HelpScreen') }}
          style={styles.helpButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name="help-circle-outline"
            size={22}
            color={colors?.textPrimary || '#000'}
            style={styles.helpIcon}
          />
          <Text style={[styles.helpText, { color: colors?.textPrimary || '#000' }]}>Help</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default GeneralHeader

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerImage: {
    width: 200,
    height: 25,
    // resizeMode: 'contain',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeToggle: {
    padding: 8,
    borderRadius: 8,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  helpIcon: {
    marginRight: 4,
  },
  helpText: {
    fontSize: 15,
    fontWeight: '600',
  },
})