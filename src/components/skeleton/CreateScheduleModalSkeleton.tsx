import React from 'react';
import { Modal, Box, Skeleton } from '@mui/material';
import { ScheduleModalSkeletonProps } from '@/types/calendar';

export default function CreateScheduleModalSkeleton({ open }: ScheduleModalSkeletonProps) {
  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={() => {}}
      sx={{
        '& .MuiBox-root': {
          outline: 'none',
          border: 'none',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Skeleton variant="text" width="40%" height={32} sx={{ mb: 3, fontSize: '1.5rem' }} />

        <Skeleton variant="text" width="25%" height={20} sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Skeleton variant="rectangular" width="48%" height={56} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width="48%" height={56} sx={{ borderRadius: 1 }} />
        </Box>

        <Skeleton variant="text" width="25%" height={20} sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Skeleton variant="rectangular" width="48%" height={56} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width="48%" height={56} sx={{ borderRadius: 1 }} />
        </Box>

        <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2, borderRadius: 1 }} />

        <Skeleton variant="rectangular" width="100%" height={100} sx={{ mb: 3, borderRadius: 1 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Skeleton variant="rectangular" width={60} height={36} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={60} height={36} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>
    </Modal>
  );
}
