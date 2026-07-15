"use client";

import { useState } from "react";
import AuthModal from "@/components/AuthModal/AuthModal";
import css from "./HeroBaner.module.css";

type AuthMode = "login" | "register";

const HeroBaner = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <section className={css.heroContainer}>
      <h1 className={css.title}>Sarny Fish</h1>

      <p className={css.subtitle}>
        Тут ти знайдеш найкращі водойми, приховані куточки природи та
        однодумців, з якими хочеться їхати на рибалку знову і знову.
      </p>

      <div className={css.heroButtons}>
        <button className={css.ctaButton} onClick={() => openAuth("login")}>
          Увійти
        </button>

        <button className={css.ctaButton} onClick={() => openAuth("register")}>
          Зареєструватися
        </button>
      </div>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />
    </section>
  );
};

export default HeroBaner;
