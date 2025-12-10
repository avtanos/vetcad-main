import  { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { FormInput } from '@/shared/ui/FormInput';
import { StepWrapper } from '@/shared/ui/StepWrapper';
import type { StepProps } from '../types';

type Step1CredentialsProps = StepProps & {
  confirmPassword_val: string;
  setConfirmPassword_val: (val: string) => void;
};

export const Step1Credentials = memo(({ data, errors, updateField, confirmPassword_val, setConfirmPassword_val }: Step1CredentialsProps) => {
  const { t } = useTranslation();

  return (
    <StepWrapper title={t('register_form.step1.title')} description={t('register_form.step1.description')}>
      <FormInput label={t('register_form.step1.username')} name="username" value={data.username || ''} onChange={e => updateField('username', e.target.value)} error={errors.username} />
      <FormInput label={t('register_form.step1.password')} name="password" type="password" value={data.password || ''} onChange={e => updateField('password', e.target.value)} error={errors.password} />
      <FormInput label={t('register_form.step1.confirmPassword')} name="confirmPassword" type="password" value={confirmPassword_val} onChange={e => setConfirmPassword_val(e.target.value)} error={errors.confirmPassword} />
    </StepWrapper>
  );
});