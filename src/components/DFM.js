import { ScrollView, StyleSheet, View, Image, TouchableOpacity, useColorScheme, KeyboardAvoidingView, Keyboard, Platform, SafeAreaView } from 'react-native'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { Button, TextInput, Text, HelperText, Chip, Checkbox, } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome'
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { Dropdown } from 'react-native-element-dropdown';
import Colors from '../colors/Colors';
import axios from 'axios';
import { BASE_URL } from '../handelers/APIHandeler';
import EndPointConfig from '../handelers/EndPointConfig';
import ToasterService from './ToasterService';
import { useTranslation } from 'react-i18next';

const DFM = forwardRef(({ dfmValues, dfmForm, fieldOptions, onFormSubmit, editFilterData, applyFilters, resetableFields, maxHeight, updateValues, parentField, htmlContent = {}, extraOptions = {} }, ref) => {
    useImperativeHandle(ref, () => ({
        triggerFunction: footerButtonsHandeler
    }));

    var [formValues, setFormValues] = useState({})
    var [filterData, setFilterData] = useState(editFilterData?.filterDataArray ? [...editFilterData?.filterDataArray] : [])
    const [errorValues, setErrorValues] = useState({});
    const colors = Colors[useColorScheme()]

    const [dfmFieldsList, setDFMFieldsList] = useState([])

    const { t } = useTranslation()
    useEffect(() => {

        if (!dfmValues) {
            return;
        } else {
            updateFormValues();
        }
        // console.log("values", dfmValues)
    }, [dfmValues])
    // useEffect(() => {


    //     console.log("HTML CONTENT",htmlContent)
    // }, [htmlContent])

    useEffect(() => {
        if (updateValues && Object.keys(updateValues).length > 0) {
            let formValues = { ...formValues, ...updateValues }
            setFormValues(prevFormValues => ({ ...prevFormValues, ...updateValues }));
            onFormSubmit({ target: { name: "updatedValues" } }, formValues);


        }

    }, [updateValues])



    const updateFormValues = (newAdditionalValues = {}) => {

        if (!dfmValues) {
            return;
        }

        let formValuesCopy = JSON.parse(JSON.stringify({ ...dfmValues, ...newAdditionalValues }));

        for (let index = 0; index < dfmForm?.fields?.length; index++) {



            if (formValuesCopy[dfmForm.fields[index].key] && dfmForm.fields[index].keyboardType === 'number-pad') {
                formValuesCopy[dfmForm.fields[index].key] = formValuesCopy[dfmForm.fields[index].key].toString()
            }
            if (dfmForm.fields[index]['type'] === 'select' && formValuesCopy[dfmForm.fields[index].key] && dfmForm.fields[index].fullObject) {

                formValuesCopy[dfmForm.fields[index].key] = formValuesCopy[dfmForm.fields[index].key][dfmForm.fields[index].bindValue ? dfmForm.fields[index].bindValue : "value"]

            }


        }

        formValues = formValuesCopy;


        setFormValues((prev) => {
            return {
                ...prev, ...formValues
            }
        })
    }


    useEffect(() => {



        if (fieldOptions) {

            const updatedFormFields = [...dfmForm?.fields];
            const fields = Object.keys(fieldOptions);
            for (let index = 0; index < fields.length; index++) {
                const indexField = updatedFormFields.findIndex(element => element.key === fields[index]);
                if (indexField > -1) {
                    updatedFormFields[indexField]['options'] = fieldOptions[fields[index]];
                }
            }
            setDFMFieldsList([...updatedFormFields]);
        }
    }, [fieldOptions, dfmForm]);

    useEffect(() => {


        if (dfmForm?.fields?.length > 0) {

            setDFMFieldsList(dfmForm.fields)
            updateFormValues();
        }

    }, [dfmForm?.fields])



    const handleInputChange = (event, field) => {


        if (field.required && !event) {
            setErrorValues((prev) => ({ ...prev, [field.key]: field.label + ' is required !' }))
        } else if (field.required && field['keyboardType'] === 'email-address' && !isEmailValid(event)) {
            setErrorValues((prev) => ({ ...prev, [field.key]: "Invalid email format" }))
        } else if (field.pattern) {
            const regex = new RegExp(field.pattern);
            if (!regex.test(event)) {
                setErrorValues((prev) => ({ ...prev, [field.key]: `Value should be in ${field.patternExample} format !` }))
            }
        } else {
            setErrorValues((prev) => ({ ...prev, [field.key]: '' }))
        }

        formValues = { ...formValues, [field.key]: event }


        let objIndex = filterData?.findIndex(item => item.key == field.key);
        if (objIndex >= 0) {
            filterData[objIndex].value = [event]
            filterData[objIndex].valueName = [event]
        }
        else {
            filterData = [...filterData, {
                type: field.type,
                key: field.key,
                label: field.label,
                value: [event],
                valueName: [event],
            }];
        }
        setFilterData(filterData);
        setFormValues(formValues);
        if (field.emitInstantChange) {
            return onFormSubmit({ target: { name: field.key } }, formValues);

        }
    };



    const footerButtonsHandeler = async (btn) => {

        if (btn?.action === 'submit') {
            // validate
            let status = await validateForm();

            let filterDataObj = {}
            filterData.map((data) => {
                filterDataObj = {
                    ...filterDataObj,
                    [data?.key]:
                    {
                        value: data?.type == "multiSelect" || data?.type == "multiInput" ? data?.value : data?.value.length > 0 ? data?.value[0] : "",
                        label: data?.type == "multiSelect" || data?.type == "multiInput" ? data?.valueName : data?.valueName.length > 0 ? data?.valueName[0] : "",
                    }
                }
            })
            if (status.valid) {
                var obj = {
                    type: 'submit',
                    button: btn,
                    values: status.formValuesCopy,
                    filterDataObj: filterDataObj,
                    filterDataArray: filterData
                }
                if (parentField) {
                    obj['parentField'] = parentField
                }
                onFormSubmit(obj)
                // setFormValues({});
            } else {
                // onFormSubmit({})
                ToastService.showError("Kindly check all fields(s)")
                // setSnacbarMessage(`Kindly check the field(s)`);
            }
        } else if (btn?.action === 'reset') {
            const formValuesCopy = JSON.parse(JSON.stringify(formValues))
            if (resetableFields) {

                resetableFields.forEach(element => {
                    formValuesCopy[element] = '';
                })

            }
            filterData = [];
            setFilterData(filterData);
            setFormValues(resetableFields ? formValuesCopy : {})
            setErrorValues({})
        } else {
            onFormSubmit(btn)
        }
    }
    const validateForm = () => {
        if (!dfmForm) {
            return
        }
        let valid = true;
        var formValuesCopy = JSON.parse(JSON.stringify(formValues))
        var errors = {}
        for (let index = 0; index < dfmFieldsList.length; index++) {
            const field = dfmForm['fields'][index]
            if (!field?.hide) {

                if (['label', 'linkAction', 'informationToPlot'].indexOf(field['type']) < 0) {
                    if (field['required']) {
                        if (!formValuesCopy[field['key']]) {
                            errors[field.key] = field.label + ' is required !';
                            valid = false;
                        } else {
                            if (field['keyboardType'] === 'email-address' && !isEmailValid(formValuesCopy[field.key])) {
                                errors[field.key] = "Invalid email format";
                                valid = false;
                            } else if (field['keyboardType'] === 'number-pad') {
                                if (field.valueDigits && !has6DigitNumber(formValuesCopy[field.key], field.valueDigits)) {
                                    errors[field.key] = `Invalid ${field['label']}`;
                                    valid = false;
                                }
                            } else if (field.pattern) {
                                const regex = new RegExp(field.pattern);
                                if (!regex.test(formValuesCopy[field.key])) {
                                    errors[field.key] = `Value should be in ${field.patternExample} format !`
                                    valid = false;

                                }
                            }
                        }
                    }
                }


                if (dfmFieldsList[index]?.type === 'text' && dfmFieldsList[index]?.keyboardType === "number-pad" && !dfmFieldsList[index]?.stringFormat) {
                    formValuesCopy[dfmFieldsList[index].key] = parseFloat(formValuesCopy[dfmFieldsList[index].key])
                }


                if (dfmFieldsList[index]['type'] === 'select' && formValuesCopy[dfmFieldsList[index].key] && dfmFieldsList[index].fullObject) {

                    const optionIndex = dfmFieldsList[index].options.findIndex(element => element[dfmFieldsList[index].bindValue ? dfmFieldsList[index].bindValue : "value"] === formValuesCopy[dfmFieldsList[index].key]);


                    if (optionIndex > -1) {
                        formValuesCopy[dfmFieldsList[index].key] = dfmFieldsList[index].options[optionIndex];
                        if (formValuesCopy[dfmFieldsList[index].key]['_index']) {
                            delete formValuesCopy[dfmFieldsList[index].key]['_index']
                        }
                    }

                }


                if ((field['defaultValue'] || field['defaultValue'] === 0) && !formValuesCopy[dfmFieldsList[index].key]) {
                    formValuesCopy[dfmFieldsList[index].key] = field['defaultValue']
                }
            }
        }


        if (extraOptions?.converstionOfKeys?.length > 0) {
            extraOptions.converstionOfKeys.forEach(element => {
                if (formValuesCopy[element.key]) {
                    if (element.format === 'number') {
                        formValuesCopy[element.key] = parseFloat(formValuesCopy[element.key])
                    } else if (element.format === 'string') {
                        formValuesCopy[element.key] = formValuesCopy[element.key].toString();
                    }
                }
            })
        }

        setErrorValues(errors);

        return { valid, formValuesCopy };
    }


    const validateSetOfFields = (list) => {
        let errors = {};
        for (item of list) {
            let index = dfmFieldsList.findIndex(element => element.key === item.to);
            errors[dfmFieldsList[index].key] = index > -1 && dfmFieldsList[index].required && !formValues[dfmFieldsList[index].key] ? `${dfmFieldsList[index].label} is required !` : ``;
        }
        setErrorValues((prev) => ({ ...prev, ...errors }));
    }
    function has6DigitNumber(inputString, count) {
        // Regular expression to match a string with exactly 6 digits
        const digitRegex = new RegExp(`^\\d{${count}}$`);

        return digitRegex.test(inputString);
    }
    const isEmailValid = (email) => {
        // Regular expression for a valid email address
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    }




    const styles = StyleSheet.create({


    })

    const selectImageFromLibrary = (field) => {
        console.log(formValues?.[field?.key])
        if (formValues?.[field?.key]?.length >= 3) {
            ToasterService.showError(t('maxOf3Images'))
            return
        }
        const options = {
            mediaType: 'photo',
        };

        launchImageLibrary(options, (response) => {
            if (response.assets && response.assets.length > 0) {
                if (((formValues?.[field?.key]?.length || 0) + (response?.assets?.length || 0)) > 3) {
                    ToasterService.showError(t('maxOf3Images'))
                    return
                } else {
                    uploadImage(response.assets, field);
                }
            }
        });
    };

    const uploadImage = (images, field) => {
        const formData = new FormData();

        images.forEach(image => {
            formData.append('images', {
                uri: image.uri,
                type: image.type,
                name: image.fileName || 'image.jpg',
            });

        })
        setTimeout(() => {

            console.log(images)
            console.log(BASE_URL + EndPointConfig.uploadFilesS3)
            axios.post(BASE_URL + EndPointConfig.uploadFilesS3, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((response) => {

                    setFormValues(prev => ({
                        ...prev,
                        [field.key]: Array.isArray(prev[field.key])
                            ? [...prev[field.key], ...response.data.data]
                            : [...response.data.data]
                    }));
                })
                .catch((error) => {
                    console.error('Error uploading image:', error);
                });
        }, 500);
    };


    const stylesUploade = StyleSheet.create({
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // paddingHorizontal: 20,
            marginBottom: 10,
            marginTop: 10
        },
        heading: {
            fontSize: 20,
            fontWeight: 'bold',
        },
        addButton: {
            fontSize: 20,
            color: 'green',
        },
        imagesRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            // paddingHorizontal: 10,
        },
        imageContainer: {
            width: '30%', // Adjust according to your requirements
            marginBottom: 10,
        },
        image: {
            width: '100%',
            height: 150, // Adjust the height as needed
            resizeMode: 'cover',
        },
        iconContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            paddingHorizontal: 5,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
        },
        icon: {
            fontSize: 20,
            color: 'white',
            padding: 5,
        },
    });

    const renderImages = (imagesList) => {
        if (imagesList?.length > 0) {
            return imagesList.map((imageUrl, index) => {
                return (
                    <View key={index} style={stylesUploade.imageContainer}>
                        <Image source={{ uri: imageUrl?.tempURL }} style={stylesUploade.image} resizeMode="cover" />
                        <View style={stylesUploade.iconContainer}>
                            <TouchableOpacity onPress={() => onViewPress(imageUrl?.tempURL)}>
                                <Icon name="eye" style={stylesUploade.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onDeletePress(imageUrl?.tempURL)}>
                                <Icon name="trash" style={stylesUploade.icon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            });
        } else {
            return (<>

                <Text>
                    {
                        t('noImages')}
                </Text>
            </>)
        }
    };

    const onViewPress = (imageUrl) => {
        // Implement view functionality
        console.log('View Image:', imageUrl);
    };

    const onDeletePress = (imageUrl) => {
        // Implement delete functionality
        console.log('Delete Image:', imageUrl);
    };
    return (
        <>

            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} style={{ backgroundColor: colors.navColor, paddingHorizontal: 16, paddingVertical: 5, maxHeight: maxHeight || '', overflow: 'scroll' }}>

                {dfmForm?.fields && dfmForm?.fields?.length > 0 && dfmForm?.fields?.map((field, fieldIndex) => {
                    return (
                        <View key={'' + fieldIndex} >
                            {field.type === 'label' && !field.hide && <>
                                {field.heading &&
                                    <Text styles={[{ fontWeight: 'bold', fontSize: 15 }, field.configurations || {}]} >{field.heading}</Text>
                                }
                                {field.subText &&
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        {field.fillFormFromPrevValues &&
                                            <Checkbox status={formValues?.[field.key] ? formValues[field.key] ? 'checked' : 'unchecked' : 'unchecked'}
                                                onPress={() => {
                                                    let formValuesCP = formValues;
                                                    formValuesCP[field.key] = formValuesCP[field.key] ? !formValuesCP[field.key] : true;
                                                    if (formValuesCP[field.key] && field?.fillFormFromPrevValues?.length > 0) {
                                                        for (let index = 0; index < field.fillFormFromPrevValues.length; index++) {
                                                            // ALONG WITH VALUES, need to set options if it is select
                                                            formValuesCP[field.fillFormFromPrevValues[index].to] = formValuesCP[field.fillFormFromPrevValues[index].from];
                                                        }
                                                        validateSetOfFields(field?.fillFormFromPrevValues);
                                                    }

                                                    setFormValues((prev) => ({ ...prev, ...formValuesCP }));
                                                    if (field.emitInstantChange) {
                                                        return onFormSubmit({ target: { name: field.key } }, field);
                                                    }
                                                }}
                                            />
                                        }
                                        <Text>{field.subText}</Text>
                                    </View>
                                }
                            </>
                            }

                            {field.type === 'informationToPlot' && !field.hide && htmlContent?.[field.key] &&
                                <View>{htmlContent?.[field.key]}</View>

                            }

                            {field.type === 'text' && !field.hide &&

                                <>

                                    <TextInput

                                        style={[{ backgroundColor: colors.backgroundColor, marginTop: 4, }]} label={field.label}
                                        value={formValues?.[field.key] || ''}
                                        key={field.key}
                                        mode="outlined"
                                        disabled={field?.disabled || false}
                                        placeholder={field.label}

                                        onChangeText={(event) => handleInputChange(event, field)}
                                        keyboardType={field.keyboardType ? field.keyboardType : 'default'}
                                        right={field.icon && <TextInput.Icon icon={field.icon} />}
                                        placeholderTextColor={colors.textColor}
                                        textColor={colors.textColor}
                                        activeOutlineColor={colors.borderColor}
                                        outlineColor={colors.borderColor}
                                        activeUnderlineColor={colors.borderColor}
                                        activeTextColor={colors.borderColor}

                                    />
                                </>
                            }

                            {field.type === 'linkAction' && !field.hide &&
                                <TouchableOpacity onPress={() => {

                                    onFormSubmit({
                                        type: 'clickAction',
                                        field
                                    })
                                }}>


                                    <Text style={{ color: colors.textColor, ...field?.configuration }}>{field.label}</Text>
                                </TouchableOpacity>
                            }

                            {
                                field.type === 'imageUpload' && !field.hide &&

                                <>
                                    <View style={stylesUploade.header}>
                                        <Text style={stylesUploade.heading}>{field?.label || ''}</Text>
                                        <TouchableOpacity onPress={() => selectImageFromLibrary(field)}>
                                            <Icon name="plus" style={stylesUploade.addButton} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={stylesUploade.imagesRow}>{renderImages(formValues?.[field?.key] || [])}</View>



                                </>
                            }

                            {field.type === 'select' && !field.hide &&
                                <>

                                    <View style={stylesSelect.container}>
                                        <Text style={[stylesSelect.label,]}>
                                            {field.label}
                                        </Text>
                                        <Dropdown
                                            style={[stylesSelect.dropdown]}
                                            placeholderStyle={stylesSelect.placeholderStyle}
                                            selectedTextStyle={stylesSelect.selectedTextStyle}
                                            inputSearchStyle={stylesSelect.inputSearchStyle}
                                            iconStyle={stylesSelect.iconStyle}
                                            data={field?.options || []}
                                            showsVerticalScrollIndicator={false}
                                            search
                                            key={field.key}
                                            maxHeight={300}
                                            labelField={field?.bindLabel ? field.bindLabel : "label"}
                                            disable={field?.disabled || false}
                                            valueField={field?.bindValue ? field.bindValue : "value"}
                                            mode="outlined"
                                            placeholder={(field?.hideSelectKey ? ' ' : 'Select ') + field.label}
                                            searchPlaceholder="Search..."
                                            value={formValues[field.key] || ""}
                                            onChange={item => {

                                                let values = JSON.parse(JSON.stringify(formValues));
                                                setErrorValues((prev) => ({ ...prev, [field.key]: `` }));

                                                values[field.key] = item[field?.bindValue ? field.bindValue : "value"];

                                                if (field?.onChangeMakeValuesEmpty?.length > 0) {

                                                    field.onChangeMakeValuesEmpty.forEach(element => {
                                                        values[element] = ''
                                                    })
                                                }
                                                if (field?.extraStoringFields?.length > 0) {
                                                    field.extraStoringFields.forEach(element => {
                                                        if (element?.format === 'string') {
                                                            values[element?.to] = item[element?.from].toString()

                                                        } else {
                                                            values[element?.to] = item[element?.from]
                                                        }
                                                    })
                                                }
                                                setFormValues(values)
                                                let objIndex = filterData?.findIndex(item => item.key == field.key);
                                                if (objIndex >= 0) {
                                                    filterData[objIndex].value = [values[field.key]]
                                                    filterData[objIndex].valueName = [item[field?.bindLabel ? field.bindLabel : "label"]]
                                                }
                                                else {
                                                    filterData = [...filterData, {
                                                        type: field.type,
                                                        key: field.key,
                                                        label: field.label,
                                                        value: [values[field.key]],
                                                        valueName: [item[field?.bindLabel ? field.bindLabel : "label"]]
                                                    }];
                                                }
                                                setFilterData(filterData);

                                                // console.log(item)

                                                if (field.emitInstantChange) {

                                                    return onFormSubmit({ target: { name: field.key, value: item } }, field, values);
                                                }
                                            }}
                                        // data={data}
                                        // search
                                        // maxHeight={300}
                                        // labelField="label"
                                        // valueField="value"
                                        // placeholder={!isFocus ? 'Select item' : '...'}
                                        // searchPlaceholder="Search..."
                                        // value={value}
                                        // onFocus={() => setIsFocus(true)}
                                        // onBlur={() => setIsFocus(false)}
                                        // onChange={item => {
                                        //     setValue(item.value);
                                        //     setIsFocus(false);
                                        // }}
                                        // renderLeftIcon={() => (
                                        //     <AntDesign
                                        //         style={styles.icon}
                                        //         color={isFocus ? 'blue' : 'black'}
                                        //         name="Safety"
                                        //         size={20}
                                        //     />
                                        // )}
                                        />
                                    </View>

                                    {/* 
                                    <View style={{ ...stylesSelect.container, backgroundColor: colors.navColor, borderColor: colors.borderColor }}>
                                        {(formValues[field.key] || formValues[field.key] == 0) && <Text styles={{ ...stylesSelect.label, backgroundColor: colors.backgroundColor, color: colors.heading }}>{field?.label}</Text>
                                        }
                                        <Dropdown
                                            style={{ ...stylesSelect.dropdown, backgroundColor: colors.backgroundColor, borderColor: colors.borderColor }}
                                            containerStyle={{ backgroundColor: colors.backgroundColor }}
                                            itemContainerStyle={{ backgroundColor: colors.backgroundColor, }}
                                            itemTextStyle={{ backgroundColor: colors.backgroundColor, }}
                                            activeColor={{ backgroundColor: colors.chipBackground }}
                                            placeholderStyle={{ ...stylesSelect.placeholderStyle }}
                                            selectedTextStyle={{ ...stylesSelect.selectedTextStyle, color: colors.textColor }}
                                            inputSearchStyle={{ ...stylesSelect.inputSearchStyle, color: colors.heading, backgroundColor: colors.navColor }}
                                            iconStyle={field?.disabled ? {} : { ...stylesSelect.iconStyle, color: colors.heading, backgroundColor: colors.navColor }}
                                            iconColor={field?.disabled ? 'transparent' : colors?.heading}
                                            data={field?.options || []}
                                            showsVerticalScrollIndicator={false}
                                            search
                                            key={field.key}
                                            maxHeight={300}
                                            labelField={field?.bindLabel ? field.bindLabel : "label"}
                                            disable={field?.disabled || false}
                                            valueField={field?.bindValue ? field.bindValue : "value"}
                                            mode="outlined"
                                            placeholder={'Select ' + field.label}
                                            searchPlaceholder="Search..."
                                            value={formValues[field.key] || ""}
                                            onChange={item => {

                                                let values = JSON.parse(JSON.stringify(formValues));
                                                setErrorValues((prev) => ({ ...prev, [field.key]: `` }));

                                                values[field.key] = item[field?.bindValue ? field.bindValue : "value"];

                                                if (field?.onChangeMakeValuesEmpty?.length > 0) {

                                                    field.onChangeMakeValuesEmpty.forEach(element => {
                                                        values[element] = ''
                                                    })
                                                }
                                                if (field?.extraStoringFields?.length > 0) {
                                                    field.extraStoringFields.forEach(element => {
                                                        if (element?.format === 'string') {
                                                            values[element?.to] = item[element?.from].toString()

                                                        } else {
                                                            values[element?.to] = item[element?.from]
                                                        }
                                                    })
                                                }
                                                setFormValues(values)
                                                let objIndex = filterData?.findIndex(item => item.key == field.key);
                                                if (objIndex >= 0) {
                                                    filterData[objIndex].value = [values[field.key]]
                                                    filterData[objIndex].valueName = [item[field?.bindLabel ? field.bindLabel : "label"]]
                                                }
                                                else {
                                                    filterData = [...filterData, {
                                                        type: field.type,
                                                        key: field.key,
                                                        label: field.label,
                                                        value: [values[field.key]],
                                                        valueName: [item[field?.bindLabel ? field.bindLabel : "label"]]
                                                    }];
                                                }
                                                setFilterData(filterData);

                                                // console.log(item)

                                                if (field.emitInstantChange) {

                                                    return onFormSubmit({ target: { name: field.key, value: item } }, field, values);
                                                }
                                            }}
                                        />
                                    </View> */}
                                </>
                            }




                            {errorValues && errorValues[field.key] && field.type !== 'uploadDocuments' &&
                                <HelperText type="error" visible={errorValues[field.key]}>
                                    {errorValues[field.key]}
                                </HelperText>
                            }
                        </View>
                    )
                })}

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", marginTop: 10, marginBottom: 5, ...dfmForm?.bottomConfigurations || {} }}>
                    {dfmForm?.bottomActions?.length > 0 && dfmForm.bottomActions.map((btn, btnIndex) => {
                        return (
                            <Button key={'' + btnIndex} style={[{
                                width: (100 / dfmForm?.bottomActions?.length || 1) - (dfmForm.bottomActions && dfmForm.bottomActions.length > 1 ? 1 : 0) + '%', margin: 1,
                                backgroundColor: btn.buttonType && colors[btn.buttonType] ? colors[btn.buttonType] : colors.buttonBackground,
                                color: btn.buttonType && colors[btn.buttonType + 'Text'] ? colors[btn.buttonType + 'Text'] : colors.buttonText,

                            }, { ...btn?.configuration }]} icon={btn.icon} mode="contained"
                                onPress={() => footerButtonsHandeler(btn)}>
                                {btn.label}
                            </Button>
                        )
                    })
                    }
                </View>

            </ScrollView>


        </>
    )
})

export default DFM
const stylesSelect = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
        paddingHorizontal: 0
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 6,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});