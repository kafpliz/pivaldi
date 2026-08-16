import { icons } from "@/assets/constants/icon"
import { ERoute } from "@/assets/enum/route"
import { TabBarItem } from "@/assets/interfaces/components"
import { useLanguage } from "@/contex/language.context"
import { useRouter, useSegments } from "expo-router"
import { Pressable, View } from "react-native"
import {Image,} from 'expo-image'
import { useTheme } from "@/contex/theme-context"

export const TabBar = () => {
    const router = useRouter()
    const segments = useSegments()
    const {isDark} = useTheme()
    const { t } = useLanguage()

    const tabs: TabBarItem[] = [
        { name: 'settings', route: ERoute.user, label: t('tabs.profile'), icon:isDark ? icons.settingsLight :  icons.settings, 
            tabActive: icons.settings },
        { name: 'home', route: ERoute.index, label: t('tabs.home'), icon: isDark ? icons.homeLight : icons.home,
             tabActive: icons.home },
        { name: 'notification', route: ERoute.notification, label: t('tabs.notifications'), icon:isDark ? icons.bellLight :  icons.bell,
             tabActive: icons.bell },
    ]
 
    const isActive = (tab: TabBarItem) => {
        const currentPath = segments.join('/')
        

        
        if (tab.name === 'home') {
            return currentPath === '' ||
                currentPath === '(tabs)' ||
                currentPath.startsWith('(tabs)/(home)')
        }
    
        if (tab.name === 'notification') {
            return segments[1] === 'notification'
        }

        if (tab.name === 'settings') {
           return currentPath === '(settings)' ||
                currentPath.startsWith("(tabs)/(settings)")
        }

    }
       const handlePress = (tab: TabBarItem) => {
             const currentPath = segments.join('/')
        console.log(isActive(tab) ,currentPath, currentPath.length == 2);
             
        if (isActive(tab) && (currentPath == "(tabs)/(home)" || currentPath == "(tabs)/(settings)"  || currentPath == "(tabs)/notification" )) {
   
            return
        }
        
    
        router.push(tab.route as any)
    }

    return (
        <View className="flex-row bg-primary-comp h-[70px]"  style={{
                boxShadow: `0px -4px 4px 0px rgba(0, 0, 0, 0.09)`
            }}>
            {tabs.map((tab) => (
                <Pressable key={tab.name} onPress={()=> handlePress(tab)} className={["flex-1 justify-center items-center", 
                `${isActive(tab) ? 'bg-tab-active' : ''}`].join(' ')} accessibilityLabel={tab.label}>
                    <Image source={isActive(tab) ? tab.tabActive : tab.icon}  style={{width: 27, aspectRatio: 1 / 1 }} contentFit="contain" />

                </Pressable>
            ))}
        </View>
    )
}