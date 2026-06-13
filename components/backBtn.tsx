import { useRouter } from "expo-router"
import { TouchableOpacity, View } from "react-native"
import StyledText from "./StyledText"
import { Image } from "expo-image"
import { icons } from "@/assets/constants/icon"

const BackBtn = ({ name, size = 30 }: { name: string, size?:number }) => {
 
    
    const router = useRouter()
    const boxShadow = '1px 1px 5px 1px rgba(0, 0, 0, 0.25)'
    return (
        <View className="w-full flex-row gap-4 items-center">
            <TouchableOpacity className="w-[41px] h-[41px] rounded-md bg-btns-back justify-center items-center" style={{boxShadow}} onPress={()=> router.back()}>
                <Image source={icons.back} contentFit="contain" style={{width: 20, height: 20}} />
            </TouchableOpacity>
            <StyledText fontFamily={'berlin-bold'} style={{
                fontSize: size,
                fontWeight: 700,
                flex:1,
                flexShrink:1,
            }}>{name}</StyledText>
        </View>
    )
}

export default BackBtn