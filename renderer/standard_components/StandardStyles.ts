import { createUseStyles } from 'react-jss';

const styles = createUseStyles({
  sx: {
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(200.96deg, #fedc2a -29.09%, #dd5789 51.77%, #7a2c9e 129.35%)',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'start',
    flexGrow: 1,
  },
});

const StandardStyles = styles();

export default StandardStyles;
