'use client';

import { useEffect, useRef, useState } from 'react';
import { userStore } from '@/stores/userStore';
import { EventSourcePolyfill } from 'event-source-polyfill';

export function useChatSSE(onMessage: (message: any) => void, onSchedule: (schedule: any) => void) {
  const { user, accessToken } = userStore();
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  const isMountedRef = useRef(true);
  const connectTimeRef = useRef<number>(0);

  const clearChatSSE = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  const connectChatSSE = () => {
    if (!user?.id || !accessToken || !isMountedRef.current) return;

    clearChatSSE();
    connectTimeRef.current = Date.now();

    const eventSource = new EventSourcePolyfill(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/sse/chat/stream?userId=${user.id}`, // 중괄호 하나 제거
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
        heartbeatTimeout: 90000, // 1분 30초동안 연결 유지
      }
    );

    eventSource.onopen = () => {};

    eventSource.addEventListener('message', (event: any) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('채팅 메시지 파싱 에러:', error);
      }
    });

    eventSource.addEventListener('schedule', (event: any) => {
      try {
        const data = JSON.parse(event.data);
        onSchedule(data);
      } catch (error) {
        console.error('채팅 메시지 파싱 에러:', error);
      }
    });

    eventSource.onerror = (error: any) => {
      eventSource.close();

      const connectionDuration = Date.now() - connectTimeRef.current;

      if (error?.target?.status === 403) {
        return;
      }

      if (connectionDuration < 5000) {
        console.log(`연결이 ${connectionDuration}ms 만에 끊어짐 - 실제 에러`);
        setTimeout(connectChatSSE, 30000);
      } else {
        console.log(`정상적인 연결 끊김 - 재연결`);
        connectChatSSE();
      }
    };

    eventSourceRef.current = eventSource;
  };

  useEffect(() => {
    isMountedRef.current = true;
    if (user?.id && accessToken) {
      connectChatSSE();
    }

    return () => {
      isMountedRef.current = false;
      clearChatSSE();
    };
  }, [user?.id, accessToken]);

  return { clearChatSSE };
}
