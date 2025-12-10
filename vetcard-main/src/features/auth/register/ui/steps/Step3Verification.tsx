import  { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { FormInput } from '@/shared/ui/FormInput';
import { StepWrapper } from '@/shared/ui/StepWrapper';
import { Button } from '@/shared/ui/Button';
import type { StepProps } from '../types';

export const Step3Verification = memo(({ data, errors, updateField }: StepProps) => {
  const { t } = useTranslation();

  return (
    <StepWrapper title={t('register_form.step3.title', 'Подтверждение почты')} description={t('register_form.step3.description', { email: data.email || 'вашу почту' })}>
      <FormInput
        label={t('register_form.step3.code', 'Код подтверждения')}
        name="verificationCode"
        maxLength={6}
        value={data.verificationCode || ''}
        onChange={e => updateField('verificationCode', e.target.value)}
        error={errors.verificationCode}
        autoFocus
        className="text-center tracking-widest text-lg border"
      />
      <div className="flex flex-col justify-center w-[15rem] gap-2 mt-4">
        <Button type="button" >
          {t('register_form.step3.resend', 'Отправить код повторно')}
        </Button>
      </div>
    </StepWrapper>
  );
});