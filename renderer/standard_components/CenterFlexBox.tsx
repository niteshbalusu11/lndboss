import React from 'react';
import { Box } from '@mui/material';

/*
  children: Renders the children passed into the center flex box.
*/

type Props = {
  children: React.PropsWithChildren<{ unknown: any }>['children'];
};

const CenterFlexBox = ({ children }: Props) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        minWidth: '50vw',
        background: 'linear-gradient(200.96deg, #fedc2a -29.09%, #dd5789 51.77%, #7a2c9e 129.35%)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {children}
    </Box>
  );
};

export default CenterFlexBox;
