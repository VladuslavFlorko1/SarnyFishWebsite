"use client";

import { useState } from "react";
import styles from "../LoginForm/LoginForm.module.css";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import VerifyEmailModal from "@/components/VerifyEmailModal/VerifyEmailModal";

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function RegisterForm({
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!username.trim()) newErrors.username = "Вкажіть ім'я користувача";
    if (!email.trim()) {
      newErrors.email = "Вкажіть email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Некоректний email";
    }
    if (!password) {
      newErrors.password = "Вкажіть пароль";
    } else if (password.length < 8) {
      newErrors.password = "Мінімум 8 символів";
    }
    if (confirmPassword !== password) {
      newErrors.confirmPassword = "Паролі не збігаються";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await api.post("/auth/register", { username, email, password });

      toast.success("Реєстрація успішна! Перевір пошту 🎣");
      setVerifyModalOpen(true);
    } catch (err: any) {
      const message =
        err?.response?.data?.validation?.body?.message ||
        err?.response?.data?.message ||
        "Не вдалося зареєструватися";
      setErrors({ general: message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {errors.general && (
          <p className={styles.generalError}>{errors.general}</p>
        )}

        <div className={styles.field}>
          <label className={styles.label}>Ім&apos;я користувача</label>
          <input
            type="text"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Влад Флорко"
          />
          {errors.username && (
            <span className={styles.error}>{errors.username}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Пароль</label>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          {errors.password && (
            <span className={styles.error}>{errors.password}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Підтвердіть пароль</label>
          <input
            type="password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <span className={styles.error}>{errors.confirmPassword}</span>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Реєстрація..." : "Зареєструватися"}
        </button>

        <p className={styles.switchText}>
          Вже маєте акаунт?{" "}
          <button
            type="button"
            className={styles.switchLink}
            onClick={onSwitchToLogin}
          >
            Увійти
          </button>
        </p>
      </form>

      <VerifyEmailModal
        email={email}
        isOpen={verifyModalOpen}
        onClose={() => {
          setVerifyModalOpen(false);
          onSuccess();
        }}
        onVerified={onSuccess}
      />
    </>
  );
}
