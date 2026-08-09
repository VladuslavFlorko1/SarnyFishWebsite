"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { searchUsers } from "@/services/users";
import {
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
} from "@/services/friends";
import styles from "./FriendSearchModal.module.css";

interface FriendSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FriendSearchModal({
  isOpen,
  onClose,
}: FriendSearchModalProps) {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");

  const { data: users = [], isFetching } = useQuery({
    queryKey: ["user-search", query],
    queryFn: () => searchUsers(query),
    enabled: query.trim().length >= 2,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["user-search", query] });
    queryClient.invalidateQueries({ queryKey: ["friends-stats"] });
  };

  const sendMutation = useMutation({
    mutationFn: (userId: string) => sendFriendRequest(userId),
    onSuccess: () => {
      toast.success("Запит надіслано");
      invalidateAll();
    },
    onError: () => toast.error("Не вдалося надіслати запит"),
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

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Пошук друзів</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введіть ім'я користувача..."
          autoFocus
        />

        <div className={styles.results}>
          {query.trim().length < 2 ? (
            <p className={styles.hint}>Введіть щонайменше 2 символи</p>
          ) : isFetching ? (
            <p className={styles.hint}>Пошук...</p>
          ) : users.length === 0 ? (
            <p className={styles.hint}>Нікого не знайдено</p>
          ) : (
            users.map((user) => (
              <div key={user._id} className={styles.userRow}>
                <Link
                  href={`/profile/${user._id}`}
                  className={styles.userLink}
                  onClick={onClose}
                >
                  <Image
                    src={user.avatar}
                    alt={user.username}
                    width={40}
                    height={40}
                    className={styles.userAvatar}
                  />
                  <span className={styles.userName}>{user.username}</span>
                </Link>

                {user.relationStatus === "none" && (
                  <button
                    type="button"
                    className={styles.actionButton}
                    onClick={() => sendMutation.mutate(user._id)}
                    disabled={sendMutation.isPending}
                  >
                    Додати
                  </button>
                )}

                {user.relationStatus === "pending_sent" && user.requestId && (
                  <button
                    type="button"
                    className={styles.actionButtonSecondary}
                    onClick={() => cancelMutation.mutate(user.requestId!)}
                    disabled={cancelMutation.isPending}
                  >
                    Скасувати
                  </button>
                )}

                {user.relationStatus === "pending_received" &&
                  user.requestId && (
                    <button
                      type="button"
                      className={styles.actionButton}
                      onClick={() => acceptMutation.mutate(user.requestId!)}
                      disabled={acceptMutation.isPending}
                    >
                      Прийняти
                    </button>
                  )}

                {user.relationStatus === "friends" && (
                  <span className={styles.friendsLabel}>✓ Друзі</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
