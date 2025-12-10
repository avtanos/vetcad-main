import { memo } from 'react';
import { motion } from 'framer-motion';
import { Article } from '../model/types';

export const ArticleCard = memo(({ article }: { article: Article }) => {
    return (
        <motion.div
            className="group flex flex-col bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <div className="overflow-hidden relative">
                <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
            </div>
            <div className="p-5 sm:p-6 flex flex-col flex-grow">
                <p className="text-xs sm:text-sm font-semibold text-green-600 mb-2">{article.category}</p>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex-grow mb-3 line-clamp-2">
                    <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors">
                        {article.title}
                    </a>
                </h3>
                <p className="text-sm text-slate-600 line-clamp-3 mb-4">{article.excerpt}</p>
                <div className="mt-auto flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 min-w-0">
                        <img 
                            src={article.author.avatarUrl} 
                            alt={article.author.name} 
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0" 
                        />
                        <span className="truncate">{article.author.name}</span>
                    </div>
                    <span className="flex-shrink-0 ml-2">
                        {new Date(article.publishedDate).toLocaleDateString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })}
                    </span>
                </div>
            </div>
        </motion.div>
    );
});