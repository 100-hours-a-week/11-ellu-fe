import api from "@/lib/axios";

export const postSignup = async (nickname: string): Promise<void> => {
  await api.post("/auth/users/nickname", { nickname });
};
