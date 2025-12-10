import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

interface CategoryPickerProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

export const CategoryPicker = ({ categories, activeCategory, onCategoryChange }: CategoryPickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    const handleSelect = (category: string) => {
        onCategoryChange(category);
        setIsOpen(false);
    };

    return (
        <div ref={pickerRef} className="relative sm:hidden w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center px-4 py-2 sm:py-2.5 bg-white border border-slate-300 rounded-xl text-left text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/80"
            >
                <span className="font-medium">{activeCategory}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <FaChevronDown className="text-slate-400" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
                    >
                        {categories.map(category => (
                            <li
                                key={category}
                                onClick={() => handleSelect(category)}
                                className={`px-4 py-2.5 cursor-pointer transition-colors ${
                                    activeCategory === category 
                                        ? 'bg-teal-500 text-white font-semibold' 
                                        : 'text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                {category}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};