import Image from "next/image";
import Link from "next/link";
import css from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={css.footer}>
      <nav className={css.footerNav} aria-label="Bottom navigation">
        <ul className={css.footerNav}>
          <li>
            <Link href="/">
              <Image
                className={css.svgIcon}
                src="/icons/home.svg"
                alt="Home"
                width={22}
                height={22}
              />
            </Link>
          </li>

          <li>
            <Link href="/locations">
              <Image
                className={css.svgIcon}
                src="/icons/location.svg"
                alt="Locations"
                width={22}
                height={22}
              />
            </Link>
          </li>

          <li>
            <Link href="/locations/new">
              <Image
                className={css.svgIcon}
                src="/icons/add.svg"
                alt="Add location"
                width={22}
                height={22}
              />
            </Link>
          </li>

          <li>
            <Link href="/map">
              <Image
                className={css.svgIcon}
                src="/icons/map.svg"
                alt="Map"
                width={22}
                height={22}
              />
            </Link>
          </li>

          <li>
            <Link href="/profile">
              <Image
                className={css.svgIcon}
                src="/icons/profile.svg"
                alt="Profile"
                width={22}
                height={22}
              />
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
