"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {
  getNotifications,
  markAllAsRead,
  NotificationItem,
} from "@/services/notifications";
import styles from "./NotificationsPage.module.css";

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "щойно";
  if (minutes < 60) return `${minutes} хв`;
  if (hours < 24) return `${hours} год`;
  return `${days} дн`;
}

function getNotificationText(notification: NotificationItem): string {
  switch (notification.type) {
    case "like":
      return "вподобав(ла) вашу локацію";
    case "comment":
      return "прокоментував(ла) вашу локацію";
    case "friend_request":
      return "надіслав(ла) запит на дружбу";
    case "friend_accept":
      return "прийняв(ла) вашу дружбу";
    default:
      return "";
  }
}

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const markReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
  });

  useEffect(() => {
    markReadMutation.mutate();
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Активність</h1>

      {notifications.length === 0 ? (
        <p className={styles.emptyText}>Поки що немає сповіщень</p>
      ) : (
        <div className={styles.list}>
          {notifications.map((notification) => (
            <Link
              key={notification._id}
              href={
                notification.type === "like" || notification.type === "comment"
                  ? `/locations/${notification.location?._id}`
                  : `/profile/${notification.sender._id}`
              }
              className={`${styles.row} ${!notification.isRead ? styles.rowUnread : ""}`}
            >
              <Image
                src={notification.sender.avatar}
                alt={notification.sender.username}
                width={44}
                height={44}
                className={styles.senderAvatar}
              />

              <div className={styles.content}>
                <p className={styles.text}>
                  <span className={styles.username}>
                    {notification.sender.username}
                  </span>{" "}
                  {getNotificationText(notification)}
                  <span className={styles.time}>
                    {" "}
                    · {formatTimeAgo(notification.createdAt)}
                  </span>
                </p>
              </div>

              {notification.location?.images?.[0] && (
                <div className={styles.thumbWrapper}>
                  <Image
                    src={notification.location.images[0]}
                    alt={notification.location.name}
                    fill
                    sizes="44px"
                    className={styles.thumb}
                  />
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
