export const clientConstants = {
  authenticatePage: '/Authenticate',
  commandsPage: '/Commands',
  dashboardPage: '/Dashboard',
  homeButtonLabel: 'Home',
  loginUrl: '/auth/Login',
  publicPaths: ['/', '/auth/Login', '/auth/Register'],
  rebalanceSchedulerUrl: '/schedulers/RebalanceScheduler',
  registerUrl: '/auth/Register',
};

export const selectedSavedNode = () => {
  if (!!localStorage.getItem('SELECTED_SAVED_NODE') && localStorage.getItem('SELECTED_SAVED_NODE') !== 'undefined') {
    return localStorage.getItem('SELECTED_SAVED_NODE');
  }

  return '';
};
