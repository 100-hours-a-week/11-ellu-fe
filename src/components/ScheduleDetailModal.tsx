'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { EditScheduleModalProps } from '../types/calendar';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import styles from './ScheduleDetailModal.module.css';

import { userStore } from '@/stores/userStore';

import { useUpdateSchedule } from '@/hooks/api/schedule/useUpdateSchedule';
import { useUpdateProjectSchedule } from '@/hooks/api/schedule/project/useUpdateProjectSchedule';
import { Assignee } from '@/types/calendar';

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

    onClose();
  };

  console.log(eventData.assignees);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        <Typography className={styles.title}>{eventData.title}</Typography>
        <AvatarGroup
          max={9}
          spacing="small"
          sx={{
            '& .MuiAvatarGroup-avatar': {
              width: 28,
              height: 28,
              fontSize: '0.75rem',
            },
          }}
        >
          {eventData.assignees?.map((assignee: Assignee) => (
            <Tooltip
              title={assignee.nickname}
              key={assignee.nickname}
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
              <Avatar alt={assignee.nickname} src={assignee.profile_image_url} sx={{ bgcolor: 'gray' }} />
            </Tooltip>
          ))}
        </AvatarGroup>
        <Box className={styles.actionButtons}>
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
              <IconButton size="small">
                {eventData.assignees?.some((assignee) => assignee.nickname === user?.nickname) ? null : (
                  <AssignmentAddIcon onClick={handleTakeSchedule} />
                )}
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
            <IconButton size="small">
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
