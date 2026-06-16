import { icons } from "@/assets/constants/icon"
import BackBtn from "@/components/backBtn"
import StyledText from "@/components/StyledText"
import { Bar } from "@/components/utils"
import { useApi } from "@/contex/api.context"
import { useLanguage } from "@/contex/language.context"
import { Image } from "expo-image"
import { useState } from "react"
import { Alert, Modal, ScrollView, TextInput, TouchableOpacity, View } from "react-native"
import MaskInput from "react-native-mask-input"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import CountryPicker, {
    type Country,
    type CountryCode,
} from "react-native-country-picker-modal";

import { apiClient } from "@/services/api.client"
import { IRes } from "@/assets/interfaces/context"
import { useTheme } from "@/contex/theme-context"
import CustomImage from "@/components/CustomImg"


const Input = ({ title, type, onValidationChange }: { title: string, type: 'phone' | 'text' | 'email', onValidationChange: (text: string) => void; }) => {
    const [value, setValue] = useState("");
    const [countryCode, setCountryCode] = useState<CountryCode>("RU");
    const [callingCode, setCallingCode] = useState("7");
    const { isDark } = useTheme()

    const isPhone = type === 'phone'
    const getPhoneMask = (callingCode: string) => {
        if (callingCode === "375") {
            return [
                "(", /\d/, /\d/, ")", " ",
                /\d/, /\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/,
            ];
        }

        return [
            "(", /\d/, /\d/, /\d/, ")", " ",
            /\d/, /\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/,
        ];
    };


    return (
        <View className="flex-1">
            <StyledText className="text-active pl-5" fontFamily='berlin' style={{ fontSize: 16, fontWeight: 400, }} >{title}</StyledText>
            {isPhone ? (
                <View className="w-full h-14 bg-active/15 rounded-xl flex-row items-center overflow-hidden">
                    <View className="h-full px-3 justify-center border-r border-active/20">
                        <CountryPicker
                            countryCode={countryCode}
                            withFilter
                            withFlag
                            withEmoji
                            withCallingCode
                            withCallingCodeButton
                            preferredCountries={["RU", "BY", "KZ"]}
                            onSelect={(country: Country) => {
                                setCountryCode(country.cca2);
                                setCallingCode(country.callingCode[0] ?? "7");
                                setValue("");
                                onValidationChange("");
                            }}
                            theme={{
                                onBackgroundTextColor: isDark ? 'rgba(217, 211, 198, 1)' : 'rgba(67, 48, 20, 1)'
                            }}
                        />
                    </View>

                    <MaskInput
                        style={{
                            flex: 1,
                            height: "100%",
                            paddingHorizontal: 12,
                        }}
                        keyboardType="phone-pad"
                        value={value}
                        className="text-primary"
                        onChangeText={(masked, unmasked) => {
                            setValue(masked);
                            onValidationChange(`${callingCode}${unmasked}`);
                        }}
                        mask={getPhoneMask(callingCode)}
                        placeholder={callingCode === "375" ? "(__) ___-__-__" : "(___) ___-__-__"}
                        placeholderTextColor={isDark ? 'rgba(217, 211, 198, 1)' : 'rgba(67, 48, 20, 1)'}

                    />
                </View>
            ) : (
                <TextInput
                    className="w-full h-14 bg-active/15 rounded-xl pl-5 pr-5 text-primary"
                    keyboardType={type === 'email' ? 'email-address' : 'default'}
                    autoCapitalize={type === 'email' ? 'none' : 'sentences'}
                    autoCorrect={type !== 'email'}
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


const ModalContent = ({ closeModal }: { closeModal: (close: boolean) => void; }) => {
    const { top } = useSafeAreaInsets()
    const { t } = useLanguage()
    const [hasError, setHasError] = useState(false)
    const [errMessage, setErrMessage] = useState('')
    const [isSend, setIsSend] = useState(false)
    const [phone, setPhone] = useState('')
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [city, setCity] = useState('')
    const [email, setEmail] = useState('')

    const validateForm = () => {

        if (!name || name.trim().length === 0) {
            setHasError(true)
            setErrMessage(t('validation.firstNameRequired'))
            return false
        }
        if (!lastName || lastName.trim().length === 0) {
            setHasError(true)
            setErrMessage(t('validation.lastNameRequired'))
            return false
        }


        const cleanPhone = phone.replace(/[^\d+]/g, '')
        const digits = cleanPhone.replace(/\D/g, '')

        if (!phone || digits.length < 5) {
            setHasError(true)
            setErrMessage(t('validation.phoneInvalid'))
            return false
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setHasError(true)
            setErrMessage(t('validation.emailInvalid'))
            return false
        }

        if (!city || city.trim().length === 0) {
            setHasError(true)
            setErrMessage(t('validation.cityRequired'))
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
                lastName: lastName,
                email: email,
                city: city,
                type: 'fr',
            }

            setIsSend(true)
            const res = await apiClient.post<IRes>('email-sletter/fr', obj)
            if (res.statusCode == 200) {
                setIsSend(false)
                Alert.alert(t('common.sentTitle'), t('common.requestSent'), [
                    {
                        text: t('common.close'),
                        "style": 'default',
                        onPress: () => closeModal(true)
                    }
                ])

            }

        }
    }


    return (
        <View className="flex-1 bg-primary">
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ flexGrow: 1, gap: 15, padding: 20, paddingTop: top + 20 }}>
                <View className="w-full h-[14px] items-end">
                    <TouchableOpacity onPress={() => closeModal(true)}>
                        <Image source={icons.cross_1} style={{ width: 14, height: 14 }} contentFit="cover" />
                    </TouchableOpacity>
                </View>
                <Bar />

                <View className="flex-1 gap-10 justify-center">
                    <View className="w-full min-h-2 gap-4">
                        <View className="flex-1 flex-row gap-5">
                            <Input type="text" title={t('form.firstName')} onValidationChange={(text) => setName(text)} />
                            <Input type="text" title={t('form.lastName')} onValidationChange={(text) => setLastName(text)} />
                        </View>

                        <Input type="phone" title={t('form.phone')} onValidationChange={(text) => setPhone(text)} />
                        <Input type="email" title={t('form.email')} onValidationChange={(text) => setEmail(text)} />
                        <Input type="text" title={t('form.cityForFranchise')} onValidationChange={(text) => setCity(text)} />
                        {hasError && <StyledText className="text-red-600" fontFamily="berlin" style={{
                            fontSize: 14,
                            fontWeight: 400
                        }} >{errMessage}</StyledText>}
                    </View>
                    <View className="w-full items-center">
                        <TouchableOpacity className="bg-active w-44 h-16 rounded-xl justify-center items-center" onPress={send} disabled={isSend} >
                            <StyledText fontFamily="berlin" style={{
                                fontSize: 20,
                                fontWeight: 700
                            }} >{t('common.submit')}</StyledText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}


const List = () => {
    const { franchises } = useApi()


    return (
        <View className="w-full gap-3">
            {franchises && franchises.map((item, idx) => (
                <View key={idx} className="w-full ">
                  
                   <CustomImage uri={item.photo} border={12} type={'simple'} style={{ width: '100%', aspectRatio: 16/9 }} />
                </View>
            ))}
        </View>
    )
}

const Header = () => {
    const { t } = useLanguage()

    return (
        <View className="gap-4">
            <BackBtn name={t('franchise.title')} />
            <Bar />
        </View>
    )
}

const Franchises = () => {
    const { t } = useLanguage()
    const [open, setOpen] = useState(false)



    const handleOpenModal = () => {
        setOpen(true)
    }
    const handleCloseModal = (close: boolean) => {

        setOpen(false)
    }


    return (
        <View className="bg-primary flex-1">
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingTop: 20, paddingBottom: 20 }}
                showsVerticalScrollIndicator={false} bounces={false}>
                <View className="pl-5 pr-5 gap-5 items-center">
                    <Header />
                    <List />
                    <View className="gap-3 w-full items-center">
                        <TouchableOpacity className="w-64 h-24 justify-center items-center bg-user-btn-1 rounded-xl" onPress={handleOpenModal}  >
                            <StyledText style={{ fontSize: 24, }} className="text-white text-center" >{t('franchise.leaveRequest')}</StyledText>
                        </TouchableOpacity>
                        <StyledText style={{ fontSize: 14,  textAlign: 'justify' }} >{t('franchise.disclaimer')}</StyledText>
                    </View>
                </View>
            </ScrollView>
            <Modal visible={open} statusBarTranslucent={true}  >
                <ModalContent closeModal={handleCloseModal}  />
            </Modal>
        </View>

    )
}


export default Franchises