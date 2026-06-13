import {  StatusBar,  View } from "react-native"
import StyledText from "./StyledText"
import {Image} from 'expo-image'
import { img } from "@/assets/constants/img"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useTheme } from "@/contex/theme-context"



const Header = () => {
    const router = useRouter()
     const insets = useSafeAreaInsets();
    const { isDark, theme, toggleTheme } = useTheme();
    
      
    return (
    <View className="w-full min-h-[70px] flex-row  justify-between items-center pl-5 pr-5 z-10 bg-primary-comp" 
    style={{
        boxShadow: `0px 4px 4px 0px rgba(0, 0, 0, 0.25)`,
        paddingTop: insets.top
    }}
   >

        <StatusBar barStyle={isDark? 'light-content': "dark-content"} />
        <Image source={isDark ? img.logoHeaderLight : img.logoHeaderDark}  contentFit="cover" style={{width: 130, height: 30 }} className="border"
        onError={(e:any) => console.log('LOAD ERROR:', e.nativeEvent.error)}
        onLoadEnd={()=> console.log('HEADER LOADED')} />
   
    </View>)
}

export default Header