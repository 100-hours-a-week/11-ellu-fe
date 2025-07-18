import React from 'react';
import { Skeleton, Box } from '@mui/material';

export default function UserPieChartSkeleton() {
  return (
    <div style={{ paddingLeft: '70px', paddingRight: '70px', paddingTop: '0px', paddingBottom: '0px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Skeleton
          variant="circular"
          width={130}
          height={130}
          sx={{
            borderRadius: '50%',
            bgcolor: 'rgba(0, 0, 0, 0.1)',
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Skeleton variant="circular" width={12} height={12} />
          <Skeleton variant="text" width={40} height={16} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Skeleton variant="circular" width={12} height={12} />
          <Skeleton variant="text" width={40} height={16} />
        </Box>
      </Box>
    </div>
  );
}
