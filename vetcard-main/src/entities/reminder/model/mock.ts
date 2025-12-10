
import { Reminder } from './types';

export const mockReminders: Reminder[] = [
    {
        id: '1',
        animalName: 'Рекс',
        event: 'Ежегодная прививка',
        date: '2025-07-15',
        status: 'Запланировано',
    },
    {
        id: '2',
        animalName: 'Мурка',
        event: 'Стрижка когтей',
        date: '2025-07-20',
        status: 'Запланировано',
    },
    {
        id: '3',
        date: '2025-06-25',
        animalName: 'Рекс',
        event: 'Таблетка от клещей',
        status: 'Сделано',
    },
    {
        id: '4',
        date: '2025-08-01',
        animalName: 'Все питомцы',
        event: 'Купить корм',
        status: 'Запланировано',
    },
    {
        id: '5',
        date: '2025-05-30',
        animalName: 'Кеша',
        event: 'Плановый осмотр',
        status: 'Сделано',
    },
];