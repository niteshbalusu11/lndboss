import { NextRouter } from 'next/router';
import { RouteGuard } from '~client/standard_components/app-components';

// First page that gets rendered before every page.

type Props = {
  Component: React.ComponentType;
  pageProps: any;
  router: NextRouter;
};

const App = ({ Component, pageProps, router }: Props) => {
  return (
    <RouteGuard router={router}>
      <Component {...pageProps} />
    </RouteGuard>
  );
};

export default App;
