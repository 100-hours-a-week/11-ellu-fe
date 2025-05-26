// src/components/CalendarSkeleton.tsx
import React from 'react';
import { Skeleton, Box } from '@mui/material';
import styles from './CalendarSkeleton.module.css';

export default function CalendarSkeleton() {
  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Box className={styles.buttonGroup}>
          <Skeleton variant="rectangular" width={40} height={36} className={styles.button} />
          <Skeleton variant="rectangular" width={40} height={36} className={styles.button} />
          <Skeleton variant="rectangular" width={60} height={36} className={styles.button} />
        </Box>

        <Skeleton variant="text" width={250} height={40} className={styles.title} />

        <Box className={styles.buttonGroup}>
          <Skeleton variant="rectangular" width={50} height={36} className={styles.button} />
          <Skeleton variant="rectangular" width={50} height={36} className={styles.button} />
          <Skeleton variant="rectangular" width={70} height={36} className={styles.button} />
          <Skeleton variant="rectangular" width={90} height={36} className={styles.button} />
        </Box>
      </Box>

      <Box className={styles.calendar}>
        <Box className={styles.weekHeader}>
          <Box className={styles.timeColumnHeader} />

          {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
            <Box key={day} className={`${styles.dayHeader} ${index < 6 ? styles.timeSlot : ''}`}>
              <Skeleton variant="text" width={20} height={16} />
              <Skeleton variant="text" width={30} height={20} />
            </Box>
          ))}
        </Box>

        <Box className={styles.timeSlots}>
          {Array.from({ length: 15 }, (_, hourIndex) => (
            <Box key={hourIndex} className={styles.timeRow}>
              <Box className={styles.timeLabel}>
                <Skeleton variant="text" width={45} height={16} sx={{ fontSize: '0.875rem' }} />
              </Box>

              {Array.from({ length: 7 }, (_, dayIndex) => (
                <Box key={dayIndex} className={`${styles.timeSlot} ${dayIndex < 6 ? styles.timeSlot : ''}`}>
                  {Math.random() > 0.7 && (
                    <Skeleton
                      variant="rectangular"
                      width="95%"
                      height={Math.random() > 0.5 ? '60px' : '40px'}
                      className={styles.event}
                      sx={{
                        backgroundColor: `rgba(${Math.random() > 0.5 ? '82, 138, 211' : '255, 193, 7'}, 0.15)`,
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      <Box className={styles.shimmer} />
    </Box>
  );
}
