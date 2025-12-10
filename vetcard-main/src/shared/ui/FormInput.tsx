import React, { memo, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  isTextArea?: boolean;
}

export const FormInput = memo(({ label, name, type = 'text', error, isTextArea = false, ...rest }: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const commonClasses = "w-full p-2 border border-gray-300 rounded-md transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const errorClasses = "border-red-500";

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const Element = isTextArea ? 'textarea' : 'input';

  return (
    <div className="relative">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <Element
          id={name}
          name={name}
          type={inputType}
          className={`${commonClasses} ${error ? errorClasses : ''} pr-10`}
          {...rest}
        />
        {type === 'password' && !isTextArea && (
          <div
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});
