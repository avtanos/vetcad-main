import React, { memo } from 'react';
import { FormInput } from '@/shared/ui/FormInput';
import { StepWrapper } from '@/shared/ui/StepWrapper';
import type { StepProps } from '../types';

export const Step2PersonalInfo = memo(({ data, errors, updateField }: StepProps) => (
    <StepWrapper title="Личные данные" description="Введите вашу электронную почту для начала.">
        <FormInput
            label="Электронная почта"
            name="email"
            type="email"
            value={data.email || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('email', e.target.value)}
            error={errors.email}
        />
    </StepWrapper>
));