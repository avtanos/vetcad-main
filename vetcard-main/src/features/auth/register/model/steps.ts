import { FaAddressCard, FaKey, FaUser, FaPaw, FaBriefcaseMedical, FaBuilding } from 'react-icons/fa';

export const baseSteps = [
  { number: 1, title: 'Логин и пароль', icon: FaKey  },
  { number: 2, title: 'Email', icon: FaAddressCard  },
  { number: 3, title: 'Подтверждение', icon: FaUser  },
  { number: 4, title: 'Персональные данные', icon: FaUser  },
  { number: 5, title: 'Тип профиля', icon: FaPaw  },
];

export const vetStep = { number: 6, title: 'Данные ветеринара', icon: FaBriefcaseMedical  };
export const partnerStep = { number: 6, title: 'Данные партнера', icon: FaBuilding  };