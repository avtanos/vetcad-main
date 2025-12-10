import React, { useState, useEffect, useRef } from 'react';

interface AutocompleteInputProps {
  label: string;
  name: string;
  options: string[];
  value: string;
  error?: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  label,
  name,
  options,
  value,
  error,
  onChange,
}) => {
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    setFilteredOptions(
      options.filter(option =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
    setShowOptions(true);
  };

  const handleOptionClick = (option: string) => {
    onChange(option);
    setFilteredOptions([]);
    setShowOptions(false);
  };

  return (
    <div className="relative mb-4" ref={wrapperRef}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      <div className="relative">
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={handleInputChange}
          className={`w-full p-3 pr-10 rounded-xl border ${error ? 'border-red-500' : 'border-gray-300'} text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition`}
          autoComplete="off"
          onFocus={() => setShowOptions(true)}
        />

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

      {showOptions && filteredOptions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 mt-2 rounded-md shadow-md w-full max-h-48 overflow-y-auto">
          {filteredOptions.map(option => (
            <li
              key={option}
              className="p-2 hover:bg-teal-100 cursor-pointer text-gray-700"
              onClick={() => handleOptionClick(option)}
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
