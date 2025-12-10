import { memo } from 'react';
import { motion } from 'framer-motion';
import { Article } from '../model/types';

export const ArticleCard = memo(({ article }: { article: Article }) => {
    return (
        <motion.div
            className="group flex flex-col bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <div className="overflow-hidden">
                <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <p className="text-sm font-semibold text-teal-500">{article.category}</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900 flex-grow">
                    <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {article.title}
                    </a>
                </h3>
                <p className="mt-2 text-sm text-slate-600 line-clamp-3">{article.excerpt}</p>
                <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                        <img src={article.author.avatarUrl} alt={article.author.name} className="w-8 h-8 rounded-full" />
                        <span>{article.author.name}</span>
                    </div>
                    <span>{new Date(article.publishedDate).toLocaleDateString('ru-RU')}</span>
                </div>
            </div>
        </motion.div>
    );
});