import { Box } from '@mui/material';
import React from 'react';

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
      }}
    >
      {children}
    </Box>
  );
};

export default CenterFlexBox;
