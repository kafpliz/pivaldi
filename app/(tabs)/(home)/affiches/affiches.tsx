import { icons } from "@/assets/constants/icon"
import { img } from "@/assets/constants/img"
import { IAffiche, IRes, IResto } from "@/assets/interfaces/context"
import { AccordionContentProps, transformRestoName } from "@/assets/utils/script"
import BackBtn from "@/components/backBtn"
import CustomImage from "@/components/CustomImg"
import StyledText from "@/components/StyledText"
import { Bar } from "@/components/utils"
import { useApi } from "@/contex/api.context"
import { useLanguage } from "@/contex/language.context"
import { useTheme } from "@/contex/theme-context"
import { apiClient } from "@/services/api.client"
import { Image } from "expo-image"
import { useEffect, useState } from "react"
import {  FlatList, LayoutChangeEvent, ScrollView, TouchableOpacity, View } from "react-native"
import Animated, { Easing, FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated"



const Header = () => {
  const { t } = useLanguage()

  return (
    <View className="gap-5">
      <BackBtn name={t('affiche.title')} />
      <Bar />
    </View>
  )
}
const AnimatedExpoImage = Animated.createAnimatedComponent(Image)

const AfficheItem = ({ data }: { data: IAffiche }) => {
    const { t } = useLanguage()

    const formatToMoscowTime = (utcDateString: string, name: string): string => {
        const mskDate = new Date(utcDateString);

        const day = mskDate.getUTCDate();
        const monthsGenitive = [
            t('month.0'),
            t('month.1'),
            t('month.2'),
            t('month.3'),
            t('month.4'),
            t('month.5'),
            t('month.6'),
            t('month.7'),
            t('month.8'),
            t('month.9'),
            t('month.10'),
            t('month.11'),
        ];
        const month = monthsGenitive[mskDate.getUTCMonth()];
        const hours = mskDate.getUTCHours().toString().padStart(2, '0');
        const minutes = mskDate.getUTCMinutes().toString().padStart(2, '0');

        return `${day} ${month} ${t('affiche.at')} ${hours}:${minutes} - ${name}`;
    };

    return (
        <View className="" style={{width: '48%', borderColor: '#2b2828', borderWidth: 1,}} >
            <CustomImage 
                uri={data.photo} 
                type={'simple'} 
                style={{ width: '100%', aspectRatio: 16 / 9 }} 
            />
            <View className="w-full min-h-12 bg-affiche-bar pt-1 pb-1 pl-2 pr-2 justify-center items-center">
                <StyledText 
                    className="text-affiche-text" 
                    fontFamily={'m-semibold'} 
                    style={{
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        textAlign: 'center'
                    }} 
                >
                    {formatToMoscowTime(data.time, data.name)}
                </StyledText>
            </View>
        </View>
    )
}

const ArrowIcon = ({ isExpanded }: { isExpanded: boolean }) => {
    const rotation = useSharedValue(0)

    useEffect(() => {
        rotation.value = withTiming(isExpanded ? 180 : 0, {
            duration: 250,
            easing: Easing.inOut(Easing.ease)
        })
    }, [isExpanded])

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }]
    }))

    return (
        <AnimatedExpoImage
            source={icons.arrow}
            contentFit="cover"
            style={[
                {
                    width: 12,
                    height: 6,
                    position: 'absolute',
                    bottom: 10,
                },
                animatedStyle
            ]}
        />
    )
}


export const AccordionContent: React.FC<AccordionContentProps> = ({ 
    isExpanded, 
    children, 
    duration = 300 
}) => {
    const [contentHeight, setContentHeight] = useState(0);
    const height = useSharedValue(0);

    useEffect(() => {
        // Анимируем высоту при изменении состояния
        height.value = withTiming(isExpanded ? contentHeight : 0, {
            duration,
            easing: Easing.inOut(Easing.ease),
        });
    }, [isExpanded, contentHeight]);

    const animatedStyle = useAnimatedStyle(() => ({
        height: height.value,
        overflow: 'hidden',
    }));

   
    const onLayout = (event: LayoutChangeEvent) => {
        const newHeight = event.nativeEvent.layout.height;
        if (newHeight > 0 && contentHeight !== newHeight) {
            setContentHeight(newHeight);
        }
    };

    return (
        <Animated.View style={animatedStyle}>
            <View 
                onLayout={onLayout} 
                style={{ 
                    position: 'absolute', 
                    width: '100%',
                    opacity: contentHeight === 0 ? 0 : 1 
                }}
            >
                {children}
            </View>
        </Animated.View>
    );
};

const Affiches = () => {
    const { t } = useLanguage()
    const { restaurants } = useApi()
    const { isDark } = useTheme()
    const boxShadow = '6px 6px 18px -3px rgba(154, 144, 122, 1), 16px 15px 21.4px -3px rgba(255, 255, 255, 0.25) inset'
    
    const [restoList, setRestoList] = useState<IResto[]>([])
    const [expandedResto, setExpandedResto] = useState<number | null>(null)
    const [affichesData, setAffichesData] = useState<{ [key: number]: IAffiche[] }>({})

  
    useEffect(() => {
        if (restaurants) {
            
            const clean = restaurants.filter(item => !item.isFranchise)
            setRestoList(clean)
        }
    }, [restaurants])

    const handlePressResto = async (restoId: number) => {
        if (expandedResto === restoId) {
            setExpandedResto(null)
            return
        }
    
        if (!affichesData[restoId]) {
            try {
                const res = await apiClient.get<IRes<IAffiche[]>>(`affiche/${restoId}`)
                setAffichesData(prev => ({
                    ...prev,
                    [restoId]: res.data
                }))
            } catch (error) {
                console.error('Error loading affiche:', error)
                setAffichesData(prev => ({
                    ...prev,
                    [restoId]: []
                }))
            }
        }
        
        setExpandedResto(restoId)
    }

    return (
        <View className="bg-primary flex-1">
           <FlatList
                data={restoList}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    gap: 15,
                    padding: 20,
                    paddingBottom: 40
                }}
                ListHeaderComponent={<Header />}
                renderItem={({ item }) => {
                    const affiches = affichesData[item.id] || []
                    const hasAffiches = affiches.length > 0
                    const isExpanded = expandedResto === item.id
                    
                    return (
                        <View className="w-[365px] self-center">
                            <TouchableOpacity
                                className="h-20 justify-center items-center rounded-xl bg-primary-btn relative"
                                style={isDark ? undefined : { boxShadow }}
                                onPress={() => handlePressResto(item.id)}
                                activeOpacity={0.7}
                            >
                                <StyledText fontFamily="m-bold" style={{
                                    fontSize: 20,
                                    fontWeight: 700
                                }}>
                                    {transformRestoName(item.name, item.isFranchise)}
                                </StyledText>
                                <ArrowIcon isExpanded={isExpanded} />
                            </TouchableOpacity>

                        
                                <AccordionContent isExpanded={isExpanded}>
                                    
                                    <View className="flex-row flex-wrap justify-between gap-3 pt-3">
                                        {hasAffiches ? (
                                            affiches.map((affiche, affIdx) => (
                                                <AfficheItem key={`affiche-${affIdx}`} data={affiche} />
                                            ))
                                        ) : (
                                            <View className="w-full h-16 justify-center items-center rounded-xl bg-gray-500">
                                                <StyledText style={{ color: 'white' }}>
                                                    Нет доступных афиш
                                                </StyledText>
                                            </View>
                                        )}
                                    </View>
                                </AccordionContent>
                      
                        </View>
                    )
                }}
            />
        </View>
    )
}

export default Affiches
