import api from '@/lib/axios';
import { ApiResponse } from '@/types/api/common';
import { MessageData } from '@/types/chatbot';
import { EventData } from '@/types/calendar';
import { convertToChatbotScheduleData } from '@/utils/scheduleUtils';
import { ScheduleResponse } from '@/types/api/schedule';

// 메세지 전송
export const postMessage = async (messageData: MessageData): Promise<void> => {
  await api.post<ApiResponse<void>>('/chat/messages', messageData);
};

// 챗봇추천 일정 생성
export const chatbotCreateSchedule = async (planTitle: string, eventDataList: EventData[]): Promise<void> => {
  const scheduleDataList = eventDataList.map((eventData) => convertToChatbotScheduleData(eventData));
  await api.post<ApiResponse<ScheduleResponse>>('/user/schedules/plan', {
    plan_title: planTitle,
    chatbot_schedules: scheduleDataList,
  });
};
