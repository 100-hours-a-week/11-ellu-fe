'use client';

import ChatBotLoadingDots from './ChatBotLoadingDots';
import { userStore } from '@/stores/userStore';
import style from './ChatBot.module.css';
import Image from 'next/image';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { useState, useEffect, useRef } from 'react';
import { Message } from '@/types/chatbot';
import { usePostMessage } from '@/hooks/api/chatbot/usePostMessage';
import { useChatSSE } from '@/hooks/integration/useChatSSE';
import { usePreviewSchedulesStore } from '@/stores/previewSchedulesStore';
import { useChatbotCreateSchedule } from '@/hooks/api/chatbot/useChatbotCreateSchedule';
import { useGetChatMessage } from '@/hooks/api/chatbot/useGetChatMessage';
import { Box, CircularProgress } from '@mui/material';

export default function ChatBot() {
  const { user } = userStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [finalMessage, setFinalMessage] = useState('');
  const [planTitle, setPlanTitle] = useState('');
  const [category, setCategory] = useState('');
  const { mutate: postMessage, isPending: isPosting } = usePostMessage();
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const [showScheduleButtons, setShowScheduleButtons] = useState(false);
  const { previewEvents, addPreviewEvent, clearAll } = usePreviewSchedulesStore();
  const { mutate: chatbotCreateSchedule } = useChatbotCreateSchedule();
  const { data: chatMessages, isLoading: isChatMessagesLoading } = useGetChatMessage();

  useEffect(() => {
    if (chatMessages) {
      chatMessages.forEach((message) => {
        setMessages((prev) => [...prev, { content: message.content, isUser: message.role === 'USER' ? true : false }]);
      });
    }
  }, [chatMessages]);

  // 메시지가 추가될 때마다 스크롤을 아래로 내림
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

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
      setStreamingMessage((prev) => prev + ' ' + data.message);
    }
  };

  const handleSSESchedule = (data: any) => {
    setShowScheduleButtons(true);
    setPlanTitle(data.task_title);
    setCategory(data.category);
    const previewEvent = {
      id: `schedule-${Date.now()}`,
      title: `🤖 ${data.schedule_preview[0].title}`,
      start: new Date(data.schedule_preview[0].start_time),
      end: new Date(data.schedule_preview[0].end_time),
      description: '',
      extendedProps: {
        is_preview: true,
        is_ai_recommended: true,
        is_project_schedule: false,
      },
    };
    // 스토어에 미리보기 데이터 저장
    addPreviewEvent(previewEvent);
  };

  // 채팅 SSE 연결
  useChatSSE(handleSSEMessage, handleSSESchedule);

  const handleSubmit = () => {
    if (!message.trim()) return;

    // 새 메시지 전송 시 초기화
    setStreamingMessage('');
    setFinalMessage('');
    clearPreviewAndButtons();

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
    setIsStreaming(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (e.nativeEvent.isComposing) return;
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
    }
  };

  // 전체 수락
  const handleAcceptAll = () => {
    chatbotCreateSchedule(
      {
        planTitle: planTitle,
        category: category,
        eventDataList: previewEvents,
      },
      {
        onSuccess: () => {
          console.log('일반 일정 생성 성공');
        },
        onError: (error) => {
          console.error('일정 저장 실패:', error);
          alert('일정 저장에 실패했습니다.');
        },
      }
    );
    clearPreviewAndButtons();
  };

  // 전체 거절
  const handleRejectAll = () => {
    clearPreviewAndButtons();
  };

  const clearPreviewAndButtons = () => {
    clearAll();
    setShowScheduleButtons(false);
  };

  if (isChatMessagesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60%">
        <CircularProgress sx={{ scale: '1.5' }} />
      </Box>
    );
  }

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
          <div className={style.messageBox} ref={messageBoxRef}>
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
            {isStreaming && (
              <div>
                <Image src="/images/logo.svg" alt="로고" width={25} height={25} />
                <div className={`${style.message} ${style.bot_message} ${style.streamingMessage}`}>
                  {streamingMessage ? streamingMessage : <ChatBotLoadingDots />}
                </div>
              </div>
            )}
            {showScheduleButtons && (
              <div className={style.scheduleButtons}>
                <button onClick={handleAcceptAll} className={style.acceptButton}>
                  ✅ 모든 일정 수락
                </button>
                <button onClick={handleRejectAll} className={style.rejectButton}>
                  ❌ 모든 일정 거절
                </button>
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
