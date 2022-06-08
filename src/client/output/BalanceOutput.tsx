import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

import React from 'react';

/*
  Renders the output of the Balance command.
*/

const styles = {
  table: {
    display: 'flex',
    marginTop: '100px',
    minHeight: '20vh',
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
    Balance?: number;
    ChannelBalance?: number;
    ClosingBalance: string;
    ConflictedPending: string;
    InvalidPending: string;
    OffchainBalance: string;
    OffchainPending: string;
    OnchainBalance: string;
  };
};

type CreateData = {
  [key: string]: string;
};

const BalanceOutput = ({ data }: Data) => {
  const rows = [];
  const keys = [];

  const createData = (key: CreateData, value: CreateData) => {
    return { key: key.key, value: value.value };
  };

  for (const [key, value] of Object.entries(data)) {
    rows.push(createData({ key: String(key) }, { value: String(value) }));
    keys.push(key);
  }

  return (
    <TableContainer component={Paper} style={styles.table}>
      <Table aria-label="simple table">
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell style={styles.cell} align="center">
                {row.key}
              </TableCell>
              <TableCell style={styles.cell} align="center">
                {row.value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BalanceOutput;
