import { useState } from "react";
import { NavLink } from "@/shared/ui/NavLink"; 
import { Button } from "@/shared/ui/Button";
import { Logo } from "@/shared/ui/Logo";
import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PublicNav = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/") }>
        <Logo />
      </div>

      <nav className="hidden md:flex items-center gap-6">
        <NavLink to="/">{t("home")}</NavLink>
        <NavLink to="/about">{t("about")}</NavLink>
        <LanguageSwitcher />
        <Button to="/login" variant="outline" className="text-sm py-2 px-4">
          {t("login")}
        </Button>
        <Button to="/register" variant="primary" className="text-sm py-2 px-4">
          {t("register")}
        </Button>
      </nav>

      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          aria-label="Открыть меню"
          className="text-slate-700 hover:text-slate-900"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg border-b border-slate-200 md:hidden flex flex-col items-center gap-5 py-5"
          >
            <NavLink to="/" onClick={toggleMenu}>
              {t("home")}
            </NavLink>
            <NavLink to="/about" onClick={toggleMenu}>
              {t("about")}
            </NavLink>
            <LanguageSwitcher />
            <hr className="w-11/12 border-slate-200" />
            <div className="flex flex-col gap-4 w-11/12 max-w-xs">
              <Button to="/login" variant="outline" className="w-full" onClick={toggleMenu}>
                {t("login")}
              </Button>
              <Button to="/register" variant="primary" className="w-full" onClick={toggleMenu}>
                {t("register")}
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicNav;