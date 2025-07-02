'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Box } from '@mui/material';
import { userStore } from '@/stores/userStore';
import { useSignup } from '@/hooks/api/auth/useSignup';
import { getMyInfo } from '@/api/user';
import { useValidation } from '@/hooks/common/useValidation';

export default function SignupForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState<string>('');

  const { errors, validateField, setError } = useValidation();

  const setUser = userStore((s) => s.setUser);

  const { mutate: signup, isPending } = useSignup();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    validateField(value, 'nickname');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validateField(nickname, 'nickname');
    if (!isValid) return;

    signup(nickname, {
      onSuccess: async () => {
        try {
          const user = await getMyInfo();
          setUser(user);
          router.replace('/projects');
        } catch (err) {
          alert('회원가입은 완료되었지만 사용자 정보 불러오기에 실패했습니다.');
          router.replace('/auth/login');
        }
      },
      onError: (err) => {
        if (err.response?.status === 409) {
          setError('이미 사용 중인 닉네임입니다.');
        } else {
          alert('회원가입 처리 중 문제가 발생했습니다.');
        }
      },
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 530 }}
    >
      <TextField
        label="닉네임"
        value={nickname}
        onChange={handleChange}
        error={!!errors}
        helperText={errors ?? '한글, 영문, 숫자만 입력해주세요 (1~10자)'}
        required
      />
      <Button
        type="submit"
        variant="contained"
        disabled={!!errors || nickname.length === 0 || isPending}
        sx={{ marginTop: 3, height: 50 }}
      >
        회원가입 완료
      </Button>
    </Box>
  );
}
