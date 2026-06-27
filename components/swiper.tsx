import { useRef } from "react";
import { Dimensions, Pressable, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import StyledText from "./StyledText";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Image, ImageBackground } from "expo-image";
import { IMenu } from "@/assets/interfaces/context";
import CustomImage from "./CustomImg";

export const SwiperComp = ({ data,onPress }: { data: IMenu[], onPress: (id:number) => void; }) => {
    const { width: screenWidth } = Dimensions.get('window');
    const ACTIVE_SLIDE_MARGIN = 35
    const SIDE_SLIDE_GAP = 10;
    const ACTIVE_SLIDE_WIDTH = screenWidth - (ACTIVE_SLIDE_MARGIN * 2);

    const ref = useRef<ICarouselInstance>(null);
    const ITEM_HEIGHT = (screenWidth * 3) / 5.5;

    const handleItem = (id:number) => {
        onPress(id)
    }

    return (
        <View className="w-full aspect-video" style={{ height: 160 }} >
            <Carousel
                ref={ref}
                data={data}
                width={ACTIVE_SLIDE_WIDTH}
                height={160}
                autoPlayInterval={5000}
                autoPlay={true}
                style={{ width: screenWidth, justifyContent: 'center',
                    alignItems: 'center' }}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 1,
                    parallaxScrollingOffset: SIDE_SLIDE_GAP,
                    parallaxAdjacentItemScale: 0.8,
                }}
                  defaultIndex={0}
                enabled={true}
                snapEnabled={true}
                pagingEnabled={true}
             
                renderItem={({ item }) => (
                        <Pressable className="flex-1 overflow-hidden rounded-2xl" onPress={()=> handleItem(item.categoryId)} >
                           {/*  <ImageBackground source={{ uri: item.photo }} contentFit="cover" style={{ flex: 1, overflow: 'hidden' }}> */}
                           <CustomImage uri={item.photo} type={'background'} >
                                <LinearGradient
                                    colors={[ 'rgba(0, 0, 0, 0.56)','rgba(0, 0, 0, 0)',]}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 0, y: 0 }}
                                    style={{
                                        flex: 1,
                                        justifyContent: 'flex-end',
                                        padding: 17,
                                        paddingBottom: 12,
                                        position: 'absolute',
                                        width: "100%",
                                        height: '100%'
                                    }}
                                >

                                    <StyledText className="text-white font-bold" fontFamily="m-bold" numberOfLines={1} style={{
                                        fontSize: 16,
                                        fontWeight: 700
                                    }} >
                                        {item.name}
                                    </StyledText>
                                </LinearGradient>
                              </CustomImage>
                         {/*    </ImageBackground> */}
                        </Pressable>
                )}
            />
        </View>
    )
}
