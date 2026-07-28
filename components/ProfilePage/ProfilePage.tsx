"use client";

import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { getCurrentUser, updateAvatar } from "@/services/users";
import {
  getFriendsStats,
  getReceivedRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "@/services/friends";
import { getUserLocations } from "@/services/locations";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [requestsOpen, setRequestsOpen] = useState(false);

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
    error: userErrorObj,
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
  });

  const isUnauthorized =
    userError && (userErrorObj as any)?.response?.status === 401;

  const { data: stats } = useQuery({
    queryKey: ["friends-stats"],
    queryFn: getFriendsStats,
    enabled: !!user,
  });

  const { data: receivedRequests = [] } = useQuery({
    queryKey: ["friends-received"],
    queryFn: getReceivedRequests,
    enabled: requestsOpen && !!user,
  });

  const { data: userLocations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ["user-locations", user?._id],
    queryFn: () => getUserLocations(user!._id),
    enabled: !!user,
  });

  const avatarMutation = useMutation({
    mutationFn: updateAvatar,
    onSuccess: () => {
      toast.success("Аватар оновлено");
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: () => toast.error("Не вдалося оновити аватар"),
  });

  const acceptMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      toast.success("Запит прийнято 🎣");
      queryClient.invalidateQueries({ queryKey: ["friends-received"] });
      queryClient.invalidateQueries({ queryKey: ["friends-stats"] });
    },
    onError: () => toast.error("Не вдалося прийняти запит"),
  });

  const rejectMutation = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends-received"] });
      queryClient.invalidateQueries({ queryKey: ["friends-stats"] });
    },
    onError: () => toast.error("Не вдалося відхилити запит"),
  });

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) avatarMutation.mutate(file);
  };

  if (userLoading) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  if (isUnauthorized || !user) {
    return (
      <div className={styles.authPrompt}>
        <p className={styles.authTitle}>
          Щоб переглянути профіль, увійдіть у свій акаунт
        </p>
        <Link href="/" className={styles.authButton}>
          На головну
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.avatarWrapper} onClick={handleAvatarClick}>
          <Image
            src={user.avatar}
            alt={user.username}
            width={86}
            height={86}
            className={styles.avatar}
          />
          <div className={styles.avatarOverlay}>
            {avatarMutation.isPending ? "..." : "Змінити"}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className={styles.hiddenInput}
          onChange={handleAvatarChange}
        />

        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {stats?.friendsCount ?? 0}
            </span>
            <span className={styles.statLabel}>друзів</span>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {stats?.sentPendingCount ?? 0}
            </span>
            <span className={styles.statLabel}>надіслано</span>
          </div>

          <button
            type="button"
            className={styles.statItemButton}
            onClick={() => setRequestsOpen((prev) => !prev)}
          >
            <span className={styles.statNumber}>
              {stats?.receivedPendingCount ?? 0}
            </span>
            <span className={styles.statLabel}>запити ▾</span>
          </button>
        </div>
      </div>

      <div className={styles.info}>
        <p className={styles.username}>{user.username}</p>
        {user.bio && <p className={styles.bio}>{user.bio}</p>}
      </div>

      {requestsOpen && (
        <div className={styles.requestsPanel}>
          {receivedRequests.length === 0 ? (
            <p className={styles.emptyText}>Немає нових запитів</p>
          ) : (
            receivedRequests.map((req) => (
              <div key={req._id} className={styles.requestRow}>
                <div className={styles.requestUser}>
                  <Image
                    src={req.from?.avatar ?? ""}
                    alt={req.from?.username ?? ""}
                    width={36}
                    height={36}
                    className={styles.requestAvatar}
                  />
                  <span className={styles.requestName}>
                    {req.from?.username}
                  </span>
                </div>
                <div className={styles.requestActions}>
                  <button
                    type="button"
                    className={styles.acceptButton}
                    onClick={() => acceptMutation.mutate(req._id)}
                  >
                    Прийняти
                  </button>
                  <button
                    type="button"
                    className={styles.rejectButton}
                    onClick={() => rejectMutation.mutate(req._id)}
                  >
                    Відхилити
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className={styles.divider} />

      <div className={styles.locationsSection}>
        {locationsLoading ? (
          <p className={styles.emptyText}>Завантаження локацій...</p>
        ) : userLocations.length === 0 ? (
          <div className={styles.emptyLocations}>
            <p className={styles.emptyTitle}>Тут поки що порожньо</p>
            <p className={styles.emptyText}>
              Ти ще не додав жодної локації. Поділись своїм улюбленим місцем для
              риболовлі!
            </p>
            <Link href="/locations/new" className={styles.addLocationButton}>
              Додати локацію
            </Link>
          </div>
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
