
import { useState, useCallback, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { FaPaw } from 'react-icons/fa';

export const ImageUpload = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');

    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Фото питомца</label>
            <div className="mt-1 flex items-center gap-5">
                <motion.div 
                    className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                >
                    {preview ? (
                        <img src={preview} alt="Pet preview" className="h-full w-full object-cover" />
                    ) : (
                        <FaPaw className="h-8 w-8 text-slate-400" /> 
                    )}
                </motion.div>
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500">
                    <span>{fileName || 'Загрузить фото'}</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                </label>
            </div>
        </div>
    );
};

