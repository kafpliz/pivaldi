import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator,  View } from "react-native"

import { WebView } from 'react-native-webview'

const Booking = () => {
    const [isLoading, setIsLoading] = useState(true)
    const { key, name, ifFranchise } = useLocalSearchParams()

    const [url,setUrl] =  useState('')
    const [ready, setReady] = useState(false)
    useEffect(()=>{
        if(key){
            if(ifFranchise == 'true'){
                setUrl(`https://pivaldi.restoplace.ws/?address=${key}&nostep=1`)
            } else{
                setUrl(`https://pivaldi.restoplace.ws/?city=${name}`)
            }
            
            setReady(true)
        }
    },[key])

    return (
        <View style={{ flex: 1 }}>
            {!ready && <View className="flex-1 bg-primary justify-center items-center">
                <ActivityIndicator size={'large'} />
                </View>}
           {ready &&  <WebView
                style={{ flex: 1 }}
                source={{
                    uri: url,
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onError={(error) => console.log('WebView error:', error.nativeEvent)}
            />}
        </View >
    )
}


export default Booking