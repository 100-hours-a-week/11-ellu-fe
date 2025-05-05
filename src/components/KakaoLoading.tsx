'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { userStore } from '@/stores/userStore';
import { useKakaoLogin } from '@/hooks/api/auth/useKakaoLogin';
import { getMyInfo } from '@/api/user';
import CircularProgress from '@mui/material/CircularProgress';

export default function KakaoLoading() {
  const router = useRouter();
  const searchParams = useSearchParams();

  //Zustand 상태 관리
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
          setAccessToken(accessToken);
          if (!isNewUser) {
            // 이미 가입된 유저
            const user = await getMyInfo();
            setUser(user);
            router.replace('/projects');
            return;
          }
          // 신규 유저
          router.replace('/auth/signup');
        } catch (err) {
          alert('사용자 정보를 불러오는 데 실패했습니다.');
          router.replace('/auth/login');
        }
      },
      onError: (error) => {
        console.error('카카오 로그인 오류:', error);
        alert('카카오 로그인 처리 중 오류가 발생했습니다.');
        router.replace('/auth/login');
      },
    });
  }, []);

  return <CircularProgress size={80} />;
}
