import { ForgotPasswordForm } from "@/features/auth/forgot-password/ui/ForgotPasswordForm";
import { useTranslation } from "react-i18next";

export const ForgotPasswordPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {t("forgotPassword.recovery")}
        </h2>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};
