import BackBtn from "@/components/backBtn"
import StyledText from "@/components/StyledText"
import { Bar } from "@/components/utils"
import { Alert, Modal, ScrollView, TextInput, TouchableOpacity, View } from "react-native"
import MaskInput from 'react-native-mask-input';

import { useEffect, useState } from "react";
import { useApi } from "@/contex/api.context"
import { useLanguage } from "@/contex/language.context";
import { transformRestoName } from "@/assets/utils/script"
import { apiClient } from "@/services/api.client";
import { IRes } from "@/assets/interfaces/context";
import { useTheme } from "@/contex/theme-context";


const Input = ({ title, type, onValidationChange }: { title: string, type: 'phone' | 'name', onValidationChange: (text: string) => void; }) => {
    const [value, setValue] = useState('')
    const isPhone = type === 'phone'
    const {isDark} = useTheme()
    const phoneMask = [
        '+', '7', ' ', '(', /\d/, /\d/, /\d/, ')', ' ',
        /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/
    ]


    return (
        <View className="w-full">
            <StyledText className="text-active pl-5" fontFamily='berlin' style={{ fontSize: 16, fontWeight: 400, }} >{title}</StyledText>
            {isPhone ? (
                <MaskInput
                    className="w-full h-14 bg-active/15 rounded-xl pl-5 pr-5 text-primary"
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={(masked, unmasked) => {

                        setValue(masked)
                        onValidationChange(masked)

                    }}
                    mask={phoneMask}
                    placeholder="+7 (___) ___-__-__"
                    placeholderTextColor={isDark ? 'rgba(217, 211, 198, 1)' : 'rgba(67, 48, 20, 1)'}
                />
            ) : (
                <TextInput
                    className="w-full h-14 bg-active/15 rounded-xl pl-5 pr-5 text-primary"
                    keyboardType="default"
                    value={value}
                    onChangeText={(text) => {
                        setValue(text)
                        onValidationChange(text)
                    }}
                />
            )}
        </View>
    )
}


const Select = ({ onValidationChange }: { onValidationChange: (text: string) => void; }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedResto, setSelectedResto] = useState<number>();

    const { restaurants } = useApi()
    const { t } = useLanguage()

    const resto = restaurants

    const selectedRestoItem = resto.find(item => item.id === selectedResto);

    useEffect(() => {
        if (selectedResto) {
            const selectedLabel = selectedRestoItem ? transformRestoName(selectedRestoItem.name, selectedRestoItem.isFranchise) : t('vacancies.chooseRestaurant');
            onValidationChange(selectedLabel)
        }
    }, [selectedResto])

    const selectedLabel = selectedRestoItem ? transformRestoName(selectedRestoItem.name, selectedRestoItem.isFranchise) : t('vacancies.chooseRestaurant');
    const boxShadow = '0px -4px 4px 0px rgba(0, 0, 0, 0.12)'

    return (
        <>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="w-full h-14 bg-active/15 rounded-xl justify-center px-5"
            >
                <StyledText className="text-primary" style={{ fontSize: 16 }}>
                    {selectedLabel}
                </StyledText>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                statusBarTranslucent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={{ flex: 1, justifyContent: 'flex-end' }}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View className="bg-primary-modal  rounded-l-2xl rounded-r-2xl" style={{
                        maxHeight: '70%',

                        boxShadow,
                    }}>
                        <View style={{
                            padding: 16,
                            alignItems: 'center'
                        }}>
                            <StyledText className="text-primary" style={{ fontSize: 18, fontWeight: '600' }}>{t('vacancies.chooseRestaurantTitle')}</StyledText>
                        </View>

                        <ScrollView>
                            {resto.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className="bg-primary-modal"
                                    style={{
                                        padding: 16,
                                    }}
                                    onPress={() => {
                                        setSelectedResto(item.id);
                                        setModalVisible(false);
                                    }}
                                >
                                    <StyledText className="text-primary capitalize" fontFamily={selectedResto == item.id ? 'm-bold' : 'm-regular'} style={{
                                        fontSize: 20,
                                        fontWeight: 400,
                                        textTransform: 'capitalize'
                                    }}>
                                        {transformRestoName(item.name, item.isFranchise)}
                                    </StyledText>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const Header = () => {
    const { t } = useLanguage()

    return (
        <View className="w-full gap-3">
            <BackBtn name={t('vacancies.title')} />
            <StyledText style={{ fontSize: 22, fontWeight: 600 }} className="text-user-text-1 text-justify" fontFamily="m-semibold" >{t('vacancies.intro')}</StyledText>
        </View>
    )
}

const Vacancies = () => {
    const { t } = useLanguage()
    const [selectResto, setSelectResto] = useState('')
    const [phone, setPhone] = useState('')
    const [name, setName] = useState('')
    const [hasError, setHasError] = useState(false)
    const [errMessage, setErrMessage] = useState('')
    const [isSend, setIsSend] = useState(false)
    const validateForm = () => {

        if (!selectResto || selectResto.length === 0) {
            setHasError(true)
            setErrMessage(t('validation.restaurantRequired'))
            return false
        }

        if (!name || name.trim().length === 0) {
            setHasError(true)
            setErrMessage(t('validation.firstNameRequired'))
            return false
        }


        const cleanPhone = phone.replace(/[^\d+]/g, '')
        const digits = cleanPhone.replace(/\D/g, '')


        if (!phone || digits.length !== 11 || !digits.startsWith('7')) {
            setHasError(true)
            setErrMessage(t('validation.phoneInvalid'))
            return false
        }

        setHasError(false)
        setErrMessage('')
        return true
    }


    const send = async () => {
        if (validateForm()) {
            const obj = {
                phone: phone,
                name: name,
                resto: selectResto,
                type: 'hr',
            }
           setIsSend(true)
           const res =  await apiClient.post<IRes>('email-sletter/hr', obj)
           if (res.statusCode == 200) {
            setIsSend(false)
            Alert.alert(t('common.sentTitle'), t('common.requestSent'), [
                {
                    text: t('common.ok'),
                    "style" : 'default',
                    
                }
            ])
           }
           
        }
    }

    return (
        <View className="bg-primary flex-1">
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingTop: 20, paddingBottom: 20 }}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false} bounces={false}>
                <View className="pl-5 pr-5 flex-1 justify-between">
                    <View className="gap-10 items-center">
                        <Header />

                        <View className="w-full gap-4">
                            <Input title={t('vacancies.name')} type="name" onValidationChange={(text) => setName(text)} />
                            <Input title={t('vacancies.phone')} type="phone" onValidationChange={(text) => setPhone(text)} />
                            <Select onValidationChange={(text) => setSelectResto(text)} />
                            {hasError && <StyledText className="text-red-600" fontFamily="berlin" style={{
                                fontSize: 14,
                                fontWeight: 400
                            }} >{errMessage}</StyledText>}
                        </View>

                        <TouchableOpacity className="w-44 h-14 rounded-xl bg-active justify-center items-center" onPress={send} disabled={isSend} >
                            <StyledText style={{ fontWeight: 400, fontSize: 20 }} className="text-white" fontFamily="berlin" >{t('common.submit')}</StyledText>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <Bar />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default Vacancies