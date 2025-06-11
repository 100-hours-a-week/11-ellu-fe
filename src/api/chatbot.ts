import api from '@/lib/axios';
import { ApiResponse } from '@/types/api/common';
import { MessageData } from '@/types/chatbot';

// 메세지 전송
export const postMessage = async (messageData: MessageData): Promise<void> => {
  await api.post<ApiResponse<void>>('/chat/messages', messageData);
};
