import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/Button";
import { useTranslation } from "react-i18next";
import { useLogin } from "@/features/auth/login/model/useLogin";

export const LoginFields = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        id="login"
        label={t("auth.login")}
        type="text"
        placeholder={t("auth.loginPlaceholder")}
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
        icon={<FaEnvelope className="text-gray-400" />}
      />

      <div className="relative">
        <Input
          id="password"
          label={t("auth.password")}
          type={showPassword ? "text" : "password"}
          placeholder={t("auth.passwordPlaceholder")}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          icon={<FaLock className="text-gray-400" />}
        />
        <div
          className="absolute right-3 top-[38px] cursor-pointer text-gray-400"
          onClick={() => setShowPassword(prev => !prev)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </div>
      </div>

      {error && (
        <div className="text-red-700 bg-red-100 border border-red-200 p-3 rounded-md text-sm text-center animate-pulse">
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <Button type="submit" variant="primary" className="w-32" disabled={loading}>
          {loading ? t("auth.loading") : t("auth.submit")}
        </Button>
      </div>
    </form>
  );
};
