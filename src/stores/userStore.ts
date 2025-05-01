import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
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

export const userStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null, // accessToken은 메모리에 저장
      user: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ accessToken: null, user: null }),
    }),
    {
      name: 'user-store',
      partialize: (state) => ({ user: state.user }), // user정보만 로컬스토리지에 저장
    }
  )
);
