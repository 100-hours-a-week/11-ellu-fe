'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { EditScheduleModalProps } from '../types/calendar';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

import { userStore } from '@/stores/userStore';

import { useUpdateSchedule } from '@/hooks/api/schedule/useUpdateSchedule';
import { useUpdateProjectSchedule } from '@/hooks/api/schedule/project/useUpdateProjectSchedule';

export default function ScheduleDetailModal({
  open,
  onClose,
  eventData,
  onDelete,
  projectId,
  takeSchedule,
}: EditScheduleModalProps) {
  const { mutate: updateSchedule } = useUpdateSchedule();
  const { mutate: updateProjectSchedule } = useUpdateProjectSchedule();

  const { user } = userStore();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  let scheduleId: number | undefined;

  if (!eventData) {
    return null;
  }

  if (eventData.id) {
    const parts = eventData.id.split('-');
    scheduleId = parseInt(parts[parts.length - 1]);
  }

  const handleComplete = () => {
    if (!eventData) return;

    if (!projectId) {
      updateSchedule({
        scheduleId: scheduleId as number,
        eventData: eventData,
        options: { is_completed: eventData.is_completed ? false : true },
      });
    }

    onClose();
  };

  const handleTakeSchedule = () => {
    if (!eventData) return;
    takeSchedule(scheduleId as number);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 2 }}>
        <Typography
          variant="body1"
          sx={{ flex: 1, mr: 2, wordBreak: 'break-word', fontSize: '1.25rem', fontWeight: 'bold' }}
        >
          {eventData.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {!eventData.id?.includes('project') ? (
            <IconButton onClick={handleComplete} size="small" sx={{ mr: 1 }}>
              {eventData.is_completed ? <CheckCircleIcon color="success" /> : <CheckCircleOutlineIcon />}
            </IconButton>
          ) : (
            <Tooltip
              title="내 일정으로 가져가기"
              placement="bottom"
              arrow
              slotProps={{
                popper: {
                  sx: {
                    [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]: {
                      marginTop: '4px',
                    },
                  },
                },
              }}
            >
              <IconButton onClick={handleTakeSchedule} size="small" sx={{ mr: 1 }}>
                {eventData.assignees?.includes(user?.nickname as string) ? <AssignmentIcon /> : <AssignmentAddIcon />}
              </IconButton>
            </Tooltip>
          )}
          <Link
            href={
              projectId
                ? `/projects/${projectId}/schedule/edit/${eventData.id}`
                : `/my-calendar/schedule/edit/${eventData.id}`
            }
          >
            <IconButton size="small" sx={{ mr: 1 }}>
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onDelete} size="small">
            <DeleteIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {formatDate(eventData.start)} ~ {formatDate(eventData.end)}
          </Typography>

          {eventData.description && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                상세일정
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '13px' }}>
                {eventData.description}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 1 }}>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
}
