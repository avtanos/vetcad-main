import { LoginForm } from '@/widgets/LoginForm/LoginForm';
import LoginBackgrnd from '@/assets/images/LoginBackgrnd.svg'; 
import LogoWhite from "@/assets/images/vet-logo 3.svg";
import { BackButton } from '@/shared/ui/BackButton';

export const LoginPage = () => (
  <div className="flex min-h-screen bg-white font-sans">
    
    <div className="hidden lg:block w-1/2 relative">
      <div className='absolute z-40 my-6 mx-6'> 
        <img src={LogoWhite} alt='VetCard Logo' />
      </div>
      <img 
        src={LoginBackgrnd} 
        alt="A veterinarian with a pet" 
        className="absolute inset-0 w-full h-full object-cover" 
      />
      <div className="absolute inset-0 bg-blue-950 opacity-40 mix-blend-multiply" />

      <div className="absolute inset-0 flex items-center justify-center p-12">
        <div className="max-w-md text-center">
          <h1 className="text-6xl font-bold text-white tracking-tight">
            VetCard
          </h1>
          <p className="mt-4 text-xl text-white">
            Вся история здоровья вашего питомца — в одной удобной карте.
          </p>
        </div>
      </div>
    </div>

    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">

      <div className="absolute top-4 right-4">
        <BackButton /> 
      </div>

      <LoginForm />
    </div>
  </div>
);
