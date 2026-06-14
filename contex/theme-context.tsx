import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { vars } from "nativewind";


type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    theme: ThemeMode;
    toggleTheme: () => Promise<void>;
    setTheme: (theme: ThemeMode) => Promise<void>;
    isDark: boolean;
}

export const themeVars = {
    light: vars({
        "--color-primary": "rgba(217, 211, 198, 1)",
        "--color-text-primary": "rgba(67, 48, 20, 1)",
        "--color-back-btn-bg": "rgba(217, 211, 198, 1)",
        "--color-primary-btns": 'rgba(217, 211, 198, 1)',
        "--color-primary-second-btns": 'rgba(212, 203, 188, 1)',
        '--color-primary-components': 'rgba(217, 211, 198, 1)',
        '--color-primary-modal': 'rgb(212,203,188)'
    }),
    dark: vars({
        "--color-primary": "rgba(31, 31, 31, 1)",
        "--color-text-primary": "rgba(217, 211, 198, 1)",
        "--color-back-btn": "rgba(41, 41, 41, 1)",
        "--color-primary-btns": 'rgba(52, 52, 52, 1)',
        "--color-primary-second-btns": 'rgba(48, 40, 42, 1)',
        '--color-primary-components': 'rgba(52, 52, 52, 1)',
        '--color-primary-modal': 'rgba(51, 51, 51, 1)'
    }),
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {

    const [currentTheme, setCurrentTheme] = useState<ThemeMode>('dark')

    useEffect(() => {
        loadTheme()
    }, [])

    const loadTheme = async () => {
        try {
            const savedTheme = await SecureStore.getItemAsync('app-theme')
            if (savedTheme === 'light' || savedTheme === 'dark') {
                setCurrentTheme(savedTheme);
            } else {
                setCurrentTheme('dark');
            }

        } catch (error) {
            console.log(error);
            setCurrentTheme( 'dark');
        }
    }


    const toggleTheme = async () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setCurrentTheme(newTheme)
        try {
            await SecureStore.setItemAsync('app-theme', newTheme)
        } catch (error) {
            console.log(error);

        }
    }

    const handleTheme = async (newTheme: ThemeMode) => {
        setCurrentTheme(newTheme)
        try {
            await SecureStore.setItemAsync('app-theme', newTheme);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <ThemeContext.Provider
            value={{
                theme: currentTheme,
                toggleTheme,
                setTheme: handleTheme,
                isDark: currentTheme === 'dark'
            }
            } >
            {children}
        </ThemeContext.Provider>
    )

}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};