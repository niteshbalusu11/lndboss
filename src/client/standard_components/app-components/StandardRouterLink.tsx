import Link from 'next/link';
import React from 'react';

/*
  {
    label: <Link Label String>
    destination: <Link Destination String>
  }
  Returns the standard link
*/

const styles = {
  link: {
    fontSize: '20px',
    margin: '0px',
    cursor: 'pointer',
    color: 'white',
  },
};

type Props = {
  label: string;
  destination: string;
};

const StandardRouterLink = ({ label, destination }: Props) => {
  return (
    <Link href={destination} id={label} style={styles.link}>
      {label}
    </Link>
  );
};
export default StandardRouterLink;
