import { icons } from "@/assets/constants/icon";
import { Image } from "expo-image";
import { View } from "react-native";

export const Bar = () => (
     <View className="w-full h-8 flex-row items-center">
        <View className="flex-1 bg-comp-bg-bar h-[2px]" style={{ marginRight: 15 }} />
        <Image source={icons.bar_logo} contentFit="contain" style={{ height: 30, width: 30 }} />
        <View className="flex-1 bg-comp-bg-bar h-[2px]" style={{ marginLeft: 15 }} />
    </View>
)

