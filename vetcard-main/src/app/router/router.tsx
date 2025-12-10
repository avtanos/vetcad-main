import { Routes, Route } from 'react-router-dom';

import { PublicLayout } from '../layouts/PublicLayout';
import { OwnerLayout } from '../entrypoints/owner';
import { ProtectedRoute } from './ProtectedRoute';
import { PartnerLayout } from '../entrypoints/partner';
import { CommonLayout } from '../entrypoints/common';
import { ConditionalLayout } from './ConditionalLayout';

import { RootPage } from '@/pages/public/root/RootPage'; 
import { AboutPage } from '@/pages/public/about/AboutPage'; 
import { RegisterPage } from '@/pages/public/auth/register/ui/RegisterPage'; 
import { LoginPage } from '@/pages/public/auth/login/ui/LoginPage';
import { ForgotPasswordPage } from '@/pages/public/auth/forgot-password/ui/ForgotPasswordPage';

import { DashboardPage } from '@/pages/private/owner/dashboard/DashboardPage';
import { MyPetsPage } from '@/pages/private/owner/mypets/MyPetsPage';
import { AddPetPage } from '@/pages/private/owner/add-pet/AddPetPage';
import { EditPetPage } from '@/pages/private/owner/mypets/EditPetPage';
import { UserProfilePage } from '@/pages/private/owner/userprofile/UserProfilePage';
import { AssistantPage } from '@/widgets/Assistant/AssistantPage';
import { RemindersPage } from '@/pages/private/owner/reminders/RemindersPage';
import { AppointmentsPage } from '@/pages/private/owner/appointments/AppointmentsPage';
import { ConsultationsPage } from '@/pages/private/owner/consultations/ConsultationsPage';
import { ArticlesPage } from '@/widgets/Articles/ArticlesPage';
import { Products } from '@/widgets/Products/Products';
import { ProductDetailsPage } from '@/pages/private/common/product-details/ProductDetailsPage';
import { MyProductsPage } from '@/pages/private/common/my-products/MyProductsPage';
import { MyDataPage } from '@/pages/private/vet/mydata/MyDataPage';
import { VetCabinetPage } from '@/pages/private/vet/cabinet/VetCabinetPage';
import PartnerMyDataPage from '@/pages/private/partner/mydata/MyDataPage';
import { PartnerCabinetPage } from '@/pages/private/partner/cabinet/PartnerCabinetPage';
import { AdminPanelPage } from '@/pages/private/admin/AdminPanelPage';
import { AdminUserProfilePage } from '@/pages/private/admin/AdminUserProfilePage';
import { SpecialistsPage } from '@/pages/private/common/specialists/SpecialistsPage';

import { NotFoundPage } from '@/pages/note-found/ui/NotFoundPage';

import { PetProvider } from '@/entities/pet/model/PetContext';
import { SupportPage } from '@/pages/public/support/SupportPage';

export const Router = () => {
  return (
    <PetProvider> 
      <Routes>
        
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Публичные маршруты (без Sidebar для гостей, с Sidebar для авторизованных) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<RootPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/support" element={<SupportPage />} />
        </Route>

        {/* Условные маршруты: публичные для гостей, с Sidebar для авторизованных */}
        <Route element={<ConditionalLayout />}>
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/specialists" element={<SpecialistsPage />} />
        </Route>

        {/* Защищенные маршруты для ветеринаров (роль 2) - должны быть ПЕРЕД общими маршрутами */}
        <Route 
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <CommonLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/vet/mydata" element={<MyDataPage />} />
          <Route path="/vet/mydata/edit" element={<MyDataPage />} />
          <Route path="/vet/cabinet" element={<VetCabinetPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/my-products" element={<MyProductsPage />} />
          <Route path="/specialists" element={<SpecialistsPage />} />
        </Route>
        
        {/* Защищенные маршруты для партнеров (роль 3) - должны быть ПЕРЕД общими маршрутами */}
        <Route 
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <PartnerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/partner/mydata" element={<PartnerMyDataPage />} />
          <Route path="/partner/cabinet" element={<PartnerCabinetPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/my-products" element={<MyProductsPage />} />
          <Route path="/specialists" element={<SpecialistsPage />} />
        </Route>

        {/* Защищенные маршруты для владельцев питомцев (роль 1) */}
        <Route 
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <OwnerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/userprofile" element={<UserProfilePage />} />
          <Route path="/mypets" element={<MyPetsPage />} />
          <Route path="/add-pet" element={<AddPetPage />} />
          <Route path="/mypets/edit/:id" element={<EditPetPage />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/consultations" element={<ConsultationsPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/my-products" element={<MyProductsPage />} />
          <Route path="/specialists" element={<SpecialistsPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={[1,2,3,4]}>
              <CommonLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/specialists" element={<SpecialistsPage />} />
        </Route>

        <Route 
          element={
            <ProtectedRoute allowedRoles={[4]}>
              <CommonLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminPanelPage />} />
          <Route path="/admin/users/:userId" element={<AdminUserProfilePage />} />
        </Route>
        
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </PetProvider>
  );
};