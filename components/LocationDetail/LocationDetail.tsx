"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  getLocationById,
  deleteLocation,
  toggleLike,
} from "@/services/locations";
import { getCurrentUser } from "@/services/users";
import { getComments, createComment, deleteComment } from "@/services/comments";
import styles from "./LocationDetail.module.css";
import LocationDetailMap from "@/components/LocationDetailMap/LocationDetailMapLoader";

interface LocationDetailProps {
  locationId: string;
}

export default function LocationDetail({ locationId }: LocationDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const { data: location, isLoading } = useQuery({
    queryKey: ["location", locationId],
    queryFn: () => getLocationById(locationId),
  });

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", locationId],
    queryFn: () => getComments(locationId),
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(locationId),
    onSuccess: (likes) => {
      queryClient.setQueryData(["location", locationId], (old: any) =>
        old ? { ...old, likes } : old,
      );
    },
    onError: (err: any) => {
      if (err?.response?.status === 401) {
        toast.error("Щоб поставити лайк, ввійдіть у свій акаунт");
      } else {
        toast.error("Не вдалося поставити лайк");
      }
    },
  });

  const deleteLocationMutation = useMutation({
    mutationFn: () => deleteLocation(locationId),
    onSuccess: () => {
      toast.success("Локацію видалено");
      router.push("/locations");
    },
    onError: () => toast.error("Не вдалося видалити локацію"),
  });

  const addCommentMutation = useMutation({
    mutationFn: (text: string) => createComment(locationId, text),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["comments", locationId] });
      queryClient.invalidateQueries({ queryKey: ["location", locationId] });
    },
    onError: (err: any) => {
      if (err?.response?.status === 401) {
        toast.error("Щоб залишити коментар, ввійдіть у свій акаунт");
      } else {
        toast.error("Не вдалося додати коментар");
      }
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(locationId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", locationId] });
      queryClient.invalidateQueries({ queryKey: ["location", locationId] });
    },
    onError: () => toast.error("Не вдалося видалити коментар"),
  });

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;
    addCommentMutation.mutate(trimmed);
  };

  const handleDeleteLocation = () => {
    if (confirm("Видалити цю локацію? Дію не можна скасувати.")) {
      deleteLocationMutation.mutate();
    }
  };

  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveSlide(index);
  };

  if (isLoading || !location) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  const isOwner = !!location.owner && currentUser?._id === location.owner._id;

  return (
    <div className={styles.page}>
      <div className={styles.carouselWrapper}>
        <div
          className={styles.carousel}
          ref={carouselRef}
          onScroll={handleCarouselScroll}
        >
          {location.images.map((src, i) => (
            <div key={i} className={styles.slide}>
              <Image
                src={src}
                alt={`${location.name} — фото ${i + 1}`}
                fill
                sizes="100vw"
                className={styles.slideImage}
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {location.images.length > 1 && (
          <div className={styles.dots}>
            {location.images.map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i === activeSlide ? styles.dotActive : ""}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.authorRow}>
          {location.owner ? (
            <Link
              href={`/profile/${location.owner._id}`}
              className={styles.authorLink}
            >
              <Image
                src={location.owner.avatar}
                alt={location.owner.username}
                width={40}
                height={40}
                className={styles.authorAvatar}
              />
              <span className={styles.authorName}>
                {location.owner.username}
              </span>
            </Link>
          ) : (
            <div className={styles.authorLink}>
              <div
                className={styles.authorAvatar}
                style={{ background: "#5a7a85" }}
              />
              <span className={styles.authorName}>Видалений користувач</span>
            </div>
          )}

          {isOwner && (
            <div className={styles.ownerActions}>
              <Link
                href={`/locations/${locationId}/edit`}
                className={styles.editButton}
              >
                Редагувати
              </Link>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={handleDeleteLocation}
                disabled={deleteLocationMutation.isPending}
              >
                Видалити
              </button>
            </div>
          )}
        </div>

        <h1 className={styles.name}>{location.name}</h1>
        <p className={styles.city}>
          {location.city} · {location.type}
        </p>

        {location.description && (
          <p className={styles.description}>{location.description}</p>
        )}

        <div className={styles.fishRow}>
          {location.fish.map((f) => (
            <span key={f} className={styles.fishTag}>
              {f}
            </span>
          ))}
        </div>

        <button
          type="button"
          className={`${styles.likeButton} ${location.isLiked ? styles.likeButtonActive : ""}`}
          onClick={() => likeMutation.mutate()}
          disabled={likeMutation.isPending}
        >
          <Image
            src={
              location.isLiked
                ? "/icons/heart-red.svg"
                : "/icons/heart-white.svg"
            }
            alt="Likes"
            width={18}
            height={18}
          />
          <span>{location.likes.count}</span>
        </button>
      </div>

      <div className={styles.fishRow}>
  {location.fish.map((f) => (
    <span key={f} className={styles.fishTag}>
      {f}
    </span>
  ))}
</div>

<LocationDetailMap lat={location.coordinates.lat} lng={location.coordinates.lng} />

<button
  type="button"
  className={`${styles.likeButton} ${location.isLiked ? styles.likeButtonActive : ""}`}
  onClick={() => likeMutation.mutate()}
  disabled={likeMutation.isPending}
></button>

      <div className={styles.commentsSection}>
        <h2 className={styles.commentsTitle}>
          Коментарі ({location.commentsCount})
        </h2>

        <form className={styles.commentForm} onSubmit={handleAddComment}>
          <input
            type="text"
            className={styles.commentInput}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Залишити коментар..."
            maxLength={1000}
          />
          <button
            type="submit"
            className={styles.commentSubmit}
            disabled={addCommentMutation.isPending || !commentText.trim()}
          >
            Надіслати
          </button>
        </form>

        <div className={styles.commentsList}>
          {comments.length === 0 ? (
            <p className={styles.emptyText}>Поки що немає коментарів</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className={styles.commentRow}>
                <Image
                  src={comment.author?.avatar ?? "/icons/heart-white.svg"}
                  alt={comment.author?.username ?? "Видалений користувач"}
                  width={32}
                  height={32}
                  className={styles.commentAvatar}
                />
                <div className={styles.commentBody}>
                  <p className={styles.commentAuthor}>
                    {comment.author?.username ?? "Видалений користувач"}
                  </p>
                  <p className={styles.commentText}>{comment.text}</p>
                </div>
                {comment.author && currentUser?._id === comment.author._id && (
                  <button
                    type="button"
                    className={styles.commentDelete}
                    onClick={() => deleteCommentMutation.mutate(comment._id)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
