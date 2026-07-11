import { ICategory, IMenu, IRes } from "@/assets/interfaces/context"
import { transformFirstLetter } from "@/assets/utils/script"
import BackBtn from "@/components/backBtn"
import CustomImage from "@/components/CustomImg"
import StyledText from "@/components/StyledText"
import { SwiperComp } from "@/components/swiper"
import { Bar } from "@/components/utils"
import { apiClient } from "@/services/api.client"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Dimensions, ScrollView, TouchableOpacity, View } from "react-native"
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler"


const Header = ({ name, data }: { name: string, data: IMenu[] }) => {
    return (
        <View className="w-full min-h-2 gap-3">
            <View className="w-full pl-5 pr-5">
                <BackBtn name={name} />
            </View>
            <View>
                <SwiperComp data={data} onPress={(id) => (id)} />
                <StyledText className="text-primary"
                    fontFamily={'berlin'}
                    style={{
                        fontSize: 22,
                        fontWeight: 700,
                        textAlign: 'center'
                    }} >Акции</StyledText>
            </View>
            <View className="w-full pl-5 pr-5">
                <Bar />
            </View>
        </View>
    )
}

const Tabs = ({ data, activeTab, onTabChange, }: { data: ICategory[], activeTab: number, onTabChange: (tabId: number) => void; }) => {
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const activeIndex = data.findIndex(item => item.id === activeTab);
        if (flatListRef.current && activeIndex !== -1) {
            flatListRef.current.scrollToIndex({
                index: activeIndex,
                animated: true,
                viewPosition: 0.5,
            });
        }
    }, [activeTab, data]);


    const handleTab = (idx: number) => {
        onTabChange(idx)

    }


    return (

        <View className="w-full h-[48px] bg-menu-tabs rounded-xl overflow-hidden">
            <FlatList
                ref={flatListRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    alignItems: 'center'
                }}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onPress={() => handleTab(item.id)}
                        className="w-fit min-w-24 pl-6 pr-6 h-10 justify-center items-center rounded-xl"
                        style={{
                            backgroundColor: item.id == activeTab ? 'rgba(142, 116, 79, 1)' : undefined,
                        }}
                    >
                        <StyledText fontFamily="berlin" numberOfLines={2}  style={{
                            fontSize: 11, fontWeight: 400, color: 'rgba(248, 244, 235, 1)', textAlign: 'center'
                        }}>{transformFirstLetter(item.name)}</StyledText>
                    </TouchableOpacity>
                )}
                onScrollToIndexFailed={(info) => {

                    const wait = new Promise(resolve => setTimeout(resolve, 500));
                    wait.then(() => {
                        flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                    });
                }}
            />


        </View>


    )
}


const Content = ({ data, activeId }: { data: ICategory[], activeId?: number }) => {
    const [activeTab, setActiveTab] = useState<number>(0)
    const [currCategory, setCurrCategory] = useState<ICategory>()
    const [menuItem, setMenuItem] = useState<IMenu[]>([])
    const [load, setLoad] = useState(false)
    const [isBar, setIsBar] = useState(false)

    useEffect(() => {
        if (data.length > 0) {
            if (activeId) {
                setActiveTab(activeId)
            } else {
                setActiveTab(data[0].id)
            }
        }
    }, [data, activeId])

    useEffect(() => {
        const find = data.find(item => item.id == activeTab)
        if (find) {
            setCurrCategory(find)
            setLoad(false)

            const getMenu = async () => {
                const res = await apiClient.get<IRes<IMenu[]>>(`menu/item/${activeTab}`)
                setMenuItem(res.data)
                setLoad(true)
            }
            getMenu()
        }
    }, [activeTab])

    useEffect(() => {
        if (currCategory && currCategory.isBar) {
            setIsBar(true)
        } else {
            setIsBar(false)
        }
    }, [currCategory])

    return (
        <View className="pr-5 pl-5 gap-6 ">
            <Tabs data={data} activeTab={activeTab} onTabChange={(id) => setActiveTab(id)} />
            <View className="flex-1 flex-shrink gap-6 ">
                {currCategory?.name &&
                    <View className="w-full gap-3">
                        <StyledText fontFamily="m-semibold" style={{
                            fontWeight: 600,
                            fontSize: 32
                        }} >{transformFirstLetter(currCategory?.name)}</StyledText>
                        {currCategory?.comment && <StyledText fontFamily="m-semibold" style={{
                            fontWeight: 600,
                            fontSize: 14
                        }} >{transformFirstLetter(currCategory.comment)}</StyledText>}
                    </View>
                }
                {!load &&
                    <View className="w-full">
                        <ActivityIndicator size={'large'} />
                    </View>
                }
                {load &&
                    <FlatList
                        data={menuItem}
                        numColumns={isBar ? 1 : 2}
                        keyExtractor={(item, index) => index.toString()}
                        columnWrapperStyle={!isBar ? {
                            justifyContent: 'space-between',
                            marginBottom: 13
                        } : undefined}

                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <View className="gap-2" style={{ width: isBar ? '100%': '48%' }} >
                                <CustomImage uri={item.photo} border={12} type={'simple'} style={{ width: '100%',  aspectRatio: isBar ? 9 / 16 : 16/9, }} />
                                {!isBar&& 
                                <View className="w-full flex-row gap-2">
                                    <View className="flex-1 flex-shrink">
                                        <StyledText numberOfLines={3} className="text-primary"  fontFamily="m-semibold" style={{
                                            fontSize: 13,
                                            fontWeight: 600
                                        }} >{transformFirstLetter(item.name)}</StyledText>
                                       {item.comment &&  <StyledText numberOfLines={3} className="text-primary"  fontFamily="m-semibold" style={{
                                            fontSize: 11,
                                            fontWeight: 600
                                        }} >{transformFirstLetter(item.comment)}</StyledText>}
                                    </View>
                                    <View className="flex-shrink-0 justify-end">
                                        <StyledText fontFamily="m-bold" style={{
                                            fontSize: 13,
                                            fontWeight: 700
                                        }} >{item.price} ₽</StyledText>
                                    </View>
                                </View>
                                }
                            </View>
                        )}
                        contentContainerStyle={{
                            gap: 10
                        }}
                    />
                }

            </View>
        </View>
    )
}

const Menu = () => {
    const { name, type, categoryId } = useLocalSearchParams<{ name: string, type: 'regular' | 'franchise', categoryId?: string }>()
    const [stock, setStock] = useState<IMenu[]>([])
    const [category, setCategory] = useState<ICategory[]>([])
    const [load, setLoad] = useState(false)

    useEffect(() => {
        const func = async () => {
            const stockRes = await apiClient.get<IRes<IMenu[]>>(`menu/stock/${type}`)
            const categoryRes = await apiClient.get<IRes<ICategory[]>>(`menu/category/${type}`)


            if (stockRes && categoryRes) {
                setStock(stockRes.data)
                setCategory(categoryRes.data)

                setLoad(true)
            }
        }
        func()
    }, [])
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {load && <View className="flex-1 bg-primary">
                <FlatList
                    data={[{ id: 'header' }, { id: 'content' }]}
                    keyExtractor={(item) => item.id}
                    bounces={false}
                    renderItem={({ item }) => (
                        item.id === 'header'
                            ? <Header name={name} data={stock} />
                            : <Content data={category} activeId={categoryId ? Number(categoryId) : undefined} />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingTop: 20,
                        paddingBottom: 20,
                        gap: 15
                    }}
                />
            </View>}
            {!load && 
                <View className="flex-1 bg-primary justify-center items-center">
                    <ActivityIndicator size={'large'} />
                </View>
            }
        </GestureHandlerRootView>
    )

}

export default Menu