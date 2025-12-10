import { useAuth } from "@/entities/user/model/useAuth";
import PublicNav from "./parts/PublicNav";
import { AuthNav } from "./parts/AuthNav";

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-lg z-10">
      <div className="absolute top-4 left-10 flex items-center gap-4">
      </div>
      <div className="container mx-auto px-6 py-3 flex justify-end items-center border-b border-slate-200">
        {isAuthenticated && user ? (
          <AuthNav
            user={{
              name: (() => {
                const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
                if (!fullName && user.role === 4) {
                  return 'Администратор Системы';
                }
                return fullName || user.username || 'Пользователь';
              })(),
              role: user.role === 4 ? 'admin' : user.role === 2 ? 'professional' : user.role === 3 ? 'partner' : 'owner',
              userId: user.id,
            }}
            onLogout={logout}
          />
        ) : <PublicNav />}
      </div>
    </header>
  );
};