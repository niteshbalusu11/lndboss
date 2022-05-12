import { CssBaseline, Stack } from "@mui/material";
import { createUseStyles } from "react-jss";
import { useRouter } from "next/router";
import React from "react";
import StartFlexBox from "../../standard_components/StartFlexBox";
import StandardButtonLink from "../../standard_components/StandardButtonLink";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const styles = createUseStyles({
  table: {
    display: "flex",
    marginTop: "200px",
    height: "20vh",
    marginRight: "80px",
    width: "50vw",
    backgroundColor: "black",
  },
  cell: {
    color: "white",
    fontWeight: "bold",
    fontSize: "15px",
  },
});

const BalanceOutput = () => {
  const classes = styles();
  const router = useRouter();
  console.log(router.query.data);
  const data = JSON.parse(router.query.data.toString());

  const createData = (balance: number, channelBalance: number) => {
    return { balance, channelBalance };
  };

  const rows = [createData(data.result.balance, data.result.channel_balance)];
  return (
    <CssBaseline>
      <StartFlexBox>
        <StandardButtonLink label="Balance" destination="/Balance" />
        <StandardButtonLink label="Home" destination="/home" />
        <TableContainer component={Paper} className={classes.table}>
          <Table sx={{ minWidth: 100 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.cell}>Balance</TableCell>
                <TableCell className={classes.cell} align="right">
                  Channel Balance
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.balance}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell className={classes.cell}>{row.balance}</TableCell>
                  <TableCell className={classes.cell} align="right">
                    {row.channelBalance}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default BalanceOutput;
