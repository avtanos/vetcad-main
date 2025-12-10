import { useState, useEffect } from 'react';
import { Reminder } from '@/entities/reminder/model/types';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/input';
import { useTranslation } from 'react-i18next';


interface ReminderFormProps {
    onSave: (data: Omit<Reminder, 'id' | 'status'>, id?: string) => void;
    onCancel: () => void;
    initialData?: Reminder | null;
}
  
export const ReminderForm = ({ onSave, onCancel, initialData }: ReminderFormProps) => {
    const { t } = useTranslation();
    const [date, setDate] = useState('');
    const [event, setEvent] = useState('');

    useEffect(() => {
        if (initialData) {
            setDate(initialData.date);
            setEvent(initialData.event);
        } else {
            setDate('');
            setEvent('');
        }
    }, [initialData]);
  
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !event) {
            alert(t("reminderForm.alertMissingFields"));
            return;
        }
        onSave({ date, event, animalName: '' }, initialData?.id);
    };
  
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                label={t("reminderForm.eventLabel")}
                type="text"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                placeholder={t("reminderForm.eventPlaceholder")}
                required
            />
            <Input
                label={t("reminderForm.dateLabel")}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />
            
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button type="button" variant="outline" onClick={onCancel}>{t("reminderForm.cancel")}</Button>
                <Button type="submit">{initialData ? t("reminderForm.save") : t("reminderForm.add")}</Button>
            </div>
        </form>
    );
};