export const clientConstants = {
  authenticatePage: '/Authenticate',
  commandsPage: '/Commands',
  dashboardPage: '/Dashboard',
  homeButtonLabel: 'Home',
  loginUrl: '/auth/Login',
  publicPaths: ['/', '/auth/Login', '/auth/Register'],
  rebalanceSchedulerUrl: '/schedulers/RebalanceScheduler',
  registerUrl: '/auth/Register',
  userPreferencesUrl: '/preferences/UserPreferences',
};

export const defaultChartQueryDays = 7;

export const selectedSavedNode = () => {
  if (!!localStorage.getItem('SELECTED_SAVED_NODE') && localStorage.getItem('SELECTED_SAVED_NODE') !== 'undefined') {
    return localStorage.getItem('SELECTED_SAVED_NODE');
  }

  return '';
};

// Parse Ansi escape sequences
export const removeStyling = o =>
  JSON.parse(
    JSON.stringify(o, (k, v) =>
      typeof v === 'string'
        ? v.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
        : v === undefined
        ? undefined
        : v
    )
  );

// Donation LNURL
export const donationLnurl =
  'LNURL1DP68GURN8GHJ7MRW9E6XJURN9UH8WETVDSKKKMN0WAHZ7MRWW4EXCUP0X9UR2VRYX4NRWCFNVVMKYCMXXCURQGXD649';

// Donation Lightning Address
export const donationLnaddress = '0x49f4f513b6752c95@ln.tips';

// Convert sats to btc
export const tokensAsBigTokens = (tokens: number) => (!!tokens ? (tokens / 1e8).toFixed(8) : 0);
