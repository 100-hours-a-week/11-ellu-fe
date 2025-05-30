'use client';

import { useEffect, useState } from 'react';
import { IconButton, Badge, Menu, MenuItem, Typography, Box, Divider, Button } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAlarmStore } from '@/stores/alarmStore';
import style from './Alarm.module.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');

export default function Alarm() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { alarms, markAllAsRead } = useAlarmStore();

  const unreadAlarms = alarms.filter((alarm) => !alarm.isRead);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    markAllAsRead();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccept = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log('수락');
  };

  const handleReject = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log('거절');
  };

  useEffect(() => {
    console.log(alarms);
  }, [alarms]);

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
          alarms.map((alarm, index) => (
            <MenuItem
              key={index}
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
                      <div className={style.alarmMessageText}>{alarm.message}</div>
                      <Box className={style.buttonContainer}>
                        <Button variant="contained" size="small" color="primary" onClick={handleAccept}>
                          수락
                        </Button>
                        <Button variant="outlined" size="small" color="error" onClick={handleReject}>
                          거절
                        </Button>
                      </Box>
                    </Box>
                    <div className={style.timeText}>{dayjs(alarm.time).fromNow()}</div>
                  </Box>
                </Box>
              ) : (
                <Box className={style.messageContainer}>
                  <div className={style.alarmMessageText}>{alarm.message}</div>
                  <div className={style.timeText}>{dayjs(alarm.time).fromNow()}</div>
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
