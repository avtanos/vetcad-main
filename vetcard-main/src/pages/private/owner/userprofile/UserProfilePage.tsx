import { useState, useEffect } from 'react';
import { useUserStore } from '@/entities/user/model/user-store';
import { UserProfileView } from '@/entities/user/ui/UserProfileView';
import { EditUserProfileForm } from '@/features/edit-user-profile/ui/EditUserProfileForm';

export const UserProfilePage = () => {
    const { user, setUser } = useUserStore();
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (!user) {
            const userFromStorage = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
            if (userFromStorage) setUser(userFromStorage);
        }
    }, [user, setUser]);

    if (!user) return <div>Нет данных пользователя</div>;
    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Профиль пользователя</h1>
            {editing ? (
                <EditUserProfileForm user={user} onSave={u => { setUser(u); setEditing(false); }} onCancel={() => setEditing(false)} />
            ) : (
                <UserProfileView user={user} onEdit={() => setEditing(true)} />
            )}
        </div>
    );
};