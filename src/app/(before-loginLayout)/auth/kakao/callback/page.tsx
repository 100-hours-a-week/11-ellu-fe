"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/Loading";
import style from "./page.module.css";
import { userStore } from "@/stores/userStore";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = userStore((s) => s.setAccessToken);

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // 카카오 로그인 실패
    if (error || !code) {
      alert("카카오 로그인에 실패했습니다.");
      router.replace("/auth/login");
      return;
    }

    (async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // refreshToken 쿠키
          body: JSON.stringify({ code }),
        }
      );

      if (!res.ok) {
        alert("카카오 로그인에 실패했습니다.");
        router.replace("/auth/login");
        return;
      }

      const { accessToken, isNewUser } = await res.json();
      setAuth(accessToken);
      if (isNewUser) {
        router.replace("/auth/signup");
      } else {
        router.replace("/projects");
      }
    })();
  }, []);

  return (
    <div className={style.container}>
      <Loading />
    </div>
  );
}
