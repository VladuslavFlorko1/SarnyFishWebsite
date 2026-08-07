"use client";

import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { verifyEmail, resendVerification } from "@/services/auth";
import styles from "./VerifyEmailModal.module.css";

interface VerifyEmailModalProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export default function VerifyEmailModal({
  email,
  isOpen,
  onClose,
  onVerified,
}: VerifyEmailModalProps) {
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const verifyMutation = useMutation({
    mutationFn: () => verifyEmail(email, code),
    onSuccess: () => {
      toast.success("Email підтверджено 🎣");
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      onVerified();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Невірний код");
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => resendVerification(email),
    onSuccess: () => {
      toast.success("Код надіслано повторно");
      setResendCooldown(60);
      cooldownRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1 && cooldownRef.current) {
            clearInterval(cooldownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    onError: () => toast.error("Не вдалося надіслати код"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length !== 6) {
      toast.error("Введіть 6-значний код");
      return;
    }
    verifyMutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Підтвердіть email</h2>
        <p className={styles.subtitle}>
          Ми надіслали код на <b>{email}</b>
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            className={styles.codeInput}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            autoFocus
          />

          <button
            type="submit"
            className={styles.submitButton}
            disabled={verifyMutation.isPending || code.length !== 6}
          >
            {verifyMutation.isPending ? "Перевірка..." : "Підтвердити"}
          </button>
        </form>

        <button
          type="button"
          className={styles.resendButton}
          onClick={() => resendMutation.mutate()}
          disabled={resendMutation.isPending || resendCooldown > 0}
        >
          {resendCooldown > 0
            ? `Надіслати ще раз (${resendCooldown}с)`
            : "Надіслати код повторно"}
        </button>

        <button type="button" className={styles.skipButton} onClick={onClose}>
          Пізніше
        </button>
      </div>
    </div>
  );
}
