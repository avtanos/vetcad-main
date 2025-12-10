import { useState } from "react";

export function useForgotPassword() {
  const [step, setStep] = useState<"email" | "code" | "reset" | "done">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  
  const sendEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(res => setTimeout(res, 1000));
      setEmail(email);
      setStep("code");
    } catch {
      setError("Ошибка отправки письма");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (inputCode: string) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(res => setTimeout(res, 1000));
      if (inputCode !== "123456") throw new Error();
      setStep("reset");
    } catch {
      setError("Неверный код");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(res => setTimeout(res, 1000));
      setStep("done");
    } catch {
      setError("Ошибка смены пароля");
    } finally {
      setLoading(false);
    }
  };

  return {
    step, loading, error, email,
    sendEmail, verifyCode, resetPassword
  };
}
