'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, MenuItem, Skeleton, Avatar, Typography, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

import { logout } from '@/api/auth';
import { userStore } from '@/stores/userStore';
import style from './AfterLoginHeader.module.css';
import Alarm from './Alarm';

export default function AfterLoginHeader() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { user, clearAuth } = userStore();

  // 드롭다운 열기
  const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  // 드롭다운 닫기
  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleNavigateToMypage = useCallback(() => {
    handleCloseMenu();
    router.push('/mypage');
  }, [router, handleCloseMenu]);

  // 로그아웃 처리
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      clearAuth();
      router.push('/auth/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃 중 문제가 발생했습니다.');
    } finally {
      handleCloseMenu();
    }
  }, [clearAuth, router, handleCloseMenu]);

  return (
    <header className={style.header}>
      <Link href="/projects" className={style.logo}>
        <Image src="/images/logo.svg" width={40} height={50} alt="Looper 로고" style={{ marginTop: '3px' }} />
        <p>Looper</p>
      </Link>

      <div className={style.profileContainer}>
        <Alarm />
        <Box className={style.myinfo} onClick={handleOpenMenu}>
          {user ? (
            <Avatar
              src={user.imageUrl || undefined}
              alt={`${user.nickname} 프로필`}
              sx={{ width: 40, height: 40, border: '1px solid gray', bgcolor: 'white' }}
            >
              {!user.imageUrl && user.nickname?.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Skeleton variant="circular" width={40} height={40} />
          )}

          <Typography variant="body1" fontWeight="bold" sx={{ ml: 1 }}>
            {user?.nickname || '정보없음'}
          </Typography>
        </Box>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 180, mt: 0.5 },
        }}
      >
        <MenuItem onClick={handleNavigateToMypage} sx={{ py: 1.5, '&:hover': { backgroundColor: 'transparent' } }}>
          <PersonIcon fontSize="small" sx={{ mr: 1.5 }} />
          <Typography variant="body2">마이페이지</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ py: 1.5, '&:hover': { backgroundColor: 'transparent' } }}>
          <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
          <Typography variant="body2">로그아웃</Typography>
        </MenuItem>
      </Menu>
    </header>
  );
}
