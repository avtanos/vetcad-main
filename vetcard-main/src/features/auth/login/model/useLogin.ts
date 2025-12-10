import { useState } from "react";
import { useAuth } from "@/entities/user/model/useAuth";
import { useNavigate } from "react-router-dom";
import { api } from "@/shared/api";
import { usePets } from '@/entities/pet/model/PetContext';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const { fetchPets } = usePets();

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const tokenData = await api.post<{ username: string; password: string }, { access: string; refresh: string }>(
        '/v1/auth/token/',
        { username, password }
      );
      localStorage.setItem('authToken', tokenData.access);
      localStorage.setItem('refreshToken', tokenData.refresh);

      const accessToken = tokenData.access;
      const userProfile = await api.get<any>('/v1/auth/get_profile/', {
        Authorization: `Bearer ${accessToken}`
      });
      localStorage.setItem('user', JSON.stringify(userProfile));
      if (authLogin) authLogin(userProfile, accessToken);

      await fetchPets();

      let route = '/dashboard';
      if (userProfile.role === 2) route = '/vet/mydata';
      if (userProfile.role === 3) route = '/partner/mydata';
      navigate(route);
    } catch (e) {
      setError("Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
