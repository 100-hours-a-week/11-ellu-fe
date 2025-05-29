// src/components/skeleton/ScheduleDetailModalSkeleton.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Skeleton, Box } from '@mui/material';
import { ScheduleModalSkeletonProps } from '@/types/calendar';

export default function ScheduleDetailModalSkeleton({ open }: ScheduleModalSkeletonProps) {
  if (!open) return null;

  return (
    <Dialog open={open} onClose={() => {}} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          p: 2,
        }}
      >
        {/* 일정 제목 */}
        <Skeleton variant="text" width="70%" height={28} sx={{ fontSize: '1.25rem', fontWeight: 'bold' }} />

        {/* 오른쪽 아이콘 버튼들 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="circular" width={24} height={24} />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        {/* 날짜/시간 정보 */}
        <Skeleton variant="text" width="90%" height={20} sx={{ mb: 3, color: 'text.secondary' }} />

        {/* 상세일정 섹션 (조건부로 표시되는 부분) */}
        <Box sx={{ mt: 3 }}>
          <Skeleton variant="text" width="30%" height={16} sx={{ mb: 1, color: 'text.secondary' }} />

          {/* 상세일정 내용 (여러 줄) */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Skeleton variant="text" width="95%" height={16} />
            <Skeleton variant="text" width="80%" height={16} />
            <Skeleton variant="text" width="60%" height={16} />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 1 }}>
        <Skeleton variant="rectangular" width={60} height={32} sx={{ borderRadius: 1 }} />
      </DialogActions>
    </Dialog>
  );
}
