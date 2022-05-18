import React from 'react';
import { Box } from '@mui/material';

type Props = {
  children: React.PropsWithChildren<{ unknown }>['children'];
};

const CenterFlexBox = ({ children }: Props) => {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        background:
          'linear-gradient(200.96deg, #fedc2a -29.09%, #dd5789 51.77%, #7a2c9e 129.35%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </Box>
  );
};

export default CenterFlexBox;
