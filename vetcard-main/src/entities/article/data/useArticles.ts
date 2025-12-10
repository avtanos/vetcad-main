import { useEffect, useState } from 'react';
import { api } from '@/shared/api';
import { parseRuDate } from '@/shared/lib/parseRuDate';
import type { Article } from '../model/types';

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        // Публичный endpoint, токен не обязателен
        const data = await api.get<any[]>('/v1/parser/articles/');
        const mapped = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt,
          imageUrl: item.image_url || 'https://via.placeholder.com/400x300?text=No+Image',
          category: item.category,
          publishedDate: parseRuDate(item.published_date),
          author: {
            name: item.author?.name || 'Автор не указан',
            avatarUrl: item.author?.avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg',
          },
          sourceUrl: item.source_url,
        }));
        setArticles(mapped);
      } catch (e: any) {
        console.error('Ошибка загрузки статей:', e);
        setError(e.message || 'Ошибка загрузки статей');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return { articles, loading, error };
} 