import { api } from "@/lib/api";

export interface CurrentUser {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  friends: string[];
  isVerified: boolean;
}

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const { data } = await api.get("/users/me");
  return data.user;
};

export const updateAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await api.patch("/users/me/avatar", formData);
  return data.avatar;
};

export type RelationStatus = "none" | "friends" | "pending_sent" | "pending_received";

export interface UserProfile {
  _id: string;
  username: string;
  avatar: string;
  bio: string;
}

export interface UserProfileResponse {
  user: UserProfile;
  relationStatus: RelationStatus;
  requestId: string | null;
}

export const getUserById = async (id: string): Promise<UserProfileResponse> => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};
export interface SearchedUser {
  _id: string;
  username: string;
  avatar: string;
  relationStatus: RelationStatus;
  requestId: string | null;
}

export const searchUsers = async (query: string): Promise<SearchedUser[]> => {
  const { data } = await api.get("/users/search", { params: { q: query } });
  return data.users;
};