import { FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';


interface SearchArticlesProps {
    value: string;
    onChange: (query: string) => void;
}

export const SearchArticles = ({ value, onChange }: SearchArticlesProps) => {
        const { t } = useTranslation();

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t("articlesFind.searchPlaceholder") || "Найти статью..."}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-lg
                           text-slate-900 placeholder:text-slate-400 text-sm sm:text-base
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 
                           transition-all duration-200"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <FaSearch className="w-4 h-4" />
            </div>
        </div>
    );
};