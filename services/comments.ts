import { api } from "@/lib/api";

export interface Comment {
  _id: string;
  text: string;
  location: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
}

export const getComments = async (locationId: string): Promise<Comment[]> => {
  const { data } = await api.get(`/locations/${locationId}/comments`);
  return data;
};

export const createComment = async (locationId: string, text: string): Promise<Comment> => {
  const { data } = await api.post(`/locations/${locationId}/comments`, { text });
  return data;
};

export const updateComment = async (
  locationId: string,
  commentId: string,
  text: string
): Promise<Comment> => {
  const { data } = await api.patch(
    `/locations/${locationId}/comments/${commentId}`,
    { text }
  );
  return data;
};

export const deleteComment = async (locationId: string, commentId: string) => {
  await api.delete(`/locations/${locationId}/comments/${commentId}`);
};