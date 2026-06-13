import StyledText from "@/components/StyledText"
import { useApi } from "@/contex/api.context"
import { useLanguage } from "@/contex/language.context"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { View } from "react-native"
import { WebView } from 'react-native-webview'

const Tour = () => {
    const { t } = useLanguage()
    const [isReady, setIsReady] = useState(false)
    const {restoId} = useLocalSearchParams<{restoId:string}>()
    const [hasErr, setHasErr] = useState(false)
    const [tourLink, setTourLink]  = useState('')

    const {restaurants} = useApi()

    useEffect(()=>{
        if(restoId){
            const resto =restaurants.filter(item=> item.id == Number(restoId)).shift()
            if(resto){
                setTourLink(resto.tour3d)
                setIsReady(true)
            } else {
                setHasErr(true)
            }
            
            
        }
    }, [restoId])

    if(hasErr){
        return (
              <View className="bg-primary justify-center items-center pl-5 pr-5" style={{flex:1}} >
                <StyledText>{t('common.tryAgainLater')}</StyledText>
              </View>
        )
    }

    return (
        <View className="bg-primary" style={{flex:1}} >
            {isReady && <WebView
                style={{ flex: 1 }}
                source={{
                    uri: tourLink,
                }}
                
                javaScriptEnabled={true}
                domStorageEnabled={true}
            />}
        </View>
    )
}

export default Tour