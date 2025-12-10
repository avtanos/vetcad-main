
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

export function parseRuDate(dateStr: string): string {
  if (typeof dayjs === 'function') {
    const parsed = dayjs(dateStr, 'D MMMM YYYY, HH:mm', 'ru');
    if (parsed.isValid()) return parsed.toISOString();
  }
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];
  const match = dateStr.match(/(\d{1,2}) ([а-я]+) (\d{4}), (\d{2}):(\d{2})/i);
  if (match) {
    const [, d, m, y, h, min] = match;
    const month = months.indexOf(m.toLowerCase());
    if (month !== -1) {
      const iso = new Date(Number(y), month, Number(d), Number(h), Number(min)).toISOString();
      return iso;
    }
  }
  return new Date().toISOString();
} 