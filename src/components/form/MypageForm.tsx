'use client';

import { useState, useEffect } from 'react';
import { Box, TextField, Button, Avatar, Typography } from '@mui/material';
import style from './MypageForm.module.css';

const user = {
  nickname: '홍길동',
  profileImageUrl: 'https://via.placeholder.com/150',
};

export default function MypageForm() {
  const [nickname, setNickname] = useState<string>(user.nickname);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const nicknameRegex = /^[a-zA-Z0-9가-힣]{1,10}$/;

  const validateNickname = (value: string): string | null => {
    if (!nicknameRegex.test(value)) {
      return '닉네임은 1~10자의 한글, 영문 또는 숫자만 사용할 수 있습니다.';
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setError(validateNickname(value));
  };

  const handleUpdateNickname = async () => {
    const validationMessage = validateNickname(nickname);

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    if (nickname === user?.nickname) {
      return; // No need to update if it's the same
    }

    try {
      setIsUpdating(true);
    } catch (err) {
      setError('닉네임 변경 중 오류가 발생했습니다.');
      console.error('Error updating nickname:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Box className={style.formContainer}>
      <Box className={style.profileImageSection}>
        {user?.profileImageUrl ? (
          <Avatar src={user.profileImageUrl} alt="프로필 이미지" sx={{ width: 100, height: 100 }} />
        ) : (
          <Avatar sx={{ width: 100, height: 100, bgcolor: 'var(--color-primary)' }}>{user?.nickname?.charAt(0).toUpperCase() || ''}</Avatar>
        )}
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
        />

        <Button
          variant="contained"
          onClick={handleUpdateNickname}
          disabled={!!error || isUpdating || nickname.length === 0 || nickname === user?.nickname}
          fullWidth
          sx={{ height: 50 }}
        >
          닉네임 변경하기
        </Button>
      </Box>
    </Box>
  );
}
