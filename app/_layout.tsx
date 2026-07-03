import { Stack } from "expo-router";
import { View } from "react-native";
import "./global.css";
import { ThemeProvider, themeVars, useTheme } from "@/contex/theme-context";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react";
import VideoSplash from "@/components/VideoSplash";
import { ApiProvider, useApi } from "@/contex/api.context";
import Error from "./error";
import { LanguageProvider } from "@/contex/language.context";

// Не даём нативному сплэшу автоматически прятаться — прячем вручную,
// как только смонтируется React и станет виден наш VideoSplash.
SplashScreen.preventAutoHideAsync().catch(() => { });

function RootLayoutNav() {
  const { theme } = useTheme();

  return (
    <View style={[{ flex: 1 }, themeVars[theme]]}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </View>
  );
}

/**
 * Gate решает, что показывать: видео-сплэш или основной контент.
 * Данные грузятся ApiProvider'ом СРАЗУ (во время сплэша),
 * поэтому сплэш скроется когда пройдёт минимум 3 сек И данные готовы.
 */
function Gate({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { isLoading, hasError, restaurants } = useApi();
  const [splashFinished, setSplashFinished] = useState(false);

  // Прячем нативный сплэш, как только смонтировался React (виден VideoSplash)
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => { });
  }, []);

  // Приложение готово: шрифты загружены и данные пришли (или произошла ошибка)
  const isAppReady =
    fontsLoaded && !isLoading && (restaurants.length > 0 || hasError);

  return (
    <View style={{ flex: 1 }}>
      {/* Основной контент монтируется под сплэшем, чтобы успеть подготовиться */}
      {splashFinished && (hasError ? <Error /> : <RootLayoutNav />)}

      {/* Видео-сплэш поверх контента, сам плавно исчезает */}
      {!splashFinished && (
        <VideoSplash
          isAppReady={isAppReady}
          onFinish={() => setSplashFinished(true)}
        />
      )}
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'BerlinType-Regular': require('../assets/fonts/BerlinType-Regular.otf'),
    'BerlinType-Bold': require('../assets/fonts/BerlinType-Bold.ttf'),
    'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    "Manrope": require('../assets/fonts/manrope.ttf'),
  });

  return (
    <ApiProvider>
      <LanguageProvider>
        <ThemeProvider>
          <Gate fontsLoaded={fontsLoaded} />
        </ThemeProvider>
      </LanguageProvider>
    </ApiProvider>
  );
}
