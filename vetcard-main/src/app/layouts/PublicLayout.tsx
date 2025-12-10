
import { Outlet } from 'react-router-dom';
import { Footer } from '@/widgets/Footer/ui/Footer'; 
import { SidebarProvider } from '@/widgets/Sidebar/model/SidebarContext';

export const PublicLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
};