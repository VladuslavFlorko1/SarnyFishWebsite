import { api } from "@/lib/api";

export interface FriendsStats {
  friendsCount: number;
  sentPendingCount: number;
  receivedPendingCount: number;
}

export interface FriendUser {
  _id: string;
  username: string;
  avatar: string;
}

export interface FriendRequestItem {
  _id: string;
  from?: FriendUser;
  to?: FriendUser;
  status: string;
}

export const getFriendsStats = async (): Promise<FriendsStats> => {
  const { data } = await api.get("/friends/stats");
  return data;
};

export const getFriendsList = async (): Promise<FriendUser[]> => {
  const { data } = await api.get("/friends");
  return data.friends;
};

export const getReceivedRequests = async (): Promise<FriendRequestItem[]> => {
  const { data } = await api.get("/friends/requests/received");
  return data.requests;
};

export const getSentRequests = async (): Promise<FriendRequestItem[]> => {
  const { data } = await api.get("/friends/requests/sent");
  return data.requests;
};

export const sendFriendRequest = async (userId: string) => {
  const { data } = await api.post(`/friends/request/${userId}`);
  return data;
};

export const acceptFriendRequest = async (requestId: string) => {
  const { data } = await api.patch(`/friends/accept/${requestId}`);
  return data;
};

export const rejectFriendRequest = async (requestId: string) => {
  const { data } = await api.delete(`/friends/reject/${requestId}`);
  return data;
};

export const cancelFriendRequest = async (requestId: string) => {
  const { data } = await api.delete(`/friends/cancel/${requestId}`);
  return data;
};

export const removeFriend = async (userId: string) => {
  const { data } = await api.delete(`/friends/${userId}`);
  return data;
};