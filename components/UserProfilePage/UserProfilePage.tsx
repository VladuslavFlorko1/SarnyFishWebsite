"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { getUserById } from "@/services/users";
import { getUserLocations } from "@/services/locations";
import {
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} from "@/services/friends";
import styles from "./UserProfilePage.module.css";

interface UserProfilePageProps {
  userId: string;
}

export default function UserProfilePage({ userId }: UserProfilePageProps) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => getUserById(userId),
    retry: false,
  });

  const isUnauthorized = isError && (error as any)?.response?.status === 401;

  const { data: userLocations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ["user-locations", userId],
    queryFn: () => getUserLocations(userId),
    enabled: !!data,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["user-profile", userId] });
    queryClient.invalidateQueries({ queryKey: ["friends-stats"] });
  };

  const sendMutation = useMutation({
    mutationFn: () => sendFriendRequest(userId),
    onSuccess: () => {
      toast.success("Запит надіслано");
      invalidateAll();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Не вдалося надіслати запит");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (requestId: string) => cancelFriendRequest(requestId),
    onSuccess: () => {
      toast.success("Запит скасовано");
      invalidateAll();
    },
    onError: () => toast.error("Не вдалося скасувати запит"),
  });

  const acceptMutation = useMutation({
    mutationFn: (requestId: string) => acceptFriendRequest(requestId),
    onSuccess: () => {
      toast.success("Запит прийнято 🎣");
      invalidateAll();
    },
    onError: () => toast.error("Не вдалося прийняти запит"),
  });

  const rejectMutation = useMutation({
    mutationFn: (requestId: string) => rejectFriendRequest(requestId),
    onSuccess: () => {
      invalidateAll();
    },
    onError: () => toast.error("Не вдалося відхилити запит"),
  });

  const removeMutation = useMutation({
    mutationFn: () => removeFriend(userId),
    onSuccess: () => {
      toast.success("Видалено з друзів");
      invalidateAll();
    },
    onError: () => toast.error("Не вдалося видалити з друзів"),
  });

  if (isLoading) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  if (isUnauthorized || !data) {
    return (
      <div className={styles.authPrompt}>
        <p className={styles.authTitle}>
          Щоб переглядати профілі інших користувачів, увійдіть у свій акаунт
        </p>
        <Link href="/" className={styles.authButton}>
          На головну
        </Link>
      </div>
    );
  }

  const { user, relationStatus, requestId } = data;

  const isBusy =
    sendMutation.isPending ||
    cancelMutation.isPending ||
    acceptMutation.isPending ||
    rejectMutation.isPending ||
    removeMutation.isPending;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          <Image
            src={user.avatar}
            alt={user.username}
            width={86}
            height={86}
            className={styles.avatar}
          />
        </div>

        <div className={styles.headerInfo}>
          <p className={styles.username}>{user.username}</p>

          {user.bio && <p className={styles.bio}>{user.bio}</p>}

          <div className={styles.actionRow}>
            {relationStatus === "none" && (
              <button
                type="button"
                className={styles.primaryButton}
                disabled={isBusy}
                onClick={() => sendMutation.mutate()}
              >
                Додати друга
              </button>
            )}

            {relationStatus === "pending_sent" && requestId && (
              <button
                type="button"
                className={styles.secondaryButton}
                disabled={isBusy}
                onClick={() => cancelMutation.mutate(requestId)}
              >
                Скасувати запит
              </button>
            )}

            {relationStatus === "pending_received" && requestId && (
              <div className={styles.requestButtons}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  disabled={isBusy}
                  onClick={() => acceptMutation.mutate(requestId)}
                >
                  Прийняти
                </button>

                <button
                  type="button"
                  className={styles.secondaryButton}
                  disabled={isBusy}
                  onClick={() => rejectMutation.mutate(requestId)}
                >
                  Відхилити
                </button>
              </div>
            )}

            {relationStatus === "friends" && (
              <button
                type="button"
                className={styles.friendsButton}
                disabled={isBusy}
                onClick={() => removeMutation.mutate()}
              >
                ✓ Друзі
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.locationsSection}>
        {locationsLoading ? (
          <p className={styles.emptyText}>Завантаження локацій...</p>
        ) : userLocations.length === 0 ? (
          <p className={styles.emptyText}>
            Користувач ще не додав жодної локації
          </p>
        ) : (
          <div className={styles.locationsGrid}>
            {userLocations.map((loc) => (
              <Link
                key={loc._id}
                href={`/locations/${loc._id}`}
                className={styles.locationTile}
              >
                <Image
                  src={loc.images[0]}
                  alt={loc.name}
                  fill
                  sizes="120px"
                  className={styles.locationImage}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
