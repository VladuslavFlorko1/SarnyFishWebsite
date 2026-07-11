import Link from "next/link";
import css from "./Map.module.css";

const HomeMap = () => {
  return (
    <section className={css.section}>
      <div className={css.overlay}>
        <h2 className={css.title}>Карта водойм</h2>

        <p className={css.subtitle}>
          Відкрий інтерактивну карту та знайди найкращі місця для риболовлі в
          Сарненському районі.
        </p>

        <Link href="/map" className={css.button}>
          Перейти до карти
        </Link>
      </div>
    </section>
  );
};

export default HomeMap;
