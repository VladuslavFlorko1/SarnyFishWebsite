"use client";

import { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

import { toggleLike } from "@/services/locations";
import { Location } from "@/types/location";
import css from "./HomeLocations.module.css";

interface Props {
  locations: Location[];
}

export default function HomeLocationsCarousel({ locations }: Props) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
  });


  const [items, setItems] = useState(locations);

  const likeMutation = useMutation({
    mutationFn: toggleLike,
  });

  const handleLike = (locationId: string) => {
    setItems((prev) =>
      prev.map((location) =>
        location._id === locationId
          ? {
              ...location,
              isLiked: !location.isLiked,
              likes: {
                ...location.likes,
                count: location.isLiked
                  ? location.likes.count - 1
                  : location.likes.count + 1,
              },
            }
          : location,
      ),
    );

    likeMutation.mutate(locationId);
  };

  return (
    <section className={css.section}>
      <div className={css.header}>
        <h2 className={css.title}>Останні улови</h2>

        <Link href="/locations" className={css.link}>
          Переглянути всі
        </Link>
      </div>

      <div className={css.embla} ref={emblaRef}>
        <div className={css.emblaContainer}>
          {items.map((location) => (
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
                    <button
                      type="button"
                      className={css.infoItem}
                      onClick={() => handleLike(location._id)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                      }}
                    >
                      <Image
                        src={
                          location.isLiked
                            ? "/icons/heart-red.svg"
                            : "/icons/heart-white.svg"
                        }
                        alt="Likes"
                        width={24}
                        height={24}
                      />
                      <span className={css.count}>{location.likes.count}</span>
                    </button>

                    <Link
                      href={`/locations/${location._id}#comments`}
                      className={css.infoItem}
                      style={{ textDecoration: "none" }}
                    >
                      <Image
                        src="/icons/comments.svg"
                        alt="Comments"
                        width={24}
                        height={24}
                      />
                      <span className={css.count}>
                        {location.commentsCount}
                      </span>
                    </Link>
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
}
