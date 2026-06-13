import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Language, TranslationKey, TranslationParams, translations } from "@/assets/i18n/translations";

const LANGUAGE_STORAGE_KEY = "pivaldi_language";

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => Promise<void>;
    toggleLanguage: () => Promise<void>;
    t: (key: TranslationKey, params?: TranslationParams) => string;
    tList: (key: TranslationKey) => string[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const isLanguage = (value: string | null): value is Language => value === "ru" || value === "en";

const interpolate = (text: string, params?: TranslationParams) => {
    if (!params) return text;

    return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(params[key] ?? ""));
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguageState] = useState<Language>("ru");

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const savedLanguage = await SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY);

                if (isLanguage(savedLanguage)) {
                    setLanguageState(savedLanguage);
                }
            } catch (error) {
                console.warn("[language] failed to load saved language:", error);
            }
        };

        loadLanguage();
    }, []);

    const setLanguage = useCallback(async (nextLanguage: Language) => {
        setLanguageState(nextLanguage);

        try {
            await SecureStore.setItemAsync(LANGUAGE_STORAGE_KEY, nextLanguage);
        } catch (error) {
            console.warn("[language] failed to save language:", error);
        }
    }, []);

    const toggleLanguage = useCallback(async () => {
        await setLanguage(language === "ru" ? "en" : "ru");
    }, [language, setLanguage]);

    const t = useCallback((key: TranslationKey, params?: TranslationParams) => {
        const value: string = translations[language][key] ?? translations.ru[key];
        return interpolate(value, params);
    }, [language]);

    const tList = useCallback((key: TranslationKey) => {
        const value: string = translations[language][key] ?? translations.ru[key];
        return [value];
    }, [language]);

    const value = useMemo(() => ({
        language,
        setLanguage,
        toggleLanguage,
        t,
        tList,
    }), [language, setLanguage, toggleLanguage, t, tList]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }

    return context;
};