import { Stack } from "expo-router";
import { AppState, Platform, View } from "react-native";
import "./global.css";
import { ThemeProvider, themeVars, useTheme } from "@/contex/theme-context";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react";
import VideoSplash from "@/components/VideoSplash";
import { ApiProvider, useApi } from "@/contex/api.context";
import Error from "./error";
import { LanguageProvider } from "@/contex/language.context";
import * as NavigationBar from 'expo-navigation-bar';

SplashScreen.preventAutoHideAsync().catch(() => { });

function hideAndroidNavigationBar() {
  if (Platform.OS !== 'android') {
    return;
  }

  NavigationBar.setPositionAsync('absolute').catch(() => { });
  NavigationBar.setBehaviorAsync('overlay-swipe').catch(() => { });
  NavigationBar.setVisibilityAsync('hidden').catch(() => { });
}

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


function Gate({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { isLoading, hasError, restaurants } = useApi();
  const [splashFinished, setSplashFinished] = useState(false);


  useEffect(() => {
    SplashScreen.hideAsync().catch(() => { });

  }, []);

  useEffect(() => {
    if (splashFinished) {
      hideAndroidNavigationBar();
    }
  }, [splashFinished]);


  const isAppReady =
    fontsLoaded && !isLoading && (restaurants.length > 0 || hasError);

  return (
    <View style={{ flex: 1 }}>
  
      {splashFinished && (hasError ? <Error /> : <RootLayoutNav />)}

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

  useEffect(() => {
    hideAndroidNavigationBar();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        hideAndroidNavigationBar();
      }
    });

    return () => subscription.remove();
  }, []);

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
