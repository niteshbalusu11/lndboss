import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';
import TextField from '@mui/material/TextField';
import moment from 'moment';

// Renders a date picker

type Args = {
  id: string;
  label: string;
  setValue: (value: string) => void;
  value: string;
};
const BasicDatePicker = ({ id, label, setValue, value }: Args) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        key={id}
        label={label}
        value={value || null}
        onChange={newValue => {
          !!newValue ? setValue(moment(newValue).format('YYYY-MM-DD')) : setValue(null);
        }}
        renderInput={params => <TextField {...params} />}
        inputFormat="yyyy-MM-dd"
      />
    </LocalizationProvider>
  );
};

export default BasicDatePicker;
