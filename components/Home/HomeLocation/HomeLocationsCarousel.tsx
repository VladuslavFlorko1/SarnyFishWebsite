"use client";

import { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

import { toggleLike } from "@/services/locations";
import { Location } from "@/types/location";
import css from "./HomeLocations.module.css";

interface Props {
  locations: Location[];
}

interface LikeOverride {
  isLiked: boolean;
  count: number;
}

export default function HomeLocationsCarousel({ locations }: Props) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
  });

  const [likeOverrides, setLikeOverrides] = useState<
    Record<string, LikeOverride>
  >({});

  const likeMutation = useMutation({
    mutationFn: (locationId: string) => toggleLike(locationId),
    onMutate: async (locationId: string) => {
      const location = locations.find((l) => l._id === locationId);
      if (!location) return;

      const current = likeOverrides[locationId] ?? {
        isLiked: location.isLiked,
        count: location.likes.count,
      };

      setLikeOverrides((prev) => ({
        ...prev,
        [locationId]: {
          isLiked: !current.isLiked,
          count: current.isLiked ? current.count - 1 : current.count + 1,
        },
      }));
    },
    onError: (err: any, locationId: string) => {
      const location = locations.find((l) => l._id === locationId);
      if (location) {
        setLikeOverrides((prev) => ({
          ...prev,
          [locationId]: {
            isLiked: location.isLiked,
            count: location.likes.count,
          },
        }));
      }

      if (err?.response?.status === 401) {
        toast.error("Щоб поставити лайк, ввійдіть у свій акаунт");
      } else {
        toast.error("Не вдалося поставити лайк");
      }
    },
  });

  const handleLikeClick = (e: React.MouseEvent, locationId: string) => {
    e.preventDefault();
    e.stopPropagation();
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
          {locations.map((location) => {
            const override = likeOverrides[location._id];
            const isLiked = override?.isLiked ?? location.isLiked;
            const likesCount = override?.count ?? location.likes.count;

            return (
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
                        onClick={(e) => handleLikeClick(e, location._id)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                      >
                        <Image
                          src={
                            isLiked
                              ? "/icons/heart-red.svg"
                              : "/icons/heart-white.svg"
                          }
                          alt="Likes"
                          width={24}
                          height={24}
                        />
                        <span className={css.count}>{likesCount}</span>
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
