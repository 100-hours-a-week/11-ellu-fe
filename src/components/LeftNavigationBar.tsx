'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import style from './LeftNaviagtionBar.module.css';

import Diversity3Icon from '@mui/icons-material/Diversity3';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatIcon from '@mui/icons-material/Chat';

export default function LeftNavigationBar() {
  const pathname = usePathname();

  const navItems = [
    { label: '프로젝트', href: 'projects', icon: <Diversity3Icon /> },
    { label: '캘린더', href: 'my-calendar', icon: <EditCalendarIcon /> },
    { label: '마이페이지', href: 'mypage', icon: <AccountCircleIcon /> },
    { label: '챗봇', href: 'chatbot', icon: <ChatIcon /> },
  ];

  return (
    <div className={style.container}>
      <ul>
        {navItems.map((item) => (
          <li key={item.href} className={pathname.split('/')[1] === item.href ? style.active : ''}>
            <Link href={`/${item.href}`}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
