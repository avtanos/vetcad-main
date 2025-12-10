import { useState, useMemo } from 'react';
import { FaNewspaper } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import { ArticleCard } from '@/entities/article/ui/ArticleCard';
import { SearchArticles } from '@/features/search-articles/ui/SearchArticles';
import { CategoryPicker } from '@/features/search-articles/ui/parts/CategoryPicker';
import { useArticles } from '@/entities/article/data/useArticles';
import { Loader } from '@/shared/ui/Loader';

export const ArticlesPage = () => {
    const { t } = useTranslation();
    const categories = [
        t('articles.categories.all'),
        t('articles.categories.nutrition'),
        t('articles.categories.care'),
        t('articles.categories.health'),
        t('articles.categories.behavior')
    ];

    const [activeCategory, setActiveCategory] = useState(t('articles.categories.all'));
    const [searchQuery, setSearchQuery] = useState('');
    const { articles, loading, error } = useArticles();

    const filteredArticles = useMemo(() => {
        let filtered = articles;
        if (activeCategory !== t('articles.categories.all')) {
            filtered = filtered.filter(article => article.category === activeCategory);
        }
        if (searchQuery.trim() !== '') {
            filtered = filtered.filter(article =>
                article.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return filtered;
    }, [articles, activeCategory, searchQuery, t]);

    if (loading) {
        return <div className="text-center py-12"><Loader /></div>;
    }
    if (error) {
        return <div className="text-center py-12 text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
                        <FaNewspaper className="text-teal-500" />
                        {t('articles.title')}
                    </h1>
                    <p className="mt-2 text-slate-600">{t('articles.description')}</p>
                </div>
                <SearchArticles value={searchQuery} onChange={setSearchQuery} />
            </header>

            <div className="hidden sm:flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                            activeCategory === category
                                ? 'bg-teal-500 text-white shadow'
                                : 'text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="sm:hidden">
                <CategoryPicker
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />
            </div>

            {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredArticles.map(article => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-slate-700">{t('articles.notFound.title')}</h3>
                    <p className="text-slate-500 mt-2">{t('articles.notFound.description')}</p>
                </div>
            )}
        </div>
    );
};
