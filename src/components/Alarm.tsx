import { useState } from 'react';
import { IconButton, Badge, Menu, MenuItem, Typography, Box, Divider } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsIcon from '@mui/icons-material/Notifications';
import style from './Alarm.module.css';

interface AlarmItem {
  id: number;
  message: string;
  time: string;
  isRead: boolean;
}

export default function Alarm() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [alarms] = useState<AlarmItem[]>([
    {
      id: 1,
      message: '새로운 프로젝트 초대가 있습니다',
      time: '5분 전',
      isRead: false,
    },
    {
      id: 2,
      message: '프로젝트 마감일이 3일 남았습니다',
      time: '1시간 전',
      isRead: false,
    },
    {
      id: 3,
      message: '새로운 댓글이 달렸습니다',
      time: '2시간 전',
      isRead: true,
    },
  ]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const unreadAlarms = alarms.filter((alarm) => !alarm.isRead);

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
              onClick={handleClose}
              sx={{
                py: 1.5,
                px: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                bgcolor: alarm.isRead ? 'inherit' : 'rgba(0, 0, 0, 0.04)',
              }}
            >
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {alarm.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {alarm.time}
              </Typography>
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
