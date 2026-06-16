import { AccordionContentProps, transformRestoName } from "@/assets/utils/script"
import BackBtn from "@/components/backBtn"
import StyledText from "@/components/StyledText"
import { Bar } from "@/components/utils"
import { useApi } from "@/contex/api.context"
import { useLanguage } from "@/contex/language.context"
import { useTheme } from "@/contex/theme-context"
import { useRouter } from "expo-router"
import { Alert, LayoutAnimation, LayoutChangeEvent, Linking, ScrollView, TouchableOpacity, View } from "react-native"
import * as Clipboard from "expo-clipboard";
import { IResto, WorkHour } from "@/assets/interfaces/context"
import { useEffect, useState } from "react"
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { Image } from "expo-image"
import { icons } from "@/assets/constants/icon"
import CustomImage from "@/components/CustomImg"


const AnimatedExpoImage = Animated.createAnimatedComponent(Image)

const Content = ({ data }: { data: IResto }) => {
    const { t } = useLanguage()
    const router = useRouter()

    const formatPhone = (phone?: string | number) => {
        const digits = String(phone ?? '').replace(/\D/g, '');

        if (digits.length === 12 && digits.startsWith('375')) {
            return digits.replace(
                /^375(\d{2})(\d{3})(\d{2})(\d{2})$/,
                '+375 ($1) $2-$3-$4'
            );
        }

        if (digits.length === 11 && /^[78]/.test(digits)) {
            return digits.replace(
                /^[78](\d{3})(\d{3})(\d{2})(\d{2})$/,
                '+7 ($1) $2-$3-$4'
            );
        }

        return phone ? String(phone) : '';
    };

    const formatDayRange = (start: number, end: number) => {
        const dayNames = [t('week.mon'), t('week.tue'), t('week.wed'), t('week.thu'), t('week.fri'), t('week.sat'), t('week.sun')];

        if (start === end) return dayNames[start];

        return `${dayNames[start]}-${dayNames[end]}`;
    };

    const formatWorkHours = (workHour: WorkHour[]) => {
        if (!workHour.length) return [];

        const sorted = [...workHour].sort((a, b) => a.day - b.day);
        const ranges: { label: string; openTime: string; closeTime: string; key: string }[] = [];

        let startDay = sorted[0].day;
        let prev = sorted[0];

        for (let i = 1; i <= sorted.length; i++) {
            const current = sorted[i];
            const isSameTime = current && current.openTime === prev.openTime && current.closeTime === prev.closeTime;
            const isNextDay = current && current.day === prev.day + 1;

            if (current && isSameTime && isNextDay) {
                prev = current;
                continue;
            }

            ranges.push({
                label: formatDayRange(startDay, prev.day),
                openTime: prev.openTime,
                closeTime: prev.closeTime,
                key: `${prev.openTime}-${prev.closeTime}`,
            });

            if (current) {
                startDay = current.day;
                prev = current;
            }
        }

        const grouped = new Map<string, typeof ranges>();

        ranges.forEach((range) => {
            const current = grouped.get(range.key) ?? [];
            grouped.set(range.key, [...current, range]);
        });

        return Array.from(grouped.values()).map((items) => {
            const first = items[0];

            return `${items.map((item) => item.label).join('/')}: ${first.openTime} - ${first.closeTime}`;
        });
    };

    const phone = formatPhone(data.phone)
    const addres = data.address
    const workHours = formatWorkHours(data.workHour)
    const { isDark } = useTheme()

    const handleTouch = async (val: string) => {
        await Clipboard.setStringAsync(val).then(() => {
            Alert.alert(t('common.success'), t('common.msg'), [
                {
                    text: t('common.close'),
                    "style": 'default',
                }
            ])
        })
    }

    return (
        <View className="flex-1 gap-6">

            <TouchableOpacity className="w-full p-5 justify-center items-center rounded-xl bg-active"
                onPress={() => router.push({
                    pathname: '/(tabs)/(home)/tour/tour',
                    params: {
                        restoId: data.id
                    }
                })}>
                <StyledText className="text-brown" style={{
                    fontSize: 20,
              
                    textAlign: 'center'
                }} >{t('addresses.tour')}</StyledText>
            </TouchableOpacity>

            <View className="w-full p-5 justify-center items-center rounded-xl gap-2"
                style={{
                    borderWidth: 2,
                    borderColor: 'rgba(67, 48, 19, 1)',
                    position: 'relative'
                }}
            >

                <StyledText className="text-primary" style={{
                    fontSize: 20,
                 
                    textAlign: 'center'
                }} >{transformRestoName(data.name, data.isFranchise)}</StyledText>
                <StyledText className="" style={{
                    fontSize: 13,
                    textAlign: 'center',
                    color: isDark ? 'rgba(217, 211, 198, 1)' : 'rgba(109, 94, 73, 1)'
                }} >{addres}</StyledText>
                <TouchableOpacity onPress={async () => handleTouch(addres)} style={{
                      position: 'absolute',
                        top: 11, right: 11
                }} >
                    <Image source={icons.copy} contentFit="cover" style={{
                        width: 24, height: 24,
                      
                    }} />
                </TouchableOpacity>

            </View>

            {workHours.length > 0 && (
                <View className="w-full p-5 justify-center items-center rounded-xl" style={{
                    borderWidth: 2,
                    borderColor: 'rgba(67, 48, 19, 1)'
                }}>
                    <StyledText className="text-primary"  style={{
                        fontSize: 20,
               
                        textAlign: 'center'
                    }} >{t('addresses.workHours')}</StyledText>
                    {workHours.map((item) => (
                        <StyledText key={item} className=""  style={{
                            fontSize: 20,
                        
                            textAlign: 'center',
                            color: isDark ? 'rgba(217, 211, 198, 1)' : 'rgba(109, 94, 73, 1)'
                        }} >{item}</StyledText>
                    ))}
                </View>
            )}

            <TouchableOpacity className="w-full p-5 justify-center items-center rounded-xl" style={{
                borderWidth: 2,
                borderColor: 'rgba(67, 48, 19, 1)'
            }} onPress={async () => {
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
            }}>
                <StyledText  style={{
                    fontSize: 20,
          
                    textAlign: 'center',
                    color: isDark ? 'rgba(217, 211, 198, 1)' : 'rgba(109, 94, 73, 1)'
                }} >{phone}</StyledText>
            </TouchableOpacity>

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

const Header = () => {
    const { t } = useLanguage()

    return (
        <View className="gap-5">
            <BackBtn name={t('tour.title')} />
            <Bar />
        </View>
    )
}

const TourList = () => {
    const { restaurants } = useApi()
    const boxShadow = '6px 6px 18px -3px rgba(154, 144, 122, 1), 16px 15px 21.4px -3px rgba(255, 255, 255, 0.25) inset'
    const { isDark } = useTheme()
    const [expandedResto, setExpandedResto] = useState<number | null>(null)

    const handlePressResto = (restoId: number) => {

        setExpandedResto(expandedResto === restoId ? null : restoId)
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
                    {restaurants && restaurants.map((item, idx) => {
                        const isExpanded = expandedResto === item.id
                        return (
                            <View key={idx} className="w-[365px]">

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
                                    <View className="mt-3">
                                        <Content data={item} />
                                    </View>
                                </AccordionContent>
                            </View>
                        )
                    })
                    }

                </View>
            </ScrollView>
        </View>
    )
}

export default TourList
