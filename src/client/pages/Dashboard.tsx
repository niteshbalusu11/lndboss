import MainDashboard from '~client/dashboard/MainDashboard';

export default function Dashboard() {
  return <MainDashboard />;
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
