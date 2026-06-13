import { transformBookingName, transformRestoName } from "@/assets/utils/script"
import BackBtn from "@/components/backBtn"
import StyledText from "@/components/StyledText"
import { Bar } from "@/components/utils"
import { useApi } from "@/contex/api.context"
import { useLanguage } from "@/contex/language.context"
import { useTheme } from "@/contex/theme-context"
import { useRouter } from "expo-router"
import { ScrollView, TouchableOpacity, View } from "react-native"

const Header = () => {
    const { t } = useLanguage()

    return (
        <View className="gap-5">
            <BackBtn name={t('booking.title')} />
            <Bar />
        </View>
    )
}


const BookingList = () => {
    const router = useRouter()
    const { restaurants } = useApi()
    const boxShadow = '6px 6px 18px -3px rgba(154, 144, 122, 1), 16px 15px 21.4px -3px rgba(255, 255, 255, 0.25) inset'
    const { isDark } = useTheme()


    return (
        <View className="bg-primary flex-1">
            <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={{ flex: 1, zIndex: 100 }} contentContainerStyle={{
                gap: 15,
                padding: 20
            }}
            >
                <Header />
                <View className="gap-10 justify-center items-center pt-10">
                    {restaurants && restaurants.map((item, idx) => {

                        const defaultRestoplace = item?.restoplace?.find(restoplace => restoplace.name == 'default');

                        if (!defaultRestoplace) return null;

                        return (
                            <View key={idx} className="gap-5">
                                <View className="">
                                    <TouchableOpacity
                                        className="w-[365px] h-20 justify-center items-center rounded-xl bg-primary-btn"
                                        style={isDark ? undefined : { boxShadow }}
                                        onPress={() => router.push({
                                            pathname: "/booking/booking",
                                            params: { key: defaultRestoplace.key, name: item.name, ifFranchise: `${item.isFranchise}` }
                                        })}
                                    >
                                        <StyledText
                                            numberOfLines={1}
                                            fontFamily="m-bold"
                                            style={{
                                                fontSize: 20,
                                                fontWeight: 700
                                            }}
                                        >
                                            {transformRestoName(item.name, item.isFranchise)}
                                        </StyledText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    )
}

export default BookingList