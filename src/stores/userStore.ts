import { create } from "zustand";
interface User {
  id: string;
  nickname: string;
  profileImageUrl: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

export const userStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isNewUser: null,

  // 로그인 시 accessToken 저장
  setAccessToken: (token) => set({ accessToken: token }),
  //  user 정보 저장
  setUser: (user) => set({ user }),
  // 로그아웃 시 전부 초기화
  clearAuth: () => set({ accessToken: null, user: null }),
}));
