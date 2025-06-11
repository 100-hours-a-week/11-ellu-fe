'use client';

import { userStore } from '@/stores/userStore';
import style from './ChatBot.module.css';
import Image from 'next/image';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { useState, useEffect, useRef } from 'react';
import { Message } from '@/types/chatbot';
import { usePostMessage } from '@/hooks/api/chatbot/usePostMessage';

export default function ChatBot() {
  const { user } = userStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { mutate: postMessage, isPending: isPosting } = usePostMessage();

  const handleSubmit = () => {
    if (!message.trim()) return;
    postMessage(
      { message },
      {
        onSuccess: () => {
          setMessages([...messages, { content: message, isUser: true }]);
        },
        onError: (error) => {
          alert('메세지 전송에 실패했습니다');
        },
      }
    );
    // setMessages((prevMessages) => [
    //   ...prevMessages,
    //   { content: message, isUser: true },
    //   {
    //     content: '저의 선택은요',
    //     isUser: false,
    //   },
    // ]);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (e.nativeEvent.isComposing) return;
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
    }
  };

  return (
    <div className={style.container}>
      {messages.length === 0 && (
        <div className={style.header}>
          <Image src="/images/logo.svg" alt="로고" width={28} height={28} />
          {user?.nickname}님, &nbsp;안녕하세요
        </div>
      )}
      <div className={style.chatbot}>
        {messages.length > 0 && (
          <div className={style.messageBox}>
            {messages.map((msg, index) =>
              msg.isUser ? (
                <div key={index} className={`${style.message} ${style.user_message}`}>
                  {msg.content}
                </div>
              ) : (
                <div key={index}>
                  <Image src="/images/logo.svg" alt="로고" width={25} height={25} />
                  <div key={index} className={`${style.message} ${style.bot_message}`}>
                    {msg.content}
                  </div>
                </div>
              )
            )}
          </div>
        )}
        <div className={style.chatbot_input}>
          <textarea
            placeholder="오늘은 어떤 일정을 계획중인가요?"
            className={style.chatbot_input_field}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className={style.chatbot_input_button} disabled={!message.trim()} onClick={handleSubmit}>
            <ArrowCircleUpIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
