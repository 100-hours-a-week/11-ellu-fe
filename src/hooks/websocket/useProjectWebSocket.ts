// src/hooks/useWebSocket.ts
import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { userStore } from '@/stores/userStore';
import { createWebSocketClient } from '@/lib/websocket';
import { Client } from '@stomp/stompjs';
import { EventData } from '@/types/calendar';
import { convertToScheduleData } from '@/utils/scheduleUtils';
import { useRouter } from 'next/navigation';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useProjectWebSocket = (projectId: number) => {
  const router = useRouter();
  const clientRef = useRef<Client | null>(null);
  const queryClient = useQueryClient();
  const { accessToken } = userStore();

  useEffect(() => {
    if (!accessToken || !projectId) return;

    // 웹소켓 연결
    const client = createWebSocketClient(accessToken);

    client.onConnect = () => {
      console.log('웹소켓 연결 성공');
      clientRef.current = client;

      client.subscribe(`/topic/${projectId}`, (message) => {
        const response = JSON.parse(message.body);

        // 메시지 타입별 처리
        switch (response.type) {
          case 'SCHEDULE_CREATED':
          case 'SCHEDULE_UPDATED':
          case 'SCHEDULE_DELETED':
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.schedules.projectDaily(projectId),
            });
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.schedules.projectMonthly(projectId),
            });
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.schedules.projectYearly(projectId),
            });
            break;
        }
      });
    };

    client.activate();

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [accessToken, projectId]);

  // 일정 생성
  const createSchedule = useCallback(
    (
      eventDataList: EventData[],
      options: {
        is_project_schedule?: boolean;
        is_ai_recommended?: boolean;
        is_completed?: boolean;
      } = {}
    ) => {
      if (!clientRef.current) {
        console.error('WebSocket이 연결되지 않았습니다');
        return;
      }

      const scheduleData = eventDataList.map((eventData) => convertToScheduleData(eventData, options));

      try {
        clientRef.current.publish({
          destination: `/app/${projectId}/create`,
          body: JSON.stringify({
            project_schedules: scheduleData,
          }),
        });
      } catch (error) {
        console.error('일정 생성 실패:', error);
      }
    },
    [projectId]
  );

  // 일정 업데이트
  const updateSchedule = useCallback(
    (scheduleData: EventData, scheduleId: number) => {
      if (!clientRef.current) {
        console.error('WebSocket이 연결되지 않았습니다');
        return;
      }

      const editscheduleData = convertToScheduleData(scheduleData, { is_project_schedule: true });

      try {
        clientRef.current.publish({
          destination: `/app/${projectId}/update`,
          body: JSON.stringify({
            ...editscheduleData,
            schedule_id: scheduleId,
          }),
        });
        router.push(`/projects/${projectId}`);
      } catch (error) {
        console.error('일정 수정 실패:', error);
      }
    },
    [projectId]
  );

  // 일정 삭제
  const deleteSchedule = useCallback(
    (scheduleId: number) => {
      if (!clientRef.current) {
        console.error('WebSocket이 연결되지 않았습니다');
        return;
      }
      try {
        clientRef.current.publish({
          destination: `/app/${projectId}/delete`,
          body: JSON.stringify({
            schedule_id: scheduleId,
          }),
        });
      } catch (error) {
        console.error('일정 삭제 실패:', error);
      }
    },
    [projectId]
  );

  // 일정 분배
  const takeSchedule = useCallback(
    (scheduleId: number) => {
      if (!clientRef.current) {
        console.error('WebSocket이 연결되지 않았습니다');
        return;
      }
      try {
        clientRef.current.publish({
          destination: `/app/${projectId}/take`,
          body: JSON.stringify({
            schedule_id: scheduleId,
          }),
        });
      } catch (error) {
        console.error('일정 가져가기 실패:', error);
      }
    },
    [projectId]
  );

  return {
    client: clientRef.current,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    takeSchedule,
  };
};
