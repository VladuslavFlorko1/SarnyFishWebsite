import Image from "next/image";
import Link from "next/link";
import css from "./About.module.css";

const About = () => {
  return (
    <section className={css.features}>
      <div className={css.container}>
        <h2 className={css.title}>Привіт! Мене звати Влад 👋</h2>

        <div className={css.imageWrapper}>
          <Image src="/images/vlad.jpg" alt="Влад" fill className={css.image} />
        </div>

        <p className={css.text}>
          Я самостійно розробляю <strong>SarnyFish</strong> — платформу для
          рибалок Сарненського району, де можна знаходити нові місця для
          риболовлі, ділитися уловами та допомагати один одному.
        </p>

        <p className={css.text}>
          Це мій особистий проєкт, який я створюю у вільний час. Я постійно
          працюю над його розвитком, додаю нові можливості та роблю все, щоб
          сайт ставав ще зручнішим.
        </p>

        <p className={css.text}>
          Якщо ви помітили помилку, маєте ідею для покращення або просто хочете
          побажати гарного дня 😊 — буду дуже радий вашому повідомленню.
        </p>

        <Link
          href="https://www.instagram.com/1_vlad_florko_9/"
          target="_blank"
          rel="noopener noreferrer"
          className={css.instagramLink}
        >
          Написати в Instagram
        </Link>

        <p className={css.footerText}>
          Дякую, що користуєтесь <strong>SarnyFish</strong>! 🎣
        </p>
      </div>
    </section>
  );
};

export default About;
