import { img } from "@/assets/constants/img";
import StyledText from "@/components/StyledText";
import { Bar } from "@/components/utils";
import { useApi } from "@/contex/api.context";
import { useLanguage } from "@/contex/language.context";
import { useTheme } from "@/contex/theme-context";
import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Error = () => {
    const { refetch, error } = useApi();
    const { t } = useLanguage()
    const { top } = useSafeAreaInsets()
    const handleRetry = async () => {
        await refetch();

    };
    const { isDark } = useTheme()
    const boxShadow = `6px 6px 18px -3px rgba(154, 144, 122, 1), 16px 15px 21.4px -3px rgba(255, 255, 255, 0.25) inset`
    return (
        <View className="flex-1 justify-between pl-5 pr-5 bg-primary" style={{
            paddingTop: top,
            paddingBottom: top
        }}>
            <Bar />
            <View className="flex-1 gap-3 justify-center items-center">
                <Image source={img.logo} contentFit="contain" style={{ width: 180, height: 220 }} />
                <StyledText fontFamily="berlin" style={{
                    fontSize: 35, fontWeight: 700
                }} >{t('common.loadingError')}</StyledText>
                <StyledText fontFamily='m-semibold' style={{
                    fontSize: 16, fontWeight: 700, color: 'rgba(180, 160, 130, 1)'
                }} >{error}</StyledText>
                <TouchableOpacity style={isDark ? undefined:  {boxShadow}}
                    className="w-[272px] h-[75px] rounded-xl justify-center items-center bg-primary-btn"
                    onPress={handleRetry}
                >
                    <StyledText fontFamily="m-semibold" className="text-primary" style={{ fontSize: 16, fontWeight: 600, textAlign: 'center' }}>
                        {t('common.retry')}
                    </StyledText>
                </TouchableOpacity>
            </View>

            <Bar />

        </View>
    );
}

export default Error