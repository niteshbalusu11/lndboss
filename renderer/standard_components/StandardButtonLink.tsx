import { Button, ButtonProps, styled } from '@mui/material';
import { purple } from '@mui/material/colors';
import Link from 'next/link';
import React from 'react';
import { createUseStyles } from 'react-jss';

/* Renders the standard link button
  {
    [buttonStyle]: <Button Style>
    destination: <Button Destination String>
    label: <Button Label String>
  }

*/

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  '&:hover': {
    backgroundColor: purple[700],
  },
}));

const styles = createUseStyles({
  button: {
    fontSize: '12px',
    margin: '0px',
    cursor: 'pointer',
    marginTop: '20px',
    marginLeft: '20px',
    height: '30px',
    fontWeight: 'bold',
  },
});

type Props = {
  label: string;
  destination: string;
  buttonStyle?: any;
};

const StandardButtonLink = ({ buttonStyle, destination, label }: Props) => {
  const classes = styles();
  return (
    <Link href={destination}>
      <ColorButton className={!!buttonStyle ? buttonStyle : classes.button} variant="contained" id={label}>
        {label}
      </ColorButton>
    </Link>
  );
};
export default StandardButtonLink;
