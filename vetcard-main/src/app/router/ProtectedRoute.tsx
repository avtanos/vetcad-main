import { Navigate } from 'react-router-dom';
import { useAuth } from '@/entities/user/model/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: number[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(Number(user.role))) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
};