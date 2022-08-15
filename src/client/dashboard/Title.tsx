import React from 'react';
import Typography from '@mui/material/Typography';

// Renders the title of the dashboard.

interface TitleProps {
  children?: React.ReactNode;
}

const Title = (props: TitleProps) => {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
};

export default Title;
