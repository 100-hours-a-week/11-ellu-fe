'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import style from './LeftNaviagtionBar.module.css';

export default function LeftNavigationBar() {
  const pathname = usePathname();

  const navItems = [
    { label: '프로젝트', href: 'projects', icon: '/images/project.svg' },
    { label: '캘린더', href: 'my-calendar', icon: '/images/calendar.svg' },
    { label: '마이페이지', href: 'mypage', icon: '/images/mypage.svg' },
  ];

  return (
    <div className={style.container}>
      <ul>
        {navItems.map((item) => (
          <li key={item.href} className={pathname.split('/')[1] === item.href ? style.active : ''}>
            <Link href={`/${item.href}`}>
              <Image src={item.icon} alt={item.label} width={25} height={25} className={style.icon} />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
