import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import React from 'react';
import StandardRouterLink from './StandardRouterLink';
import { experimentalStyled as styled } from '@mui/material/styles';

/*
  Renders the grid of commands on the home page.
*/

type Props = {
  gridArray: {
    name: string;
    value: string;
    description: string;
  }[];
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#042b57',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: 'white',
  height: '130px',
  borderRadius: '30px',
  marginRight: '10px',
}));

const ResponsiveGrid = ({ gridArray }: Props) => {
  return (
    <Grid
      container
      spacing={{ xs: 2, sm: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
      minHeight="100px"
      alignItems="center"
      marginRight="50px"
      paddingTop="70px"
      paddingBottom="40px"
    >
      {gridArray.map(grid => (
        <Grid item xs={2} sm={3} md={4} key={grid.value}>
          <Item>
            <StandardRouterLink label={grid.name} destination={`/commands/${grid.value}`} />
            <p>{grid.description}</p>
          </Item>
        </Grid>
      ))}
    </Grid>
  );
};

export default ResponsiveGrid;
