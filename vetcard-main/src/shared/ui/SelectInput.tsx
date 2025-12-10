import React, { useState, useEffect, useRef } from 'react';

interface CustomSelectProps {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const SelectInput: React.FC<CustomSelectProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setShowOptions(false);
  };

  return (
    <div className="relative mb-4" ref={wrapperRef}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      <div
        className="w-full p-3 rounded-xl border border-gray-300 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm cursor-pointer relative"
        onClick={() => setShowOptions(prev => !prev)}
      >
        <span className={`${value ? 'text-gray-900' : 'text-gray-400'}`}>
          {value || 'Выберите...'}
        </span>

        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {showOptions && (
        <ul className="absolute z-10 bg-white border border-gray-300 mt-2 rounded-md shadow-md w-full max-h-48 overflow-y-auto">
          {options.map(option => (
            <li
              key={option}
              className="p-2 hover:bg-teal-100 cursor-pointer text-gray-700"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
