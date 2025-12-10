import { create } from 'zustand';
import type { User } from './types'; 

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean; 
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

export const useUserStore = create<UserState>((set) => ({
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: !!savedUser,
    isLoading: false,
    setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
    setLoading: (loading) => set({ isLoading: loading }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));