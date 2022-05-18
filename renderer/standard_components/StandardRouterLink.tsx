import React from 'react';
import { createUseStyles } from 'react-jss';
import Link from 'next/link';
import { Link as MULink } from '@mui/material';

const styles = createUseStyles({
  link: {
    fontSize: '20px',
    margin: '0px',
    cursor: 'pointer',
    color: 'black',
  },
});

type Props = {
  label: string;
  destination: string;
};

const StandardRouterLink = ({ label, destination }: Props) => {
  const classes = styles();
  return (
    <Link href={destination}>
      <MULink className={classes.link} underline="hover">
        {label}
      </MULink>
    </Link>
  );
};
export default StandardRouterLink;
