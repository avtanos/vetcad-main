import { Link } from "react-router-dom";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { useSidebarContext } from '@/widgets/Sidebar/model/SidebarContext';
import { Button } from "@/shared/ui/Button";
import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher";

export interface AuthNavProps {
  user: {
    name: string;
    role: string;
    userId?: number;
  };
  onLogout: () => void;
}

export const AuthNav = ({ user, onLogout }: AuthNavProps) => {
  const { toggle: toggleSidebar } = useSidebarContext();

  const getProfileLink = () => {
    if (user.role === "admin") {
      return user.userId ? `/admin/users/${user.userId}` : "/admin";
    }
    if (user.role === "professional") {
      return "/vet/mydata";
    }
    if (user.role === "partner") {
      return "/partner/mydata";
    }
    return "/userprofile";
  };

  return (
    <>
      <nav className="hidden lg:flex items-center gap-6">
        <Link
          to={getProfileLink()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <FaUserCircle className="w-8 h-8 text-slate-300" />
          <span className="text-sm font-medium">{user.name}</span>
        </Link>

        <LanguageSwitcher />

        <Button onClick={onLogout} variant="outline" className="text-sm py-2 px-4">
          Выйти
        </Button>
      </nav>

      {/* Мобильная версия */}
      <div className="lg:hidden flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <Link
            to={getProfileLink()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <FaUserCircle className="w-8 h-8 text-slate-300" />
            <span className="text-sm font-medium">{user.name}</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <button onClick={toggleSidebar} className="p-2 text-slate-800">
            <FaBars size={20} />
          </button>
        </div>
      </div>
    </>
  );
};
