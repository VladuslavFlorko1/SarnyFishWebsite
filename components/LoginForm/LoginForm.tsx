"use client";

import { useState } from "react";
import styles from "./LoginForm.module.css";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginForm({
  onSuccess,
  onSwitchToRegister,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email.trim()) {
      newErrors.email = "Вкажіть email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Некоректний email";
    }
    if (!password) {
      newErrors.password = "Вкажіть пароль";
    } else if (password.length < 6) {
      newErrors.password = "Мінімум 6 символів";
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
      await api.post("/auth/login", { email, password });

      toast.success("Вітаємо! Ви успішно увійшли");
      onSuccess();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Невірний email або пароль";
      setErrors({ general: message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {errors.general && (
        <p className={styles.generalError}>{errors.general}</p>
      )}

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

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isLoading}
      >
        {isLoading ? "Вхід..." : "Увійти"}
      </button>

      <p className={styles.switchText}>
        Немає акаунту?{" "}
        <button
          type="button"
          className={styles.switchLink}
          onClick={onSwitchToRegister}
        >
          Зареєструватися
        </button>
      </p>
    </form>
  );
}
