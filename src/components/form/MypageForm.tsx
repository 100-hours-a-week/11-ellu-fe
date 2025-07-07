'use client';

import { useState, useEffect } from 'react';
import { Box, TextField, Button, Avatar, Typography, Skeleton, Alert, Link } from '@mui/material';
import style from './MypageForm.module.css';
import { userStore } from '@/stores/userStore';
import { useEditMyInfo } from '@/hooks/api/user/useEditMyInfo';
import { useValidation } from '@/hooks/common/useValidation';

export default function MypageForm() {
  const user = userStore((state) => state.user);
  const setUser = userStore((state) => state.setUser);

  const [nickname, setNickname] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const { mutate: updateNickname, isPending } = useEditMyInfo();

  const { errors, validateField, setError } = useValidation();

  useEffect(() => {
    if (user?.nickname) {
      setNickname(user.nickname);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    validateField('nickname', value, 'nickname');
  };

  const handleUpdateNickname = () => {
    const isValid = validateField('nickname', nickname, 'nickname');
    if (!isValid || nickname === user?.nickname) return;

    updateNickname(nickname, {
      onSuccess: () => {
        if (user) {
          setUser({
            ...user,
            nickname: nickname,
          });
        }
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      },
      onError: (err) => {
        if (err.response?.status === 409) {
          setError('nickname', '이미 사용 중인 닉네임입니다.');
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
          error={!!errors.nickname}
          helperText={errors.nickname}
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
          disabled={!!errors.nickname || isPending || nickname.length === 0 || nickname === user?.nickname}
          fullWidth
          sx={{ height: 50 }}
        >
          {isPending ? '변경 중...' : '닉네임 변경하기'}
        </Button>
      </Box>
      <Link
        href="https://docs.google.com/forms/d/15dDCEYxSZyNY_ZHN4bozniQuE0WC5vx5JPq7jKyyYt4/edit"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          textDecoration: 'none',
          fontSize: '0.8rem',
          mt: 2,
          color: 'gray',
        }}
      >
        💬 고객센터 문의
      </Link>
    </Box>
  );
}
