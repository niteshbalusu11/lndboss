import { Box } from '@mui/material';
import React from 'react';

/*
  children: Renders the children passed into the start flex box.
  This flexbox is used for command forms that align to the left.
*/

type Props = {
  children: React.PropsWithChildren<{ unknown }>['children'];
};

const StartFlexBoxBlack = ({ children }: Props) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        background: 'black',
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

export default StartFlexBoxBlack;
