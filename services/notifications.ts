import { api } from "@/lib/api";

export interface NotificationItem {
  _id: string;
  type: "like" | "comment" | "friend_request" | "friend_accept";
  sender: {
    _id: string;
    username: string;
    avatar: string;
  };
  location?: {
    _id: string;
    name: string;
    images: string[];
  };
  isRead: boolean;
  createdAt: string;
}

export const getNotifications = async (): Promise<NotificationItem[]> => {
  const { data } = await api.get("/notifications");
  return data.notifications;
};

export const getUnreadCount = async (): Promise<number> => {
  const { data } = await api.get("/notifications/unread-count");
  return data.count;
};

export const markAllAsRead = async () => {
  const { data } = await api.patch("/notifications/mark-read");
  return data;
};