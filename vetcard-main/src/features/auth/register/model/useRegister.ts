import { useState } from 'react';
import { useUserStore } from '@/entities/user/model/user-store';
import { UserRegistrationData, User } from '@/entities/user/model/types';
import { api } from '@/shared/api';
import { useAuth } from '@/entities/user/model/useAuth';
import { usePets } from '@/entities/pet/model/PetContext';

interface RegisterRequestData {
    username: string;
    email: string;
    password: string;
    password2: string;
}

const getRoleId = (userType: string): number => {
    switch (userType) {
        case 'petOwner': return 1;
        case 'veterinarian': return 2;
        case 'partner': return 3;
        default: return 1;
    }
};

export const useRegister = () => {
    const { setUser, setLoading, isLoading } = useUserStore();
    const [serverError, setServerError] = useState<string | null>(null);
    const { login } = useAuth();
    const { fetchPets } = usePets();

    const registerInitialUser = async (
        data: Pick<UserRegistrationData, 'username' | 'email' | 'password'>,
        confirmPassword: string
    ): Promise<{ user: User; access: string; refresh: string }> => {
        setLoading(true);
        setServerError(null);

        const requestBody: RegisterRequestData = {
            username: data.username,
            email: data.email,
            password: data.password,
            password2: confirmPassword,
        };

        try {
            const registeredUser = await api.post<RegisterRequestData, User>('/v1/auth/register/', requestBody);

            const tokenData = await api.post<{ username: string; password: string }, { access: string; refresh: string }>(
                '/v1/auth/token/',
                { username: data.username, password: data.password }
            );
            return { user: registeredUser, access: tokenData.access, refresh: tokenData.refresh };
        } catch (error: any) {
            const errorMessage = error.message || 'Ошибка на этапе создания аккаунта';
            setServerError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

  
    const updateProfile = async (user: User, fullData: UserRegistrationData, accessToken: string, refreshToken: string) => {
        setLoading(true);
        setServerError(null);

        const profilePayload: Record<string, any> = {
            first_name: fullData.firstName,
            last_name: fullData.lastName,
            third_name: fullData.middleName,
            role: getRoleId(fullData.userType),
        };

        if (fullData.userType === 'veterinarian') {
            Object.assign(profilePayload, {
                clinic: fullData.clinicName,
                position: fullData.position,
                specialization: fullData.specialization,
                experience: fullData.experience,
                license_number: fullData.licenseNumber,
                city: fullData.vetCity,
                address: fullData.vetAddress,
            });
        } else if (fullData.userType === 'partner') {
             Object.assign(profilePayload, {
                name_of_organization: fullData.partnerName,
                type: fullData.partnerType,
                city: fullData.partnerCity,
                address: fullData.partnerAddress,
                phone: fullData.partnerPhone,
                website: fullData.partnerWebsite,
                description: fullData.partnerDescription,
            });
        }
        
        try {
            await api.put<Record<string, any>, User>(
                `/v1/auth/profile/${user.profile_id}/`,
                profilePayload,
                { Authorization: `Bearer ${accessToken}` }
            );

            const fullProfile = await api.get<User>('/v1/auth/get_profile/', {
                Authorization: `Bearer ${accessToken}`
            });

            console.log('[REGISTRATION] Сохраняем user в localStorage:', fullProfile);

            localStorage.setItem('authToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(fullProfile));

            setUser(fullProfile);
            if (login) login(fullProfile, accessToken);

            await fetchPets();

        } catch (error: any) {
            setServerError(error.message || 'Ошибка при сохранении данных профиля');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { registerInitialUser, updateProfile, isLoading, serverError, setServerError };
};