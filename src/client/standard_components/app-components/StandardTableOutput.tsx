import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import React, { useMemo } from 'react';

/*
  Renders the a standard table output.

*/

type Props = {
  data: {
    rows: string[][];
  };
  tableId: string;
};

type Data = {
  [key: string]: string;
};

function createData(record: string[], columnNames: string[]): Data {
  const obj = {};
  record.forEach((value, index) => {
    obj[columnNames[index]] = value;
  });

  return obj;
}

const StandardTableOutput = ({ data, tableId }: Props) => {
  const columns = [];
  const columnNames = data.rows[0];
  columnNames.forEach(name => {
    columns.push({
      id: name,
      label: name,
      minWidth: 50,
      align: 'center',
    });
  });

  const rows = useMemo(() => {
    return data.rows
      .map((row: string[]) => {
        const record = row.map((n: string) => n);
        return createData(record, columnNames);
      })
      .filter((_row: Data, i) => i > 0);
  }, [data]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%' }}>
      <TableContainer sx={{ maxHeight: 800 }}>
        <Table id={tableId}>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 57, minWidth: column.minWidth, fontWeight: 'bold' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                  {columns.map(column => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default StandardTableOutput;
