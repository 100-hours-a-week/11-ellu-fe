import api from '@/lib/config/axios';
import { ApiResponse } from '@/types/api/common';
import { MessageData } from '@/types/chatbot';
import { EventData } from '@/types/calendar';
import { convertToChatbotScheduleData } from '@/lib/utils/scheduleUtils';
import { ScheduleResponse } from '@/types/api/schedule';
import { ChatMessage, ChatHistoryResponse } from '@/types/api/chatbot';

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

// 챗봇 대화기록 조회
export const getChatMessage = async (): Promise<ChatMessage[]> => {
  const res = await api.get<ApiResponse<ChatHistoryResponse>>('/chat/history');
  return res.data.data.history;
};
