import React, { useState } from "react";
import { Button } from "@/shared/ui/Button";

export interface VetProfile {
    fullName: string;
    description: string;
    clinic: string;
    experience: number;
    license: string;
    city: string;
    address: string;
    avatarUrl: string;
    coverUrl: string;
}

type FormFieldProps = {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    type?: string;
    as?: 'input' | 'textarea';
    rows?: number;
};

const FormField = ({ label, name, as = 'input', ...props }: FormFieldProps) => {
    const Component = as;
    return (
        <div>
            <label htmlFor={name} className="text-sm font-medium text-slate-500">
                {label}
            </label>
            <Component
                id={name}
                name={name}
                {...props}
                className="w-full mt-1 bg-transparent border-0 border-b-2 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:border-teal-500 transition-colors duration-300"
            />
        </div>
    );
};

const FormSection = ({ title, description, children }: { title: string, description?: string, children: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 sm:p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        <div className="p-4 sm:p-6">
            {children}
        </div>
    </div>
);

export const EditVetProfileForm = ({ initialData, onSave, onCancel }: {
    initialData: VetProfile;
    onSave: (data: VetProfile) => void;
    onCancel: () => void;
}) => {
    const [form, setForm] = useState(initialData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value, 10) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormSection
                title="Личные данные"
                description="Эта информация будет видна другим пользователям в вашем профиле."
            >
                <div className="space-y-6">
                    <FormField label="ФИО" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Иванов Иван Иванович" />
                    <FormField as="textarea" rows={4} label="О себе" name="description" value={form.description} onChange={handleChange} placeholder="Специализация, опыт, подход к работе..." />
                </div>
            </FormSection>

            <FormSection
                title="Профессиональная информация"
                description="Данные о вашей квалификации и месте работы."
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Клиника" name="clinic" value={form.clinic} onChange={handleChange} />
                    <FormField label="Стаж (полных лет)" name="experience" type="number" value={form.experience} onChange={handleChange} />
                    <FormField label="Номер лицензии" name="license" value={form.license} onChange={handleChange} />
                    <FormField label="Город" name="city" value={form.city} onChange={handleChange} />
                    <FormField label="Адрес клиники" name="address" value={form.address} onChange={handleChange}  />
                </div>
            </FormSection>
            
            <FormSection
                title="Настройки отображения"
                description="Ссылки на изображения для вашего аватара и обложки."
            >
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="URL аватара" name="avatarUrl" value={form.avatarUrl} onChange={handleChange} placeholder="https://..." />
                    <FormField label="URL обложки" name="coverUrl" value={form.coverUrl} onChange={handleChange} placeholder="https://..." />
                </div>
            </FormSection>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">Отмена</Button>
                <Button type="submit" variant="primary" className="w-full sm:w-auto">Сохранить изменения</Button>
            </div>
        </form>
    );
};