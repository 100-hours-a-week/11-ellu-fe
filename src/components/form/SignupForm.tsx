"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Box } from "@mui/material";
import { userStore } from "@/stores/userStore";

export default function SignupForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const nicknameRegex = /^[a-zA-Z0-9가-힣]{1,10}$/;

  const validateNickname = (value: string): string | null => {
    if (!nicknameRegex.test(value)) {
      return "닉네임은 1~10자의 한글, 영문 또는 숫자만 사용할 수 있습니다.";
    }
    return null;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setError(validateNickname(value));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationMessage = validateNickname(nickname);

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const accessToken = userStore.getState().accessToken;

    if (!accessToken) {
      alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
      router.replace("/auth/login");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/users/nickname`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify({ nickname }),
        }
      );

      if (!res.ok) {
        const { message } = await res.json();

        // 닉네임 중복 에러
        if (res.status === 409 && message === "nickname_already_exists") {
          setError("이미 사용 중인 닉네임입니다.");
          return;
        }

        // 그 외 에러
        alert(message || "회원가입 처리 중 문제가 발생했습니다.");
        return;
      }

      router.replace("/projects");
    } catch (err: any) {
      setError(err.message || "회원가입 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: 530 }}
    >
      <TextField
        label="닉네임"
        value={nickname}
        onChange={handleChange}
        error={!!error}
        helperText={error ?? "한글, 영문, 숫자만 입력해주세요 (1~10자)"}
        required
      />
      <Button
        type="submit"
        variant="contained"
        disabled={!!error || nickname.length === 0}
        sx={{ marginTop: 3, height: 50 }}
      >
        회원가입 완료
      </Button>
    </Box>
  );
}
