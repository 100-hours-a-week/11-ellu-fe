'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { userStore } from '@/stores/userStore';
import { useKakaoLogin } from '@/hooks/api/useKakaoLogin';
import { getMyInfo } from '@/api/user';
import CircularProgress from '@mui/material/CircularProgress';

export default function KakaoLoading() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setAccessToken = userStore((s) => s.setAccessToken);
  const setUser = userStore((s) => s.setUser);

  const { mutate: kakaoLogin } = useKakaoLogin();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error || !code) {
      alert('카카오 로그인에 실패했습니다.');
      router.replace('/auth/login');
      return;
    }

    kakaoLogin(code, {
      onSuccess: async ({ accessToken, isNewUser }) => {
        try {
          setAccessToken(accessToken); // accessToken 저장
          if (!isNewUser) {
            const user = await getMyInfo();
            setUser(user);
            router.replace('/projects');
            return;
          }
          router.replace('/auth/signup');
        } catch (err) {
          alert('사용자 정보를 불러오는 데 실패했습니다.');
          router.replace('/auth/login');
        }
      },
      onError: () => {
        alert('카카오 로그인 처리 중 오류가 발생했습니다.');
        router.replace('/auth/login');
      },
    });
  }, []);

  return <CircularProgress size={80} />;
}
