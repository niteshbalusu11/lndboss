import { Switch, alpha, styled } from '@mui/material';
import { blue, green } from '@mui/material/colors';

/*
  Renders the standard ios style switch used in command forms.
*/

const StandardSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: blue[600],
    '&:hover': {
      backgroundColor: alpha(green[500], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: green[500],
  },
}));

export default StandardSwitch;
