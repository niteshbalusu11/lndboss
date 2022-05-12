import React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import StandardRouterLink from "./StandardRouterLink";

type Props = {
  gridArray: {
    name: string;
    value: string;
    description: string;
  }[];
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: "130px",
  borderRadius: "30px",
  marginRight: "10px",
}));

const ResponsiveGrid = ({ gridArray }: Props) => {
  return (
    <>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        height="600px"
        alignItems="center"
        justifyContent="center"
        marginRight="50px"
      >
        {gridArray.map((grid) => (
          <Grid item xs={2} sm={3} md={4} key={grid.value}>
            <Item>
              <StandardRouterLink
                label={grid.name}
                destination={`/${grid.value}`}
              />
              <p>{grid.description}</p>
            </Item>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ResponsiveGrid;
