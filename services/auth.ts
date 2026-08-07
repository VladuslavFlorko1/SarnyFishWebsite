import { api } from "@/lib/api";

export const verifyEmail = async (email: string, code: string) => {
  const { data } = await api.post("/auth/verify-email", { email, code });
  return data;
};

export const resendVerification = async (email: string) => {
  const { data } = await api.post("/auth/resend-verification", { email });
  return data;
};