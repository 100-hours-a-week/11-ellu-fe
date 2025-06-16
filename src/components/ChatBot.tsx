'use client';

import { userStore } from '@/stores/userStore';
import style from './ChatBot.module.css';
import Image from 'next/image';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { useState, useEffect, useRef } from 'react';
import { Message } from '@/types/chatbot';
import { usePostMessage } from '@/hooks/api/chatbot/usePostMessage';
import { useChatSSE } from '@/hooks/useChatSSE';

export default function ChatBot() {
  const { user } = userStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [finalMessage, setFinalMessage] = useState('');
  const { mutate: postMessage, isPending: isPosting } = usePostMessage();

  // 최종 메시지가 설정되면 대화 목록에 추가
  useEffect(() => {
    if (finalMessage) {
      setMessages((prev) => [...prev, { content: finalMessage, isUser: false }]);
      setFinalMessage('');
    }
  }, [finalMessage]);

  const handleSSEMessage = (data: any) => {
    if (data.done) {
      // 스트리밍 완료
      setStreamingMessage((prev) => {
        const completed = prev + ' ' + data.message;
        setFinalMessage(completed);
        return '';
      });
      setIsStreaming(false);
    } else {
      // 스트리밍 중 - 메시지 누적
      setIsStreaming(true);
      setStreamingMessage((prev) => prev + ' ' + data.message);
    }
  };

  // 채팅 SSE 연결
  useChatSSE(handleSSEMessage);

  const handleSubmit = () => {
    if (!message.trim()) return;

    // 새 메시지 전송 시 초기화
    setStreamingMessage('');
    setFinalMessage('');

    postMessage(
      { message },
      {
        onSuccess: () => {
          setMessages((prev) => [...prev, { content: message, isUser: true }]);
        },
        onError: (error) => {
          alert('메세지 전송에 실패했습니다');
        },
      }
    );
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
      {messages.length === 0 && !isStreaming && (
        <div className={style.header}>
          <Image src="/images/logo.svg" alt="로고" width={28} height={28} />
          {user?.nickname}님, &nbsp;안녕하세요
        </div>
      )}
      <div className={style.chatbot}>
        {(messages.length > 0 || isStreaming) && (
          <div className={style.messageBox}>
            {messages.map((msg, index) =>
              msg.isUser ? (
                <div key={index} className={`${style.message} ${style.user_message}`}>
                  {msg.content}
                </div>
              ) : (
                <div key={index}>
                  <Image src="/images/logo.svg" alt="로고" width={25} height={25} />
                  <div className={`${style.message} ${style.bot_message}`}>{msg.content}</div>
                </div>
              )
            )}
            {/* 스트리밍 중인 메시지 실시간 표시 */}
            {isStreaming && streamingMessage && (
              <div>
                <Image src="/images/logo.svg" alt="로고" width={25} height={25} />
                <div className={`${style.message} ${style.bot_message} ${style.streamingMessage}`}>
                  {streamingMessage}
                </div>
              </div>
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
            disabled={isStreaming}
          />
          <button
            className={style.chatbot_input_button}
            disabled={!message.trim() || isStreaming}
            onClick={handleSubmit}
          >
            <ArrowCircleUpIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
