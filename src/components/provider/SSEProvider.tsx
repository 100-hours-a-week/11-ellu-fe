'use client';

import { useEffect, useRef } from 'react';
import { userStore } from '@/stores/userStore';
import { EventSourcePolyfill } from 'event-source-polyfill';

export default function SSEProvider({ children }: { children: React.ReactNode }) {
  const { user, accessToken } = userStore();
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  const errorAttemptsRef = useRef(0);
  const connectTimeRef = useRef<number>(0);

  const connectSSE = () => {
    if (!user?.id || !accessToken) return;

    // 기존 연결 정리
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    connectTimeRef.current = Date.now();

    const eventSource = new EventSourcePolyfill(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/sse/subscribe?userId=${user.id}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
        heartbeatTimeout: 30000,
      }
    );

    eventSource.onopen = () => {
      errorAttemptsRef.current = 0;
    };

    eventSource.addEventListener('notification', (event: any) => {
      try {
        const data = JSON.parse(event.data);
        console.log('알림:', data);
        // 알림 처리
      } catch (error) {
        console.error('알림 데이터 파싱 에러:', error);
      }
    });

    eventSource.onerror = (error: any) => {
      eventSource.close();

      const connectionDuration = Date.now() - connectTimeRef.current;

      // 토큰만료시 연결해제
      if (error?.target?.status === 403) {
        return;
      }

      if (connectionDuration < 5000) {
        console.log(`연결이 ${connectionDuration}ms 만에 끊어짐 - 실제 에러`);
        errorAttemptsRef.current++;

        if (errorAttemptsRef.current >= 5) {
          return;
        }

        console.log(`에러 재시도 ${errorAttemptsRef.current}/5`);
        setTimeout(connectSSE, 10000);
      } else {
        console.log(`정상적인 연결 끊김 - 재연결`);
        setTimeout(connectSSE, 3000);
      }
    };

    eventSourceRef.current = eventSource;
  };

  useEffect(() => {
    if (user?.id && accessToken) {
      connectSSE();
    } else {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      errorAttemptsRef.current = 0;
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [user?.id, accessToken]);

  return <>{children}</>;
}
