import { NavLink as RouterNavLink } from "react-router-dom";
import type { ReactNode } from 'react';

interface NavLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const NavLink = ({ to, children, className, onClick }: NavLinkProps) => { 
  const baseClasses = "font-medium text-md transition-colors duration-200";
  const activeClass = "text-slate-900";
  const inactiveClass = "text-slate-500 hover:text-slate-900";

  return (
    <RouterNavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `${baseClasses} ${isActive ? activeClass : inactiveClass} ${className || ''}`
      }
    >
      {children}
    </RouterNavLink>
  );
};