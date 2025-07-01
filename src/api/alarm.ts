import api from '@/lib/config/axios';
import { Alarm } from '@/types/alarm';
import { ApiResponse } from '@/types/api/common';

// 전체 알람 조회
export const getAlarms = async (): Promise<Alarm[]> => {
  const res = await api.get<ApiResponse<Alarm[]>>('/notifications');
  return res.data.data;
};

// 프로젝트 초대 수락 및 거절
export const editInvite = async (notificationId: number, inviteStatus: string): Promise<void> => {
  await api.patch<ApiResponse<void>>(`/notifications/${notificationId}`, {
    invite_status: inviteStatus,
  });
};
