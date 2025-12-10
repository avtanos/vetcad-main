import type { UserRegistrationData } from "@/entities/user/model/types";

export type StepProps = {
    data: Partial<UserRegistrationData>;
    errors: Partial<Record<keyof UserRegistrationData | 'confirmPassword', string>>;
    updateField: (field: keyof UserRegistrationData, value: any) => void;
    userId?: number;
};