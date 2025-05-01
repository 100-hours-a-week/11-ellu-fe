"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { userStore } from "@/stores/userStore";
import { useKakaoLogin } from "@/hooks/api/useKakaoLogin";
import CircularProgress from "@mui/material/CircularProgress";

export default function KakaoLoading() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = userStore((s) => s.setAccessToken);

  const { mutate: kakaoLogin, isPending } = useKakaoLogin();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
      alert("카카오 로그인에 실패했습니다.");
      router.replace("/auth/login");
      return;
    }

    kakaoLogin(code, {
      onSuccess: ({ accessToken, isNewUser }) => {
        setAuth(accessToken);
        router.replace(isNewUser ? "/auth/signup" : "/projects");
      },
      onError: () => {
        alert("카카오 로그인 처리 중 오류가 발생했습니다.");
        router.replace("/auth/login");
      },
    });
  }, []);

  return <CircularProgress size={80} />;
}
