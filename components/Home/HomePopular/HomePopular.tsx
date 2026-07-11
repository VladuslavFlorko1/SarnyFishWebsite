"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";

import { Location } from "@/types/location";
import css from "../HomeLocation/HomeLocations.module.css";

interface Props {
  locations: Location[];
}

const HomePopular = ({ locations }: Props) => {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
  });

  return (
    <section className={css.section}>
      <div className={css.header}>
        <h2 className={css.title}>Популярні локації</h2>

        <Link href="/locations" className={css.link}>
          Переглянути всі
        </Link>
      </div>

      <div className={css.embla} ref={emblaRef}>
        <div className={css.emblaContainer}>
          {locations.map((location) => (
            <div className={css.emblaSlide} key={location._id}>
              <div className={css.card}>
                <div className={css.imageWrapper}>
                  <Image
                    src={location.images[0]}
                    alt={location.name}
                    fill
                    className={css.image}
                  />

                  <div className={css.imageOverlay}>
                    <div className={css.infoItem}>
                      <Image
                        src="/icons/heart-white.svg"
                        alt="Likes"
                        width={24}
                        height={24}
                      />
                      <span className={css.count}>{location.likes.count}</span>
                    </div>

                    <div className={css.infoItem}>
                      <Image
                        src="/icons/comments.svg"
                        alt="Comments"
                        width={24}
                        height={24}
                      />
                      <span className={css.count}>
                        {location.commentsCount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={css.content}>
                  <h3 className={css.locationName}>{location.name}</h3>

                  <p className={css.locationDescription}>
                    {location.description}
                  </p>

                  <Link
                    href={`/locations/${location._id}`}
                    className={css.detailsButton}
                  >
                    Детальніше
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePopular;
