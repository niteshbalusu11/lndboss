import { Box } from '@mui/material';
import React from 'react';

/*
  children: Renders the children passed into the start flex box.
  This flexbox is used for command forms that align to the left.
*/

type Props = {
  children: React.PropsWithChildren<{ unknown }>['children'];
};

const StartFlexBox = ({ children }: Props) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        background: 'linear-gradient(200.96deg, #fedc2a -29.09%, #dd5789 51.77%, #7a2c9e 129.35%)',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'start',
        paddingBottom: '30px',
      }}
    >
      {children}
    </Box>
  );
};

export default StartFlexBox;
