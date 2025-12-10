import React from 'react';

interface StepWrapperProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export const StepWrapper = ({ title, description, children }: StepWrapperProps) => (
    <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-500 mb-6">{description}</p>
        <div className="space-y-4">{children}</div>
    </div>
);