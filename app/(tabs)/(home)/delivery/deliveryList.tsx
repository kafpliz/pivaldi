import { IDelivery, IResto } from "@/assets/interfaces/context"
import { AccordionContentProps, openLink, transformRestoName } from "@/assets/utils/script"
import BackBtn from "@/components/backBtn"
import StyledText from "@/components/StyledText"
import { Bar } from "@/components/utils"
import { useApi } from "@/contex/api.context"
import { useLanguage } from "@/contex/language.context"
import { useTheme } from "@/contex/theme-context"
import { useLocalSearchParams, } from "expo-router"
import { useEffect, useState } from "react"
import { Alert, LayoutAnimation, LayoutChangeEvent, Linking, Platform, ScrollView, TouchableOpacity, UIManager, View } from "react-native"
import { icons } from "@/assets/constants/icon"
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { Image } from "expo-image"


const AnimatedExpoImage = Animated.createAnimatedComponent(Image)

const Header = () => {
    const { t } = useLanguage()

    return (
        <View className="gap-5">
            <BackBtn name={t('delivery.title')} size={28} />
            <Bar />
        </View>
    )
}

const AccordionContent: React.FC<AccordionContentProps> = ({
    isExpanded,
    children,
    duration = 300
}) => {
    const [contentHeight, setContentHeight] = useState(0);
    const height = useSharedValue(0);

    useEffect(() => {
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
}

const PickupItem = ({ data, }: {
    data: IDelivery,
    restaurantName: string
}) => {
    const { t } = useLanguage()
    const { isDark } = useTheme()

    const formatPhone = (phone?: string | number) => {
        const digits = String(phone ?? '').replace(/\D/g, '');
        if (digits.length === 12 && digits.startsWith('375')) {
            return digits.replace(/^375(\d{2})(\d{3})(\d{2})(\d{2})$/, '+375 ($1) $2-$3-$4');
        }
        if (digits.length === 11 && /^[78]/.test(digits)) {
            return digits.replace(/^[78](\d{3})(\d{3})(\d{2})(\d{2})$/, '+7 ($1) $2-$3-$4');
        }
        return data.phone ? String(data.phone) : '';
    };

    const phone = formatPhone(data.phone)

    return (
        <TouchableOpacity
            className="w-full h-[110px] justify-center items-center rounded-xl "
            style={{
                borderWidth: 1,
                borderColor: isDark ? 'rgba(67, 48, 19, 1)' : 'black',
                backgroundColor: isDark ? 'rgba(30, 30, 30, 0.5)' : ''
            }}
            onPress={async () => {
                const cleanPhone = phone.replace(/[^0-9+]/g, '');
                const url = `tel:${cleanPhone}`;
                try {
                    const supported = await Linking.canOpenURL(url);

                    if (supported) {
                        await Linking.openURL(url);
                    } else {
                        Alert.alert(
                            t('common.error'),
                            t('addresses.cannot_call')
                        );
                    }
                } catch (error) {
                    Alert.alert(
                        t('common.error'),
                        t('addresses.cannot_call') || 'Ошибка при попытке совершить звонок'
                    );
                }
            }}
        >
            <StyledText
                className="text-primary"
                numberOfLines={1}
                fontFamily="berlin"
                style={{ fontSize: 24, fontWeight: 700 }}
            >
                {data.name || t('delivery.pickup')}
            </StyledText>
            <StyledText
                numberOfLines={1}
                fontFamily="berlin"
                style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: isDark ? 'rgba(217, 211, 198, 1)' : 'rgba(109, 94, 73, 1)'
                }}
            >
                {phone}
            </StyledText>
        </TouchableOpacity>
    )
}


const DeliveryItem = ({ data }: { data: IDelivery, restaurantName: string }) => {
    const { t } = useLanguage()

    return (
        <TouchableOpacity
            className="bg-delivery-bg rounded-xl pl-2 pr-2"
            style={{
                aspectRatio: 16 / 9,
                justifyContent: 'center',
                alignItems: 'center'
            }}
            onPress={() => openLink(data.link, data.name, {
                errorTitle: t('link.openFailedTitle'),
                cannotOpen: t('link.cannotOpen', { title: data.name }),
                openFailed: t('link.openFailed'),
            })}
        >
            {data.photo ? (
                <Image
                    source={{ uri: data.photo }}
                    style={{ width: '70%', aspectRatio: 1 }}
                    contentFit={'contain'}
                />
            ) : (
                <StyledText
                    numberOfLines={2}
                    style={{ fontSize: 14, fontWeight: 600, textAlign: 'center' }}
                >
                    {data.name}
                </StyledText>
            )}
        </TouchableOpacity>
    )
}

const DeliveryList = () => {
    const { isFranchise } = useLocalSearchParams<{ isFranchise: string }>()
    const { restaurants } = useApi()
    const [restoList, setRestoList] = useState<IResto[]>()
    const [expandedResto, setExpandedResto] = useState<number | null>(null)

    const boxShadow = '6px 6px 18px -3px rgba(154, 144, 122, 1), 16px 15px 21.4px -3px rgba(255, 255, 255, 0.25) inset'
    const { isDark } = useTheme()

    useEffect(() => {
        setRestoList(restaurants)
    }, [isFranchise, restaurants])

    const handlePressResto = (restoId: number) => {

        setExpandedResto(expandedResto === restoId ? null : restoId)
    }

    const getPickupDeliveries = (deliveries: IDelivery[]) => {
        return deliveries?.filter(item => item.slug === 'pickup') || []
    }

    const getDeliveryDeliveries = (deliveries: IDelivery[]) => {
        return deliveries?.filter(item => item.slug !== 'pickup') || []
    }
    const ArrowIcon = ({ restoId }: { restoId: number }) => {
        const isExpanded = expandedResto === restoId
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

    return (
        <View className="bg-primary flex-1">
            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                style={{ flex: 1, zIndex: 100 }}
                contentContainerStyle={{
                    gap: 15,
                    padding: 20
                }}
            >
                <Header />
                <View className="gap-8 justify-center items-center pt-10">
                    {restoList && restoList.map((item, idx) => {
                        const pickupItems = getPickupDeliveries(item.delivery)
                        const deliveryItems = getDeliveryDeliveries(item.delivery)
                        const isExpanded = expandedResto === item.id
                        return (
                            <View key={item.id || idx} className="w-[365px]">

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
                                    <ArrowIcon restoId={item.id} />
                                </TouchableOpacity>


                                <AccordionContent isExpanded={isExpanded}>
                                    <View className="mt-3 gap-3">
                                        {deliveryItems.length > 0 && (
                                            <View className="w-full flex-row flex-wrap">
                                                {deliveryItems.map((deliveryItem, delIdx) => (
                                                    <View key={`delivery-${delIdx}`} style={{ width: '50%', padding: 8 }}>
                                                        <DeliveryItem
                                                            data={deliveryItem}
                                                            restaurantName={item.name}
                                                        />
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                        {pickupItems.map((pickup, pickupIdx) => (
                                            <PickupItem
                                                key={`pickup-${pickupIdx}`}
                                                data={pickup}
                                                restaurantName={item.name}
                                            />
                                        ))}


                                        {pickupItems.length === 0 && deliveryItems.length === 0 && (
                                            <View className="w-full h-16 justify-center items-center rounded-xl bg-gray-500">
                                                <StyledText style={{ color: 'white' }}>
                                                    Нет доступных вариантов доставки
                                                </StyledText>
                                            </View>
                                        )}
                                    </View>
                                </AccordionContent>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    )
}


export default DeliveryList