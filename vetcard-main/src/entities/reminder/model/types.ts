
export type ReminderStatus = 'Запланировано' | 'Сделано';

export interface Reminder {
  id: string;
  animalName: string; 
  event: string;      
  date: string;      
  status: ReminderStatus;
}