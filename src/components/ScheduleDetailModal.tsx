import React from 'react';
import Link from 'next/link';
import { EditScheduleModalProps } from '../types/calendar';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ScheduleDetailModal({ open, onClose, eventData, onDelete, projectId }: EditScheduleModalProps) {
  if (!eventData) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        {eventData.title}
        <Box>
          <Link href={projectId ? `/projects/${projectId}/schedule/edit/${eventData.id}` : `/my-calendar/schedule/edit/${eventData.id}`}>
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
              <Typography variant="body1">{eventData.description}</Typography>
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
