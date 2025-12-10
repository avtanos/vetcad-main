export interface Assistant {
    id: string;
    date: string;
    animalName: string;
    assistant_sms: string;
    status: 'Запланировано' | 'Сделано';

}


export interface Reminder {
    id: string;
    date: string;
    animalName: string;
    assistant_sms: string; 
    status: 'Запланировано' | 'Сделано';
  }