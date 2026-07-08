import Image from "next/image";
import Link from "next/link";
import css from "./Header.module.css";

const Header = () => {
  return (
    <header className={css.header}>
      <div className={css.headerContainer}>
        <Link href="/">
          <Image
            src="/icons/logo.svg"
            alt="SarnyFish logo"
            width={90}
            height={60}
            priority
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;