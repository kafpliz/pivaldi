import { icons } from "@/assets/constants/icon";
import { openLink } from "@/assets/utils/script";
import StyledText from "@/components/StyledText";
import { Bar } from "@/components/utils";
import { useLanguage } from "@/contex/language.context";
import { useTheme } from "@/contex/theme-context";
import { Image } from "expo-image";
import { Linking, Modal, ScrollView, TouchableOpacity, View } from "react-native";
import * as Notifications from 'expo-notifications';
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";


interface SelectOption {
    key: string;
    label: string;
}

const SelectModal = ({
    visible,
    title,
    options,
    selectedKey,
    onSelect,
    onClose,
}: {
    visible: boolean;
    title: string;
    options: SelectOption[];
    selectedKey: string;
    onSelect: (key: string) => void;
    onClose: () => void;
}) => {
    const boxShadow = '0px -4px 4px 0px rgba(0, 0, 0, 0.12)'

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            statusBarTranslucent={true}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={{ flex: 1, justifyContent: 'flex-end' }}
                activeOpacity={1}
                onPress={onClose}
            >
                <View className="bg-primary-modal  rounded-l-2xl rounded-r-2xl" style={{
                    maxHeight: '70%',
                    boxShadow,
                }}>
                    <View style={{
                        padding: 16,
                        alignItems: 'center'
                    }}>
                        <StyledText className="text-primary" style={{ fontSize: 18,  }}>{title}</StyledText>
                    </View>

                    <ScrollView>
                        {options.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                className="bg-primary-modal"
                                style={{
                                    padding: 16,
                                }}
                                onPress={() => {
                                    onSelect(item.key);
                                    onClose();
                                }}
                            >
                                <StyledText className="text-primary capitalize" style={{
                                    fontSize: 20,
                                    fontWeight: selectedKey === item.key ? 700 : 400,
                                    textTransform: 'capitalize'
                                }}>
                                    {item.label}
                                </StyledText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const BarAction = () => {
    const { t, language, setLanguage } = useLanguage()
    const { theme, setTheme } = useTheme()
    const light = theme === 'light'
    const [notifGranted, setNotifGranted] = useState(false)
    const [activeModal, setActiveModal] = useState<null | 'lang' | 'theme'>(null)

    useFocusEffect(
        useCallback(() => {
            const checkPermissions = async () => {
                const { status } = await Notifications.getPermissionsAsync()
                setNotifGranted(status === 'granted')
            }
            checkPermissions()
        }, [])
    )

    const toggleNotifications = async () => {
        if (notifGranted) {
            Linking.openSettings()
        } else {
            const perms = await Notifications.getPermissionsAsync()
            if (perms.status === 'undetermined' || !perms.status) {
                const { status } = await Notifications.requestPermissionsAsync()
                setNotifGranted(status === 'granted')
                if (status !== 'granted') {
                    Linking.openSettings()
                }
            } else {
                Linking.openSettings()
            }
        }
    }

    const langOptions: SelectOption[] = [
        { key: 'ru', label: 'Русский' },
        { key: 'en', label: 'English' },
    ]

    const themeOptions: SelectOption[] = [
        { key: 'light', label: t('profile.light') },
        { key: 'dark', label: t('profile.dark') },
    ]

    const langTitle = language === 'ru' ? 'Выберите язык' : 'Choose a language'
    const themeTitle = language === 'ru' ? 'Выберите тему' : 'Choose a theme'

    return (

        <View className="w-full gap-3 min-h-[52px]  ">
            <TouchableOpacity className="flex-1 bg-btn-1 rounded-xl justify-center items-center flex-row gap-2 min-h-[52px]" onPress={() => setActiveModal('lang')} activeOpacity={1} >

                <StyledText className="text-white" style={{
           
                    fontSize: 20
                }} >{t('profile.language')}</StyledText>
                <Image source={icons.lang} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 bg-active rounded-xl justify-around items-center flex-row relative min-h-[52px]" onPress={() => setActiveModal('theme')} activeOpacity={1} >
                <StyledText className="text-white" style={{
                 
                    fontSize: 20
                }} >{light ? t('profile.light') : t('profile.dark')}</StyledText>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 bg-btn-1 rounded-xl justify-around items-center flex-row relative min-h-[52px]" onPress={toggleNotifications} activeOpacity={1} >
                <StyledText className="text-white" style={{
                  
                    fontSize: 20
                }} >{notifGranted ? t('settings.notification_off') : t('settings.notification_on')}</StyledText>
            </TouchableOpacity>

            <SelectModal
                visible={activeModal === 'lang'}
                title={langTitle}
                options={langOptions}
                selectedKey={language}
                onSelect={(key) => setLanguage(key as 'ru' | 'en')}
                onClose={() => setActiveModal(null)}
            />

            <SelectModal
                visible={activeModal === 'theme'}
                title={themeTitle}
                options={themeOptions}
                selectedKey={theme}
                onSelect={(key) => setTheme(key as 'light' | 'dark')}
                onClose={() => setActiveModal(null)}
            />

        </View>
    )
}


const Links = () => {
    const { t } = useLanguage()
    const links = [
        { link: 'https://t.me/pivaldiru', icon: icons.tg, color: 'bg-user-link-1', name: t('social.telegram') },
        { link: 'https://vk.ru/pivaldi', icon: icons.vk, color: 'bg-user-link-2', name: t('social.vk') },
        { link: 'https://max.ru/pivaldi', icon: icons.max, color: 'bg-user-link-3', name: t('social.max') },
    ]
    return (
        <View className="w-full h-[60px] gap-3 justify-between flex-row">
            {links && links.map((item, idx) => (
                <TouchableOpacity key={idx} className={["flex-1 rounded-xl justify-center items-center bg-user", item.color].join(' ')} onPress={() => openLink(item.link, item.name, {
                    errorTitle: t('link.openFailedTitle'),
                    cannotOpen: t('link.cannotOpen', { title: item.name }),
                    openFailed: t('link.openFailed'),
                })}>
                    <Image source={item.icon} contentFit="contain" style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
            ))}
        </View>
    )
}


const Profile = () => {
    const { t } = useLanguage()
    return (
        <View className="flex-1 bg-primary">
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingTop: 20, paddingBottom: 20 }}
                showsVerticalScrollIndicator={false} bounces={false}>
                <View className="flex-1 pl-5 pr-5 gap-6 " >
                    <Bar />
                    <View className="w-full">
                        <StyledText fontFamily={'m-semibold'} className="text-user-link-2" style={{ fontSize: 22, textAlign: 'center', fontWeight: 600, }}>
                            {t('profile.thanks')}
                        </StyledText>
                    </View>
                    <BarAction />
                    <View className="flex-1"></View>
                    <Links />
                </View>
            </ScrollView>
        </View>
    );
}


export default Profile
