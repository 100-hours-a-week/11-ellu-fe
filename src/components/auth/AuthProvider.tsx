'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userStore } from '@/stores/userStore';
import { refreshAccessToken } from '@/api/auth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, setUser, accessToken, setAccessToken } = userStore();

  // 개발 환경 인증검사 제외
  if (process.env.NODE_ENV === 'development') {
    return <>{children}</>;
  }

  useEffect(() => {
    const initializeAuth = async () => {
      if (!accessToken) {
        try {
          // 토큰 재발급 시도
          const authData = await refreshAccessToken();
          if (authData?.accessToken) {
            setAccessToken(authData.accessToken);
            setUser(authData.user);
          }
        } catch (error) {
          console.error('인증 초기화 실패:', error);
          router.push('/auth/login');
        }
      }
    };

    initializeAuth();
  }, [accessToken, user, setAccessToken, setUser, router]);

  return <>{children}</>;
}
