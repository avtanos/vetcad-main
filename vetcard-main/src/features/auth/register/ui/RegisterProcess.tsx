import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { RegisterForm } from '@/widgets/RegisterForm/ui/RegisterForm';
import { INITIAL_REGISTRATION_DATA } from '@/entities/user/model/constants';
import type { UserRegistrationData, User } from '@/entities/user/model/types';
import { useUserStore } from '@/entities/user/model/user-store';
import { baseSteps, vetStep, partnerStep } from '../model/steps';
import { useRegister } from '../model/useRegister';
import { api } from '@/shared/api';

import { Step1Credentials } from './steps/Step1Credentials';
import { Step2PersonalInfo } from './steps/Step2PersonalInfo';
import { Step3Verification } from './steps/Step3Verification';
import { Step4PersonalNames } from './steps/Step4PersonalNames';
import { Step5UserType } from './steps/Step5UserType';
import { Step6Details } from './steps/Step6Details';

const getInitialState = () => {
    try {
        const savedProgress = localStorage.getItem('registrationProgress');
        if (savedProgress) {
            console.log("Найден сохраненный прогресс, восстанавливаем.");
            return JSON.parse(savedProgress);
        }
    } catch (error) {
        console.error("Не удалось прочитать сохраненный прогресс:", error);
    }
    return {
        data: INITIAL_REGISTRATION_DATA,
        currentStep: 0,
        confirmPassword: ''
    };
};


export const RegisterProcess = () => {
    const [initialState] = useState(getInitialState);
    const [data, setData] = useState<UserRegistrationData>(initialState.data);
    const [confirmPassword, setConfirmPassword] = useState<string>(initialState.confirmPassword);
    const [currentStep, setCurrentStep] = useState<number>(initialState.currentStep);
    const [errors, setErrors] = useState<Partial<Record<keyof UserRegistrationData | 'confirmPassword', string>>>({});
    const [createdUser, setCreatedUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const navigate = useNavigate();
    const { isAuthenticated, isLoading, user } = useUserStore();
    const { registerInitialUser, updateProfile, serverError, setServerError } = useRegister();

    const steps = useMemo(() => {
        if (data.userType === 'veterinarian') return [...baseSteps, vetStep];
        if (data.userType === 'partner') return [...baseSteps, partnerStep];
        return baseSteps;
    }, [data.userType]);

    useEffect(() => {
        const progress = { currentStep, data, confirmPassword };
        localStorage.setItem('registrationProgress', JSON.stringify(progress));
    }, [data, currentStep, confirmPassword]);

    useEffect(() => {
        if (isAuthenticated && user) {
            localStorage.removeItem('registrationProgress');
            let route = '/dashboard';
            if (user.role === 2) route = '/vet/mydata';
            if (user.role === 3) route = '/partner/mydata';
            const timer = setTimeout(() => navigate(route), 2000);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, user, navigate]);

    const updateField = useCallback((field: keyof UserRegistrationData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
        if (serverError) setServerError(null);
    }, [errors, serverError, setServerError]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            updateField('partnerLogo', e.target.files[0]);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(p => p - 1);
        }
    };

    const handleFinalSubmit = async () => {
        if (!createdUser || !accessToken) {
            setServerError("Сессия потеряна. Пожалуйста, попробуйте войти или начните регистрацию заново.");
            return;
        }
        try {
            const refreshToken = localStorage.getItem('refreshToken') || '';
            await updateProfile(createdUser, data, accessToken, refreshToken);
        } catch (error) {
            console.error("Ошибка при финальном обновлении профиля:", error);
        }
    };
    
    const handleStepCompletion = async () => {
        const newErrors: Partial<typeof errors> = {};
        let isValid = true;

        switch (currentStep) {
            case 0: 
                if (data.username.length < 4) { newErrors.username = 'Логин должен быть не менее 4 символов.'; isValid = false; }
                if (data.password.length < 6) { newErrors.password = 'Пароль должен быть не менее 6 символов.'; isValid = false; }
                if (data.password !== confirmPassword) { newErrors.confirmPassword = 'Пароли не совпадают.'; isValid = false; }
                break;
            case 1: 
                if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email)) { newErrors.email = 'Введите корректный email.'; isValid = false; }
                break;
            case 2:
                if (!data.verificationCode || !createdUser?.id) {
                    newErrors.verificationCode = 'Введите код из письма.';
                    isValid = false;
                } else {
                    try {
                        await api.post<{ user_id: number; code: string }, any>(
                            '/v1/auth/verify_code/',
                            { user_id: createdUser.id, code: data.verificationCode },
                            accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined
                        );
                    } catch (e) {
                        newErrors.verificationCode = 'Неверный код подтверждения.';
                        isValid = false;
                    }
                }
                break;
            case 3:
                if (!data.lastName.trim()) { newErrors.lastName = 'Пожалуйста, введите вашу фамилию.'; isValid = false; }
                if (!data.firstName.trim()) { newErrors.firstName = 'Пожалуйста, введите ваше имя.'; isValid = false; }
                break;
            case 4:
                if (!data.userType) { newErrors.userType = 'Пожалуйста, выберите тип регистрации.'; isValid = false; }
                break;
        }

        setErrors(newErrors);
        
        if (!isValid) return; 

        if (currentStep === 1) { 
            try {
                const result = await registerInitialUser(data, confirmPassword);
                setCreatedUser(result.user);
                setAccessToken(result.access);
                setCurrentStep(p => p + 1);
            } catch (error) { /* ошибка обработается в хуке */ }
            return;
        }

        const step5Index = baseSteps.findIndex(s => s.number === 5);
        if (currentStep === step5Index && data.userType === 'petOwner') {
            await handleFinalSubmit();
            return;
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(p => p + 1);
        } else {
            await handleFinalSubmit();
        }
    };

    const getButtonText = () => {
        const step5Index = baseSteps.findIndex(s => s.number === 5);
        if ((currentStep === step5Index && data.userType === 'petOwner') || (currentStep > 0 && currentStep === steps.length - 1)) {
            return 'Зарегистрироваться';
        }
        return 'Далее';
    };

    const stepComponents = [
        <Step1Credentials data={data} errors={errors} updateField={updateField} confirmPassword_val={confirmPassword} setConfirmPassword_val={setConfirmPassword} />,
        <Step2PersonalInfo data={data} errors={errors} updateField={updateField} />,
        <Step3Verification data={data} errors={errors} updateField={updateField} userId={createdUser?.id} />,
        <Step4PersonalNames data={data} errors={errors} updateField={updateField} />,
        <Step5UserType data={data} errors={errors} updateField={updateField} />,
        <Step6Details data={data} errors={errors} updateField={updateField} handleFileChange={handleFileChange} />
    ];

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
    <div className="w-full max-w-4xl">
        {serverError && (
            <div className="text-red-600 bg-red-100 p-3 rounded-lg mb-4 text-center text-sm">
                {serverError}
            </div>
        )}
        <RegisterForm
            steps={steps}
            currentStep={currentStep}
            stepComponent={stepComponents[currentStep]}
            isRegistered={isAuthenticated}
            isLoading={isLoading}
            onPrev={handlePrev}
            onNext={handleStepCompletion}
            submitButtonText={getButtonText()}
        />
    </div>
</div>
    );
};