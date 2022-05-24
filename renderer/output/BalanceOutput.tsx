import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import commands from '../commands';

const BalanceCommand = commands.find(n => n.value === 'Balance');

/*
  Renders the output of the Balance command.
*/

const styles = {
  table: {
    display: 'flex',
    marginTop: '100px',
    height: '20vh',
    marginRight: '80px',
    width: '50vw',
    backgroundColor: 'black',
    marginBottom: '20px',
  },
  cell: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '15px',
  },
};

type Data = {
  data: {
    balance: number;
    channel_balance: number;
  };
};

const BalanceOutput = ({ data }: Data) => {
  // const classes = styles();

  const createData = (balance: number, channelBalance: number) => {
    return { balance, channelBalance };
  };

  const rows = [createData(data.balance, data.channel_balance)];
  return (
    <TableContainer component={Paper} style={styles.table}>
      <Table sx={{ minWidth: 100 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={styles.cell}>Balance</TableCell>
            <TableCell style={styles.cell} align="right">
              Channel Balance
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={BalanceCommand.value} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell style={styles.cell}>{row.balance}</TableCell>
              <TableCell style={styles.cell} align="right">
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
