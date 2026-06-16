import { Stack, } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import "./global.css";
import { ThemeProvider, themeVars, useTheme } from "@/contex/theme-context";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react";
import VideoSplash from "@/components/VideoSplash";
import { ApiProvider, useApi } from "@/contex/api.context";
import Error from "./error";
import { LanguageProvider } from "@/contex/language.context";

function RootLayoutContent() {
  const { isLoading, hasError, restaurants } = useApi();
  const [showMainContent, setShowMainContent] = useState(false);

  useEffect(() => {

    if (!isLoading && !hasError && restaurants.length > 0) {
      setShowMainContent(true);
    }
  }, [isLoading, hasError, restaurants]);


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#F59E0B" />
      </View>
    );
  }



  if (hasError) {
    return (
      <Error />
    );
  }


  if (showMainContent) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    );
  }


  return null;
}



function RootLayoutNav() {
  const { theme } = useTheme()

  return (
    <View style={[{ flex: 1 }, themeVars[theme]]}>
      <RootLayoutContent />
    </View>
  )
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),

    'BerlinType-Regular': require('../assets/fonts/BerlinType-Regular.otf'),
    'BerlinType-Bold': require('../assets/fonts/BerlinType-Bold.ttf'),
    'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    "Manrope": require('../assets/fonts/manrope.ttf'),

  })
  const [appIsReady, setAppIsReady] = useState(true)

  const isReady = appIsReady && fontsLoaded;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync()
    }
  }, [isReady])

  /*  if (!appIsReady || !fontsLoaded) {
     return (
       <VideoSplash
         onReady={() => {
           setAppIsReady(true);
         }}
       />
     );
   }
  */

  return/*  !appIsReady ? <VideoSplash onReady={() => setAppIsReady(true)} /> : */ (
    <ApiProvider>
      <LanguageProvider>
        <ThemeProvider>
          <RootLayoutNav />
        </ThemeProvider>
      </LanguageProvider>
    </ApiProvider>

  )
}
