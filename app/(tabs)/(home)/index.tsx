import { icons } from "@/assets/constants/icon";
import { openLink } from "@/assets/utils/script";
import StyledText from "@/components/StyledText";
import { SwiperComp } from "@/components/swiper";
import { useApi } from "@/contex/api.context";
import { useLanguage } from "@/contex/language.context";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";


const Links = () => {
  const { t } = useLanguage()
  const links = [
    { link: 'https://t.me/pivaldiru', icon: icons.tg, color: 'bg-home-link-1', name: t('social.telegram') },
    { link: 'https://vk.ru/pivaldi', icon: icons.vk, color: 'bg-home-link-2', name: t('social.vk') },
    { link: 'https://max.ru/pivaldi', icon: icons.max, color: 'bg-home-link-3', name: t('social.max') },
  ]
  return (
    <View className="w-full h-[60px] gap-3 justify-between flex-row">
      {links && links.map((item, idx) => (
        <TouchableOpacity key={idx} className={["flex-1 rounded-xl justify-center items-center", item.color].join(' ')} onPress={() => openLink(item.link, item.name, {
          errorTitle: t('link.openFailedTitle'),
          cannotOpen: t('link.cannotOpen', { title: item.name }),
          openFailed: t('link.openFailed'),
        })} >
          <Image source={item.icon} contentFit="contain" style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
      ))}
    </View>
  )
}

const Block = ({ first, second, first_bg, second_bg, onPress, onPressSecond }: { first: string, second: string, first_bg: string, second_bg: string, onPress: () => void, onPressSecond: () => void, }) => {
  return (
    <View className="flex-row gap-2 w-full h-[120px]">

      <TouchableOpacity className={["flex-1 justify-center items-center rounded-xl", first_bg].join(' ')} onPress={onPress}>
        <StyledText style={{ fontSize: 22, fontWeight: 700 }} className="text-white text-center" >{first}</StyledText>
      </TouchableOpacity>

      <TouchableOpacity className={["flex-1  justify-center items-center rounded-xl", second_bg].join(' ')} onPress={onPressSecond}>
        <StyledText  style={{ fontSize: 22, fontWeight: 700 }} className="text-white text-center" >{second}</StyledText>
      </TouchableOpacity>
    </View>
  )
}



export default function Index() {
  const router = useRouter()
  const { t } = useLanguage()
  const { swiper } = useApi()
  const boxShadow = '6px 6px 18px -3px rgba(0, 0, 0, 0.47), inset 16px 15px 21px -3px rgba(255, 250, 239, 0.5)'

  const handleMenu = (id: number) => {
    router.push({
      pathname: '/(tabs)/(home)/menu/menu',
      params: { name: t("menu.titleRegular"), type: 'regular', categoryId: id }
    })
  }

  return (
    <View className="flex-1 bg-primary">
      <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={{ flex: 1, width: "100%", height: "100%" }} contentContainerStyle={{
        gap: 15,
        paddingTop: 20,
        paddingBottom: 20,
      }}
      >
        <SwiperComp data={swiper} onPress={handleMenu} />


        <View className="w-full pl-4 pr-4 gap-3" >
          <Block first={t('home.menuPivaldi')} second={t('home.menuPivaldiCity')} onPress={() => router.push({
            pathname: '/(tabs)/(home)/menu/menu',
            params: { name: t("menu.titleRegular"), type: 'regular' }
          })} onPressSecond={() => router.push({
            pathname: '/(tabs)/(home)/menu/menu',
            params: { name: t("menu.titleFranchise"), type: 'franchise' }
          })}
            first_bg="bg-home-block-1" second_bg="bg-home-block-2" />

          <TouchableOpacity className="w-full h-[80px]  bg-home-btns rounded-xl  justify-center items-center" style={{ boxShadow }} onPress={() => router.push('/(tabs)/(home)/booking/bookingList')} >
            <StyledText  style={{ fontSize: 24, fontWeight: 700 }} className="text-home-btns text-center">{t('home.booking')}</StyledText>
          </TouchableOpacity>

          <Block first={t('home.deliveryPickup')} second={t('home.threeDTours')} onPress={() => router.push('/(tabs)/(home)/delivery/deliveryList')} onPressSecond={() => router.push('/(tabs)/(home)/tour/tourList')}
            first_bg="bg-home-block-2" second_bg="bg-home-block-1" />

          <TouchableOpacity className="w-full h-[50px] bg-white rounded-xl  justify-center items-center" style={{ boxShadow }} onPress={() => router.push('/(tabs)/(home)/franchise')}>
            <StyledText  style={{ fontSize: 20, fontWeight: 700 }} className="text-home-btns text-center">{t('home.franchising')}</StyledText>
          </TouchableOpacity>

          <Links />

          <TouchableOpacity className="w-full h-[40px]  bg-home-btns rounded-xl  justify-center items-center" style={{ boxShadow }} onPress={() => router.push('/(tabs)/(home)/affiches/affiches')} >
            <StyledText   style={{ fontSize: 24, fontWeight: 700 }} className="text-home-btns text-center">{t('home.affiche')}</StyledText>
          </TouchableOpacity>

            <TouchableOpacity className="w-full h-[40px]  bg-home-btns rounded-xl  justify-center items-center" style={{ boxShadow }} 
            onPress={() => router.push('/(tabs)/(home)/vacancies')} >
            <StyledText  style={{ fontSize: 24, fontWeight: 700 }} className="text-home-btns text-center">{t('profile.vacancies')}</StyledText>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>

  );
}