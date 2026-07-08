import Link from "next/link";
import css from "./HeroBaner.module.css";

const HeroBaner = () => {
  return (
          <section className={css.heroContainer}>
        <h1 className={css.title}>Sarny Fish</h1>

        <p className={css.subtitle}>
          Тут ти знайдеш найкращі водойми, приховані куточки природи та
          однодумців, з якими хочеться їхати на рибалку знову і знову.
        </p>

        <div className={css.heroButtons}>
          <Link href="/login" className={css.ctaButton}>
            Увійти
          </Link>

          <Link href="/register" className={css.ctaButton}>
            Зареєструватися
          </Link>
        </div>
      </section>
  );
};

export default HeroBaner;