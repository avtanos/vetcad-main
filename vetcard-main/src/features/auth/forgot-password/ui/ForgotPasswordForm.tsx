import { useForgotPassword } from "../model/useForgotPassword";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/Button";
import { useState } from "react";
import { useTranslation } from "react-i18next";


export const ForgotPasswordForm = () => {
  const { t } = useTranslation();
  const { step, loading, error, sendEmail, verifyCode, resetPassword, email } = useForgotPassword();
  const [input, setInput] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (step === "done") {
    return <div>{t ("forgotPassword.success")}</div>;
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (step === "email") sendEmail(input);
        if (step === "code") verifyCode(input);
        if (step === "reset") resetPassword();
      }}
      className="space-y-4"
    >
      {step === "email" && (
        <>
          <Input
            type="email"
            placeholder={t ("forgotPassword.emailPlaceholder")}
            value={input}
            onChange={e => setInput(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" disabled={loading}>
          {t ("forgotPassword.sendCode")}        
            </Button>
        </>
      )}
      {step === "code" && (
        <>
          <div> {t ("forgotPassword.codeSent")} {email}</div>
          <Input
            type="text"
            placeholder={t ("forgotPassword.codePlaceholder")} 
            value={input}
            onChange={e => setInput(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" disabled={loading}>
          {t ("forgotPassword.verifyCode")} 
          </Button>
        </>
      )}
      {step === "reset" && (
        <>
          <Input
            type="password"
            placeholder={t ("forgotPassword.newPasswordPlaceholder")} 
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" disabled={loading}>
          {t ("forgotPassword.changePassword")}    
           </Button>
        </>
      )}
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
};
