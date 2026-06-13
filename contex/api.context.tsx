import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";
import * as SecureStore from 'expo-secure-store';
import { apiClient } from "@/services/api.client";
import { IFranchise, IMenu, IRes, IResto } from "@/assets/interfaces/context";
import { useRouter } from "expo-router";

function isExpoGo(): boolean {
    return Constants.appOwnership === "expo";
}

interface ApiContextType {
    restaurants: IResto[]
    franchises: IFranchise[]
    swiper: IMenu[]
    isLoading: boolean;
    error: string | null;
    hasError: boolean;
    refetch: () => Promise<void>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined)

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<IResto[]>([])
    const [franchise, setFranchise] = useState<IFranchise[]>([])
    const [swiper, setSwiper] = useState<IMenu[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);
    const router = useRouter()

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        if (isExpoGo() && Platform.OS === "android") {
            console.warn(
                "[push] Remote push notifications are disabled in Expo Go on Android (SDK 53+). Use a development build: https://docs.expo.dev/develop/development-builds/introduction/",
            );
            return;
        }
        void registerPushWhenSupported()
    }, [])

    async function registerPushWhenSupported() {
        try {
            const Notifications = await import("expo-notifications");


            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: true,
                    shouldShowBanner: true,
                    shouldShowList: true,
                }),
            });
        
            
            if (!Device.isDevice) {
                   console.warn("[push] 3. Не устройство");
                   return
            };
           

            const { status: existing } = await Notifications.getPermissionsAsync();

            
            let finalStatus = existing;
            if (existing !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== "granted") return;

            const projectId =
                Constants.expoConfig?.extra?.eas?.projectId ??
                Constants.easConfig?.projectId;
            if (!projectId) {
                console.warn("[push] Add extra.eas.projectId to app.json");
                return;
            }
            const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({
                projectId,
            });

            if (Platform.OS === "android") {
                await Notifications.setNotificationChannelAsync("default", {
                    name: "default",
                    importance: Notifications.AndroidImportance.MAX,
                });
            }

            const platform =
                Platform.OS === "ios" ? "ios" : Platform.OS === "android" ? "android" : "web";
            console.log("ExpoPushToken",expoPushToken);
            
            await apiClient.post<IRes<{ ok: boolean }>>("push/register", {
                expoPushToken,
                platform,
            });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            console.warn("[push] register:", msg);
        }
    }

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setHasError(false);

            const res = await apiClient.get<IRes<IResto[]>>('resto');
            const affiches = await apiClient.get<IRes<IFranchise[]>>('franchise');
            const swiper = await apiClient.get<IRes<IMenu[]>>('menu/main')
            if (res.data) setData(res.data);
            if (affiches.data) setFranchise(affiches.data);
            if(swiper.data) setSwiper(swiper.data)
            

        } catch (error: any) {
            console.log(error.message);
            setError(error?.message || 'Failed to load data');
            setHasError(true);

        } finally {
            setIsLoading(false);
        }
    };



    return (
        <ApiContext.Provider
            value={{
                restaurants: data,
                franchises: franchise,
                isLoading,
                swiper,
                error,
                hasError,
                refetch: loadData
            }}
        >
            {children}
        </ApiContext.Provider>
    )

}

export const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error('useTheme must be used within ApiContext');
    }
    return context;
};
