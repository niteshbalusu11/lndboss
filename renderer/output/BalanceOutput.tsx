import { createUseStyles } from 'react-jss';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const styles = createUseStyles({
  table: {
    display: 'flex',
    marginTop: '200px',
    height: '20vh',
    marginRight: '80px',
    width: '50vw',
    backgroundColor: 'black',
  },
  cell: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '15px',
  },
});

type Data = {
  data: {
    balance: number;
    channel_balance: number;
  };
};

const BalanceOutput = ({ data }: Data) => {
  const classes = styles();

  const createData = (balance: number, channelBalance: number) => {
    return { balance, channelBalance };
  };

  const rows = [createData(data.balance, data.channel_balance)];
  return (
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
          {rows.map(row => (
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
  );
};

export default BalanceOutput;
