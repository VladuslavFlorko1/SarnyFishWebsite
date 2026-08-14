"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUnreadCount } from "@/services/notifications";
import { getCurrentUser } from "@/services/users";
import css from "./Footer.module.css";

const NAV_ITEMS = [
  { href: "/", icon: "/icons/home.svg", alt: "Home" },
  { href: "/locations", icon: "/icons/location.svg", alt: "Locations" },
  { href: "/locations/new", icon: "/icons/add.svg", alt: "Add location" },
  { href: "/map", icon: "/icons/map.svg", alt: "Map" },
  { href: "/profile", icon: "/icons/profile.svg", alt: "Profile" },
];

const Footer = () => {
  const pathname = usePathname();

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: getUnreadCount,
    enabled: !!currentUser,
    refetchInterval: 60000,
  });

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/locations") {
      return (
        pathname === "/locations" ||
        (pathname.startsWith("/locations/") &&
          !pathname.startsWith("/locations/new"))
      );
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const activeIndex = NAV_ITEMS.findIndex((item) => isActive(item.href));

  return (
    <footer className={css.footer}>
      <nav className={css.footerNav} aria-label="Bottom navigation">
        <ul className={css.footerNav}>
          {activeIndex !== -1 && (
            <li
              className={css.indicator}
              style={{
                transform: `translateX(${activeIndex * 100}%)`,
              }}
              aria-hidden="true"
            />
          )}

          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const isProfile = item.href === "/profile";

            return (
              <li key={item.href} className={css.navItem}>
                <Link
                  href={item.href}
                  className={`${css.navLink} ${active ? css.navLinkActive : ""}`}
                >
                  <Image
                    className={css.svgIcon}
                    src={item.icon}
                    alt={item.alt}
                    width={22}
                    height={22}
                  />
                  {isProfile && unreadCount > 0 && (
                    <span className={css.badge}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
