import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import React from 'react';

/*
  Renders the output of the Tags command
*/

type Props = {
  result: [];
};

const styles = {
  table: {
    display: 'flex',
    marginTop: '100px',
    backgroundColor: 'black',
    marginBottom: '20px',
  },
  cell: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '15px',
  },
};

function createData(alias: string, id: number, nodes: string) {
  return { alias, id, nodes };
}

type Data = {
  alias: string;
  id: number;
  nodes: string[];
};

const TagsOutput = ({ result }: Props) => {
  const rows = result.map((n: Data) => createData(n.alias, n.id, n.nodes.join('\n')));
  return (
    <TableContainer component={Paper} style={styles.table}>
      <Table sx={{ minWidth: 100 }} aria-label="simple table" id="tags">
        <TableHead>
          <TableRow>
            <TableCell align="center" style={styles.cell}>
              Alias
            </TableCell>
            <TableCell align="center" style={styles.cell}>
              ID
            </TableCell>
            <TableCell align="center" style={styles.cell}>
              Nodes
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell style={styles.cell}>{row.alias}</TableCell>
              <TableCell align="right" style={styles.cell}>
                {row.id}
              </TableCell>
              <TableCell align="right" style={styles.cell}>
                {row.nodes}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TagsOutput;
