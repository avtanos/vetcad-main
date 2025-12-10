import { useState, useEffect } from 'react';
import { changeLanguage} from '@/locale/i18n'; 
import  i18nInstance  from '@/locale/i18n'; 

export const LanguageSwitcher = () => {
    const [activeLang, setActiveLang] = useState(i18nInstance.language);

    useEffect(() => {
        const handleLanguageChanged = (lng: string) => {
            setActiveLang(lng);
        };
        i18nInstance.on('languageChanged', handleLanguageChanged);

        return () => {
            i18nInstance.off('languageChanged', handleLanguageChanged);
        };
    }, []);


    const handleLanguageChange = (language: 'ru' | 'kg' | 'en') => {
        changeLanguage(language);
    };

    const baseButtonStyles = "px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm rounded-lg font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500";

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={() => handleLanguageChange('ru')}
                className={`${baseButtonStyles} ${
                    activeLang === 'ru'
                        ? 'bg-slate-800 text-white shadow-md'
                        : 'bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-900'
                }`}
            >
                RU
            </button>
            <button
                onClick={() => handleLanguageChange('kg')}
                className={`${baseButtonStyles} ${
                    activeLang === 'kg'
                        ? 'bg-slate-800 text-white shadow-md'
                        : 'bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-900'
                }`}
            >
                KG
            </button>
            <button
                onClick={() => handleLanguageChange('en')}
                className={`${baseButtonStyles} ${
                    activeLang === 'en'
                        ? 'bg-slate-800 text-white shadow-md'
                        : 'bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-900'
                }`}
            >
                EN
            </button>
        </div>
    );
};