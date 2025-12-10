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
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-6 lg:px-8">
            {/* Заголовок и поиск */}
            <header className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                    <div className="flex-1">
                        <h1 className="flex items-center gap-3 text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                            <FaNewspaper className="text-teal-500 flex-shrink-0" />
                            База знаний
                        </h1>
                        <p className="text-slate-600 text-base md:text-lg">
                            {t('articles.description') || 'Полезные статьи и советы по уходу за вашими питомцами.'}
                        </p>
                    </div>
                    <div className="lg:w-80 flex-shrink-0">
                        <SearchArticles value={searchQuery} onChange={setSearchQuery} />
                    </div>
                </div>

                {/* Фильтры категорий */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2
                       [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
                                activeCategory === category
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </header>

            {/* Мобильный выбор категории */}
            <div className="sm:hidden mb-6">
                <CategoryPicker
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />
            </div>

            {/* Сетка статей */}
            {loading ? (
                <div className="text-center py-12">
                    <Loader />
                </div>
            ) : error ? (
                <div className="text-center py-12 text-red-500">{error}</div>
            ) : filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
