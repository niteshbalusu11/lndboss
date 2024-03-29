import { ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';

import AssignmentIcon from '@mui/icons-material/Assignment';
import BalanceIcon from '@mui/icons-material/Balance';
import ComputerIcon from '@mui/icons-material/Computer';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MoneyIcon from '@mui/icons-material/Money';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import React from 'react';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { clientConstants } from '~client/utils/constants';
import moment from 'moment';
import { removeAuthenticatedCookie } from '~client/utils/cookie';
import { useNotify } from '~client/hooks/useNotify';

const monthToDateDifference = () => moment().diff(moment().startOf('month'), 'days') || 1;

// Displays the list of items in the sidebar

const handleLogout = () => {
  removeAuthenticatedCookie();
  useNotify({ type: 'info', message: 'Logged out successfully' });
};

export const MainListItems = ({ setAccounting }: { setAccounting: React.Dispatch<React.SetStateAction<number>> }) => {
  return (
    <React.Fragment>
      <ListItemButton onClick={() => setAccounting(0)} sx={{ marginTop: '70px' }}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>

      <ListItemButton href={clientConstants.authenticatePage}>
        <ListItemIcon>
          <VpnKeyIcon />
        </ListItemIcon>
        <ListItemText primary="Connect to LND" />
      </ListItemButton>

      <ListItemButton href={clientConstants.commandsPage}>
        <ListItemIcon>
          <ComputerIcon />
        </ListItemIcon>
        <ListItemText primary="Commands" />
      </ListItemButton>

      <ListItemButton href={clientConstants.userPreferencesUrl}>
        <ListItemIcon>
          <ManageAccountsIcon />
        </ListItemIcon>
        <ListItemText primary="Preferences" />
      </ListItemButton>

      <ListItemButton href={clientConstants.quickTools}>
        <ListItemIcon>
          <OfflineBoltIcon />
        </ListItemIcon>
        <ListItemText primary="Quick Actions" />
      </ListItemButton>

      <ListItemButton href={clientConstants.loginUrl} onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </React.Fragment>
  );
};

export const SecondaryListItems = ({
  setAccounting,
  setIsMonthToDate,
}: {
  setAccounting: React.Dispatch<React.SetStateAction<number>>;
  setIsMonthToDate: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const setMonthTodate = () => {
    setIsMonthToDate(true);
    setAccounting(monthToDateDifference());
  };
  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        Accounting
      </ListSubheader>

      <ListItemButton onClick={() => setAccounting(1)}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Last 24 hrs" />
      </ListItemButton>

      <ListItemButton onClick={() => setAccounting(7)}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Last 7 days" />
      </ListItemButton>

      <ListItemButton onClick={() => setAccounting(30)}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Last 30 days" />
      </ListItemButton>

      <ListItemButton onClick={setMonthTodate}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Month To Date" />
      </ListItemButton>
    </React.Fragment>
  );
};

export const QuickTools = () => {
  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        Automation Tools
      </ListSubheader>

      <ListItemButton href={clientConstants.feeStrategyPath}>
        <ListItemIcon>
          <MoneyIcon />
        </ListItemIcon>
        <ListItemText primary="Auto Fees" />
      </ListItemButton>

      <ListItemButton href={clientConstants.rebalanceUrl}>
        <ListItemIcon>
          <BalanceIcon />
        </ListItemIcon>
        <ListItemText primary="Auto Rebalancing" />
      </ListItemButton>
    </React.Fragment>
  );
};
