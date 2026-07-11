import Image from "next/image";
import css from "./Features.module.css";

const Features = () => {
  return (
    <section className={css.section}>
      <div className={css.header}>
        <h2 className={css.title}>Що пропонує SarnyFish?</h2>

        <p className={css.subtitle}>
          Все необхідне для комфортної риболовлі в одному місці.
        </p>
      </div>

      <ul className={css.list}>
        <li className={css.card}>
          <Image
            src="/icons/homeSVG/location.svg"
            alt="Знайди місце"
            width={44}
            height={44}
            className={css.icon}
          />

          <h3 className={css.cardTitle}>Знайди своє місце</h3>

          <p className={css.cardText}>
            Відкривай нові водойми Сарненського району.
          </p>
        </li>

        <li className={css.card}>
          <Image
            src="/icons/homeSVG/camera.svg"
            alt="Ділись уловами"
            width={44}
            height={44}
            className={css.icon}
          />

          <h3 className={css.cardTitle}>Ділись уловами</h3>

          <p className={css.cardText}>
            Публікуй фотографії та свої рибальські історії.
          </p>
        </li>

        <li className={css.card}>
          <Image
            src="/icons/homeSVG/heart.svg"
            alt="Лайки"
            width={44}
            height={44}
            className={css.icon}
          />

          <h3 className={css.cardTitle}>Оцінюй локації</h3>

          <p className={css.cardText}>
            Підтримуй найкращі місця лайками та допомагай іншим рибалкам.
          </p>
        </li>

        <li className={css.card}>
          <Image
            src="/icons/homeSVG/message.svg"
            alt="Коментарі"
            width={44}
            height={44}
            className={css.icon}
          />

          <h3 className={css.cardTitle}>Спілкуйся</h3>

          <p className={css.cardText}>
            Залишай коментарі та ділися власним досвідом.
          </p>
        </li>

        <li className={css.card}>
          <Image
            src="/icons/homeSVG/map.svg"
            alt="Карта"
            width={44}
            height={44}
            className={css.icon}
          />

          <h3 className={css.cardTitle}>Досліджуй карту</h3>

          <p className={css.cardText}>
            Переглядай усі водойми на інтерактивній карті.
          </p>
        </li>

        <li className={css.card}>
          <Image
            src="/icons/homeSVG/plus.svg"
            alt="Додати локацію"
            width={44}
            height={44}
            className={css.icon}
          />

          <h3 className={css.cardTitle}>Додавай локації</h3>

          <p className={css.cardText}>
            Допомагай спільноті відкривати нові місця для риболовлі.
          </p>
        </li>
      </ul>
    </section>
  );
};

export default Features;
