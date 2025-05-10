'use client';

import { useState, useEffect } from 'react';
import { Box, TextField, Button, Avatar, Typography, Skeleton, Alert } from '@mui/material';
import style from './MypageForm.module.css';
import { userStore } from '@/stores/userStore';
import { useEditMyInfo } from '@/hooks/api/user/useEditMyInfo';

export default function MypageForm() {
  const user = userStore((state) => state.user);
  const setUser = userStore((state) => state.setUser);

  const [nickname, setNickname] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const { mutate: updateNickname, isPending } = useEditMyInfo();

  useEffect(() => {
    if (user?.nickname) {
      setNickname(user.nickname);
    }
  }, [user]);

  // 닉네임 유효성 검사 규칙
  const nicknameRegex = /^[a-zA-Z0-9가-힣]{1,10}$/;

  const validateNickname = (value: string): string | null => {
    if (!value.trim()) {
      return '닉네임을 입력해주세요.';
    }

    if (value.length > 10) {
      return '닉네임은 최대 10자까지 가능합니다.';
    }

    if (!nicknameRegex.test(value)) {
      return '닉네임은 한글, 영문 또는 숫자만 사용할 수 있습니다.';
    }

    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setError(validateNickname(value));
  };

  const handleUpdateNickname = () => {
    const validationError = validateNickname(nickname);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (nickname === user?.nickname) {
      setError('현재 닉네임과 동일합니다.');
      return;
    }

    updateNickname(nickname, {
      onSuccess: () => {
        if (user) {
          setUser({
            ...user,
            nickname: nickname,
          });
        }
        setIsSuccess(true);
        setError(null);
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      },
      onError: (err) => {
        if (err.response?.status === 409) {
          setError('이미 사용 중인 닉네임입니다.');
        } else {
          alert('닉네임 변경 중 오류가 발생했습니다.');
        }
      },
    });
  };

  if (!user) {
    return (
      <Box className={style.formContainer}>
        <Skeleton variant="circular" width={100} height={100} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={50} />
      </Box>
    );
  }

  return (
    <Box className={style.formContainer}>
      <Box className={style.profileImageSection}>
        <Avatar
          src={user?.imageUrl}
          sx={{
            width: 100,
            height: 100,
            border: '1.5px solid gray',
            fontSize: '2rem',
          }}
        >
          {user?.nickname?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
      </Box>

      <Box className={style.nicknameSection}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          닉네임
        </Typography>

        <TextField
          value={nickname}
          onChange={handleChange}
          error={!!error}
          helperText={error ?? '한글, 영문, 숫자만 입력해주세요 (1~10자)'}
          fullWidth
          sx={{ mb: 3 }}
          disabled={isPending}
        />
        {isSuccess && (
          <Alert severity="success" sx={{ width: '93%', mb: 2 }}>
            닉네임이 성공적으로 변경되었습니다.
          </Alert>
        )}
        <Button
          variant="contained"
          onClick={handleUpdateNickname}
          disabled={!!error || isPending || nickname.length === 0 || nickname === user?.nickname}
          fullWidth
          sx={{ height: 50 }}
        >
          {isPending ? '변경 중...' : '닉네임 변경하기'}
        </Button>
      </Box>
    </Box>
  );
}
