'use client';

import { userStore } from '@/stores/userStore';
import style from './ChatBot.module.css';
import Image from 'next/image';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';

export default function ChatBot() {
  const { user } = userStore();

  return (
    <div className={style.container}>
      <div className={style.header}>
        <Image src="/images/logo.svg" alt="로고" width={28} height={28} />
        {user?.nickname}님, &nbsp;안녕하세요
      </div>
      <div className={style.chatbot}>
        <div className={style.chatbot_input}>
          <textarea placeholder="오늘은 어떤 일정을 계획중인가요?" className={style.chatbot_input_field} />
          <button className={style.chatbot_input_button}>
            <ArrowCircleUpIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
