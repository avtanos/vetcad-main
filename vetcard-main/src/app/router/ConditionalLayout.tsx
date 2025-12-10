import { useAuth } from '@/entities/user/model/useAuth';
import { PublicLayout } from '../layouts/PublicLayout';
import { OwnerLayout } from '../entrypoints/owner';
import { CommonLayout } from '../entrypoints/common';
import { PartnerLayout } from '../entrypoints/partner';

/**
 * Компонент, который выбирает нужный layout в зависимости от авторизации пользователя
 * Для неавторизованных - PublicLayout
 * Для авторизованных - соответствующий layout с Sidebar
 */
export const ConditionalLayout = () => {
  const { isAuthenticated, user } = useAuth();

  // Если пользователь не авторизован, используем публичный layout
  if (!isAuthenticated || !user) {
    return <PublicLayout />;
  }

  // Для авторизованных пользователей выбираем layout в зависимости от роли
  const role = Number(user.role);
  
  if (role === 1) {
    // Владелец питомца
    return <OwnerLayout />;
  } else if (role === 2) {
    // Ветеринар
    return <CommonLayout />;
  } else if (role === 3) {
    // Партнер
    return <PartnerLayout />;
  } else if (role === 4) {
    // Админ
    return <CommonLayout />;
  }

  // По умолчанию публичный layout
  return <PublicLayout />;
};

