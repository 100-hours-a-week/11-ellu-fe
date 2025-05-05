'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import style from './AfterLoginHeader.module.css';
import Skeleton from '@mui/material/Skeleton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { logout } from '@/api/auth';
import { userStore } from '@/stores/userStore';

export default function AfterLoginHeader() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMypage = () => {
    setAnchorEl(null);
    router.push('/mypage');
  };

  const { user, clearAuth } = userStore();

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      router.push('/auth/login');
    } catch (error) {
      alert('로그아웃 실패');
    } finally {
      setAnchorEl(null);
    }
  };

  return (
    <header className={style.header}>
      <Link href={'/projects'}>
        <div className={style.logo}>
          <Image src={'/images/logo.svg'} width={40} height={50} alt={'로고'} style={{ marginTop: '3px' }} />
          <p>Looper</p>
        </div>
      </Link>
      <div className={style.myinfo} onClick={handleClick}>
        {user?.profileImageUrl ? (
          <Image
            src={user.profileImageUrl}
            alt="프로필 이미지"
            width={40}
            height={40}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Skeleton variant="circular" width={40} height={40} />
        )}
        <p>{user?.nickname ?? '사용자'}</p>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleMypage}>마이페이지</MenuItem>
        <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
      </Menu>
    </header>
  );
}
