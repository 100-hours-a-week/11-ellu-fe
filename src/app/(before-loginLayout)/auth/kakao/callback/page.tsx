"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/Loading";
import style from "./page.module.css";
import { userStore } from "@/stores/userStore";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = userStore((s) => s.setAuth);

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
      const res = await fetch("/api/auth/kakao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // refreshToken 쿠키
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        alert("카카오 로그인에 실패했습니다.");
        router.replace("/auth/login");
        return;
      }

      let response = res.json();

      console.log("!!!!!!!!", response);

      //   const { accessToken, user, isNewUser } = await res.json();
      //   setAuth(accessToken, user);

      //   if (isNewUser) {
      //     router.replace("/auth/signup"); // 신규 유저는 닉네임 입력 등 회원가입 절차로
      //   } else {
      //     router.replace("/projects"); // 기존 유저는 메인으로
      //   }
    })();
  }, []);

  return (
    <div className={style.container}>
      <Loading />
    </div>
  );
}
