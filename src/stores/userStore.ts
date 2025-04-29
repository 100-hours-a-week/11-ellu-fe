import { create } from 'zustand';

interface User {
  id: string;
  nickname: string;
  profileImageUrl: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAuth: (accessToken: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAuth: (accessToken, user) => set({ accessToken, user }), // 로그인
  clearAuth: () => set({ accessToken: null, user: null }), // 로그아웃
}));
