export type UserRegistrationData = {
  username: string;
  email: string;
  password: string;
  
  lastName: string;
  firstName: string;
  middleName: string;
  
  userType: 'petOwner' | 'veterinarian' | 'partner' | '';
  
  clinicName?: string;
  position?: string;
  experience?: string;
  specialization?: string;
  licenseNumber?: string;
  vetCity?: string;
  vetAddress?: string;

  partnerName?: string;
  partnerType?: string;
  partnerCity?: string;
  partnerAddress?: string;
  partnerPhone?: string;
  partnerWebsite?: string;
  partnerDescription?: string;
  partnerLogo?: File | null;
  
  verificationCode?: string;
};

export interface User {
  id: number;
  profile_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  third_name?: string;
  phone?: string;
  city?: string;
  address?: string;
  logo?: string;
  role?: number;
  name_of_organization?: string;
  type?: string;
  website?: string;
  description?: string;
}