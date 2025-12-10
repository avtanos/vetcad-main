import { FaPaw, FaUserMd, FaBuilding } from 'react-icons/fa';
import type { UserRegistrationData } from './types';

export const USER_TYPES = {
    PET_OWNER: { id: 'petOwner', icon: FaPaw , label: 'Владелец питомца' },
    VETERINARIAN: { id: 'veterinarian', icon: FaUserMd , label: 'Ветеринар' },
    PARTNER: { id: 'partner', icon: FaBuilding , label: 'Партнер' },
} as const;

export const INITIAL_REGISTRATION_DATA: UserRegistrationData = {
  username: '',
  email: '',
  password: '',
  lastName: '',
  firstName: '',
  middleName: '',
  userType: '',
  clinicName: '',
  position: '',
  experience: '',
  specialization: '',
  licenseNumber: '',
  vetCity: '',
  vetAddress: '',
  partnerName: '',
  partnerType: '',
  partnerCity: '',
  partnerAddress: '',
  partnerPhone: '',
  partnerWebsite: '',
  partnerDescription: '',
  partnerLogo: null,
  verificationCode: '',
};