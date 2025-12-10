import { FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';


interface SearchArticlesProps {
    value: string;
    onChange: (query: string) => void;
}

export const SearchArticles = ({ value, onChange }: SearchArticlesProps) => {
        const { t } = useTranslation();

    return (
        <div className="relative w-full md:max-w-sm">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t ("articlesFind.searchPlaceholder")}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-white sm:bg-slate-50 border border-slate-200 rounded-xl
                           text-slate-900 placeholder:text-slate-400
                           focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/80 focus:border-teal-500 
                           transition-all duration-300"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <FaSearch />
            </div>
        </div>
    );
};