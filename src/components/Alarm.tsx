'use client';

import { useEffect, useState } from 'react';
import { IconButton, Badge, Menu, MenuItem, Typography, Box, Divider, Button } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAlarmStore } from '@/stores/alarmStore';
import { useEditInvite } from '@/hooks/api/alarm/useEditInvite';
import style from './Alarm.module.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');

export default function Alarm() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { alarms, markAllAsRead, loadInitialAlarms, isLoading } = useAlarmStore();
  const editInviteMutation = useEditInvite();

  const unreadAlarms = alarms.filter((alarm) => !alarm.isRead);

  useEffect(() => {
    loadInitialAlarms();
  }, [loadInitialAlarms]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    markAllAsRead();
  };

  const handleAccept = (e: React.MouseEvent<HTMLButtonElement>, notificationId: number) => {
    e.stopPropagation();
    editInviteMutation.mutate({ notificationId, inviteStatus: 'ACCEPTED' });
  };

  const handleReject = (e: React.MouseEvent<HTMLButtonElement>, notificationId: number) => {
    e.stopPropagation();
    editInviteMutation.mutate({ notificationId, inviteStatus: 'REJECTED' });
  };

  return (
    <>
      <IconButton onClick={handleClick} className={style.alarmIcon}>
        <Badge color="error" variant="dot" invisible={unreadAlarms.length === 0}>
          {unreadAlarms.length > 0 ? <NotificationsActiveIcon /> : <NotificationsIcon />}
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              minWidth: 320,
              mt: 0.5,
              maxHeight: 400,
            },
          },
        }}
      >
        <Box className={style.alarmHeader}>알림</Box>
        <Divider />
        {alarms.length > 0 ? (
          alarms.map((alarm) => (
            <MenuItem
              key={alarm.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              {alarm.type === 'PROJECT_INVITED' ? (
                <Box className={style.alarmMessage}>
                  <Box className={style.messageContainer}>
                    <Box className={style.messageContent}>
                      <div className={`${style.alarmMessageText} ${!alarm.isRead ? style.unreadMessage : ''}`}>
                        {!alarm.isRead && <div className={style.unreadDot} />}
                        {alarm.message}
                      </div>
                      <Box className={style.buttonContainer}>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={(e) => handleAccept(e, alarm.id)}
                        >
                          수락
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={(e) => handleReject(e, alarm.id)}
                        >
                          거절
                        </Button>
                      </Box>
                    </Box>
                    <div className={style.timeText}>{dayjs(alarm.created_at).fromNow()}</div>
                  </Box>
                </Box>
              ) : (
                <Box className={style.messageContainer}>
                  <div className={`${style.alarmMessageText} ${!alarm.isRead ? style.unreadMessage : ''}`}>
                    {!alarm.isRead && <div className={style.unreadDot} />}
                    {alarm.message}
                  </div>
                  <div className={style.timeText}>{dayjs(alarm.created_at).fromNow()}</div>
                </Box>
              )}
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={handleClose}>
            <Typography variant="body2">새로운 알림이 없습니다</Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
