"use client";

import { useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import toast from "react-hot-toast";

import { getLocationsFeed, toggleLike } from "@/services/locations";

import css from "./Locations.module.css";
import Image from "next/image";
import Link from "next/link";

export default function LocationsFeed() {
  const { ref, inView } = useInView();

  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["locations"],

      queryFn: ({ pageParam }) => getLocationsFeed(pageParam),

      initialPageParam: 1,

      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.totalPages) {
          return lastPage.page + 1;
        }

        return undefined;
      },
    });

  const likeMutation = useMutation({
    mutationFn: toggleLike,

    onMutate: async (locationId: string) => {
      await queryClient.cancelQueries({ queryKey: ["locations"] });

      const previousData = queryClient.getQueryData(["locations"]);

      queryClient.setQueryData(["locations"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            locations: page.locations.map((location: any) =>
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
          })),
        };
      });

      return { previousData };
    },

    onError: (error: any, _locationId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["locations"], context.previousData);
      }

      if (error?.response?.status === 401) {
        toast.error("Щоб поставити лайк, ввійдіть у свій акаунт");
      } else {
        toast.error("Не вдалося поставити лайк. Спробуйте ще раз");
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const locations = data?.pages.flatMap((page) => page.locations) ?? [];

  return (
    <>
      <section className={css.section}>
        <div className={css.searchWrapper}>
          <input
            type="text"
            placeholder="Пошук локацій..."
            className={css.search}
          />
        </div>

        <ul className={css.list}>
          {locations.map((location) => (
            <li key={location._id} className={css.card}>
              <div className={css.author}>
                <Link
                  href={`/profile/${location.owner._id}`}
                  className={css.authorLink}
                >
                  <Image
                    src={location.owner.avatar}
                    alt={location.owner.username}
                    width={44}
                    height={44}
                    className={css.avatar}
                  />

                  <div>
                    <p className={css.name}>{location.owner.username}</p>
                  </div>
                </Link>
              </div>

              <div className={css.imageWrapper}>
                <Image
                  src={location.images[0]}
                  alt={location.name}
                  fill
                  sizes="100vw"
                  className={css.image}
                />

                <div className={css.imageOverlay}>
                  <button
                    type="button"
                    className={css.infoItem}
                    onClick={() => likeMutation.mutate(location._id)}
                  >
                    <Image
                      src={
                        location.isLiked
                          ? "/icons/heart-red.svg"
                          : "/icons/heart-white.svg"
                      }
                      alt="Likes"
                      width={22}
                      height={22}
                    />
                    <span className={css.count}>{location.likes.count}</span>
                  </button>

                  <Link
                    href={`/locations/${location._id}#comments`}
                    className={css.infoItem}
                  >
                    <Image
                      src="/icons/comments.svg"
                      alt="Comments"
                      width={22}
                      height={22}
                    />
                    <span className={css.count}>{location.commentsCount}</span>
                  </Link>
                </div>
              </div>

              <div className={css.content}>
                <h2 className={css.locationName}>{location.name}</h2>

                <p className={css.city}>{location.city}</p>

                <p className={css.description}>{location.description}</p>

                <div className={css.fish}>
                  {location.fish.map((fish) => (
                    <span key={fish} className={css.tag}>
                      {fish}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/locations/${location._id}`}
                  className={css.button}
                >
                  Детальніше
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div ref={ref} />

      {isFetchingNextPage && <p>Завантаження...</p>}
    </>
  );
}
