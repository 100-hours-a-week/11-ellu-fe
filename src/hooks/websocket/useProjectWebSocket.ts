// src/hooks/useWebSocket.ts
import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { userStore } from '@/stores/userStore';
import { createWebSocketClient } from '@/lib/websocket';
import { Client } from '@stomp/stompjs';

export const useProjectWebSocket = (projectId: number) => {
  const clientRef = useRef<Client | null>(null);
  const queryClient = useQueryClient();
  const { accessToken } = userStore();

  useEffect(() => {
    if (!accessToken || !projectId) return;

    // 웹소켓 연결
    const client = createWebSocketClient(accessToken);

    client.onConnect = () => {
      console.log('웹소켓 연결됨');
      clientRef.current = client;

      const subscription = client.subscribe(`/topic/${projectId}`, (message) => {
        console.log('받은 메시지:', message.body);
        const response = JSON.parse(message.body);

        // // 메시지 타입별 처리
        // switch (response.type) {
        //   case 'SCHEDULE_CREATED':
        //   case 'SCHEDULE_UPDATED':
        //   case 'SCHEDULE_DELETED':
        //     // 일정 변경시 캐시 무효화
        //     queryClient.invalidateQueries({
        //       queryKey: ['project-schedules', projectId],
        //     });
        //     break;
        // }
      });
    };

    client.activate();

    // cleanup 함수는 동기적이어야 함
    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [accessToken, projectId]);

  const createSchedule = useCallback(
    (eventData: any) => {
      if (!clientRef.current) {
        console.error('WebSocket이 연결되지 않았습니다');
        return;
      }

      clientRef.current.publish({
        destination: `/app/${projectId}/create`,
        headers: {
          Authorization: `Bearer ${accessToken}`, // 헤더에 토큰 추가
        },
        body: JSON.stringify({
          eventData: eventData,
        }),
      });
    },
    [projectId, accessToken]
  );

  return {
    client: clientRef.current,
    createSchedule,
  };
};
