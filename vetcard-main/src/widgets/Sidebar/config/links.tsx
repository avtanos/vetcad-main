import { useTranslation } from "react-i18next";
import { FaHome, FaPaw, FaRobot, FaBell, FaNewspaper, FaShoppingBag, FaUserMd, FaBriefcase, FaBuilding, FaUsers, FaBox, FaStethoscope } from 'react-icons/fa';
import type { ReactElement } from "react";

export interface NavLinkItem {
  to: string;
  icon: ReactElement;
  text: string;
}

export interface NavSection {
  title: string;
  links: NavLinkItem[];
}

export const useOwnerNavConfig = (): NavSection[] => {
  const { t } = useTranslation();

  return [
    {
      title: t("sidebar.management"),
      links: [
        { to: "/dashboard", icon: <FaHome />, text: t("sidebar.home") },
        { to: "/mypets", icon: <FaPaw />, text: t("sidebar.mypets") },
        { to: "/reminders", icon: <FaBell />, text: t("sidebar.reminders") },
      ]
    },
    {
      title: t("sidebar.tools"),
      links: [
        { to: "/assistant", icon: <FaRobot />, text: t("sidebar.assistant") },
        { to: "/articles", icon: <FaNewspaper />, text: t("sidebar.articles") },
        { to: "/products", icon: <FaShoppingBag />, text: t("sidebar.products") },
        { to: "/my-products", icon: <FaBox />, text: t("sidebar.myProducts") },
        { to: "/specialists", icon: <FaStethoscope />, text: t("sidebar.specialists") },
      ]
    }
  ];
};

export const useProfessionalNavConfig = (): NavSection[] => {
  const { t } = useTranslation();

  return [
    {
      title: t("sidebar.workspace"),
      links: [
        { to: "/vet/mydata", icon: <FaUserMd />, text: t("sidebar.mydata") },
        { to: "/vet/cabinet", icon: <FaBriefcase />, text: t("sidebar.cabinet") },
      ]
    },
    {
      title: t("sidebar.tools"),
      links: [
        { to: "/assistant", icon: <FaRobot />, text: t("sidebar.assistant") },
        { to: "/articles", icon: <FaNewspaper />, text: t("sidebar.articles") },
        { to: "/products", icon: <FaShoppingBag />, text: t("sidebar.products") },
        { to: "/my-products", icon: <FaBox />, text: t("sidebar.myProducts") },
        { to: "/specialists", icon: <FaStethoscope />, text: t("sidebar.specialists") },
      ]
    }
  ];
};

export const usePartnerNavConfig = (): NavSection[] => {
  const { t } = useTranslation();

  return [
    {
      title: t("sidebar.workspace"),
      links: [
        { to: "/partner/mydata", icon: <FaUserMd />, text: t("sidebar.mydata") },
        { to: "/partner/cabinet", icon: <FaBuilding />, text: t("sidebar.cabinet") },
      ]
    },
    {
      title: t("sidebar.tools"),
      links: [
        { to: "/assistant", icon: <FaRobot />, text: t("sidebar.assistant") },
        { to: "/articles", icon: <FaNewspaper />, text: t("sidebar.articles") },
        { to: "/products", icon: <FaShoppingBag />, text: t("sidebar.products") },
        { to: "/my-products", icon: <FaBox />, text: t("sidebar.myProducts") },
        { to: "/specialists", icon: <FaStethoscope />, text: t("sidebar.specialists") },
      ]
    }
  ];
};

export const useAdminNavConfig = (): NavSection[] => {
  const { t } = useTranslation();

  return [
    {
      title: t("sidebar.admin"),
      links: [
        { to: "/admin", icon: <FaUsers />, text: t("sidebar.adminPanel") },
      ]
    },
    {
      title: t("sidebar.tools"),
      links: [
        { to: "/assistant", icon: <FaRobot />, text: t("sidebar.assistant") },
        { to: "/articles", icon: <FaNewspaper />, text: t("sidebar.articles") },
        { to: "/products", icon: <FaShoppingBag />, text: t("sidebar.products") },
        { to: "/my-products", icon: <FaBox />, text: t("sidebar.myProducts") },
        { to: "/specialists", icon: <FaStethoscope />, text: t("sidebar.specialists") },
      ]
    }
  ];
};
