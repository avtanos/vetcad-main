import { useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/entities/user/model/useAuth';
import { useSidebarContext } from '../model/SidebarContext';
import { useOwnerNavConfig, useProfessionalNavConfig, usePartnerNavConfig, NavSection } from '../config/links';
import { Button } from '@/shared/ui/Button';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { Logo } from '@/shared/ui/Logo';
import { useTranslation } from 'react-i18next';

const SidebarContent = ({
  isCollapsed,
  onCollapseToggle,
  navConfig,
  onCloseMobile,
  onLogout,
}: {
  isCollapsed: boolean;
  onCollapseToggle: () => void;
  navConfig: NavSection[];
  onCloseMobile: () => void;
  onLogout: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 h-17 flex justify-between items-center border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center">
          <Logo />
        </div>
        <button onClick={onCloseMobile} className="p-2 lg:hidden text-slate-500 hover:text-slate-800">
          <FaTimes />
        </button>
      </div>

      <nav className="flex-grow p-3 space-y-4 overflow-y-auto">
        {navConfig.map((section) => (
          <div key={section.title}>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  {section.title}
                </motion.h3>
              )}
            </AnimatePresence>
            <ul className="space-y-1">
              {section.links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        isActive ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-800 hover:bg-slate-100'
                      } ${isCollapsed ? 'justify-center' : 'space-x-4'}`
                    }
                    onClick={onCloseMobile}
                  >
                    <div className="text-xl w-6 flex justify-center">{link.icon}</div>
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.1 }}
                          className="flex-1 whitespace-nowrap"
                        >
                          {link.text}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3 flex justify-start items-end mt-auto lg:hidden">
        <Link to="/">
          <Button onClick={() => { onLogout(); onCloseMobile(); }} variant="outline" className="text-sm py-2 px-4">
            {t("auth.logout")}
          </Button>
        </Link>
      </div>

      <div className="p-3 mt-auto hidden lg:block flex-shrink-0">
        <button
          onClick={onCollapseToggle}
          className={`w-full flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors text-slate-800 hover:bg-slate-100 ${
            isCollapsed ? 'justify-center' : 'space-x-4'
          }`}
        >
          <div className="text-xl w-6 flex justify-center">
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </div>
          <AnimatePresence>
            {!isCollapsed && <motion.span className="whitespace-nowrap">{t("sidebar.collapse")}</motion.span>}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isOpen: isMobileOpen, close: closeMobileSidebar } = useSidebarContext();
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const navConfig = user?.role === 2
    ? useProfessionalNavConfig()
    : user?.role === 3
      ? usePartnerNavConfig()
      : useOwnerNavConfig();

  return (
    <>
      <motion.aside
        animate={{ width: isDesktopCollapsed ? '5.5rem' : '16rem' }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="hidden lg:flex bg-white border-r border-slate-200 flex-col"
      >
        <SidebarContent
          isCollapsed={isDesktopCollapsed}
          onCollapseToggle={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
          navConfig={navConfig}
          onCloseMobile={closeMobileSidebar}
          onLogout={logout}
        />
      </motion.aside>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileSidebar}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed top-0 left-0 h-full w-full max-w-xs bg-white shadow-xl"
            >
              <SidebarContent
                isCollapsed={false}
                onCollapseToggle={closeMobileSidebar}
                navConfig={navConfig}
                onCloseMobile={closeMobileSidebar}
                onLogout={logout}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
