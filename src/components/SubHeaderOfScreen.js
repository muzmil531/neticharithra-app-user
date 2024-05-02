import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import Colors from '../colors/Colors'
const SubHeaderOfScreen = ({ elements, chipActionEmitter, externalActiveState }) => {

    const navigation = useNavigation()
    const colors = Colors[useColorScheme()]

    const styles = StyleSheet.create({
        container: {
            margin: 10
        },
        parent: {
            HeadingConfiguration: { flexDirection: "row", alignItems: "center", gap: 6 },
            ItemsConfiguration: { marginRight: 10, backgroundColor: colors.chipBackground, padding: 7, borderRadius: 17 },
            activeItemsConfiguration: { backgroundColor: colors.activeChipBackground, borderWidth: 1, borderColor: colors.activeChipText },
        },
        child: {
            HeadingConfiguration: { fontWeight: 700, fontSize: 16, color: colors.heading },
            ItemConfiguration: {
                color: colors.chipText, fontWeight: 700, paddingHorizontal: 6,
            },
            activeItemConfiguration: {
                color: colors.activeChipText
            }
        },
        iconStyle: { fontSize: 12, color: colors.heading },
        chipsConfiguration: { marginTop: 10 },
    })

    const [activeScreen, setActiveScreen] = useState(elements?.initialActiveScreen);


    useFocusEffect(
        React.useCallback(() => {
            setActiveScreen(elements.initialActiveScreen)
        }, [])
    )


    const functionCall = (chip) => {

        if (!externalActiveState) {
            setActiveScreen(chip.label)
        }

        if (chip?.callBack) {
            //
            chip.callBack("chip")
        }
        if (chipActionEmitter) {
            chipActionEmitter(chip)
        } else if (chip?.navigationLink) {
            navigation.navigate(chip.navigationLink)
        }


    }



    const renderChip = (chip) => {
        return <TouchableOpacity onPress={() => { functionCall(chip) }}
            style={[
                styles.parent.ItemsConfiguration,
                chip?.configuration?.parent,
                elements?.chips?.itemsConfiguration?.parent,
                activeScreen == chip.label && [styles.parent.activeItemsConfiguration, elements?.chips?.itemActiveStyle?.parent]]}>
            <Text
                style={[styles.child.ItemConfiguration, elements?.chips?.itemsConfiguration?.child,
                chip?.configuration?.child, activeScreen == chip.label && [styles.child.activeItemConfiguration, elements?.chips?.itemActiveStyle?.child]]}>
                {chip.label}</Text>
        </TouchableOpacity>
    }

    return (
        <View style={styles.container}>
            {
                elements.heading && <TouchableOpacity style={[styles.parent.HeadingConfiguration, elements.heading?.configuration?.parent]} onPress={() => { if (elements?.heading?.callBack) { elements.heading.callBack({ type: 'back' }) } else { navigation.goBack() }; }}>
                    {
                        !elements?.heading?.hideIcon &&

                        <Icon style={[styles.iconStyle, elements.heading.iconStyle]} name="chevron-left" />
                    }
                    <Text style={[styles.child.HeadingConfiguration, elements.heading.configuration?.parent]}>{elements.heading.label}</Text>
                </TouchableOpacity>
            }

            {
                elements?.chips?.data?.length > 0 && <FlatList
                    style={[styles.chipsConfiguration, elements.chips.configuration]}
                    horizontal
                    data={elements.chips.data}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) => renderChip(item)}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />
            }
        </View>

    )
}

export default SubHeaderOfScreen

