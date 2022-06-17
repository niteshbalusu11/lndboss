import { AccountingOutput, AccountingOutputSummary } from '../../output';
import { CssBaseline, Stack } from '@mui/material';

import Head from 'next/head';
import React from 'react';
import { StartFlexBox } from '../../standard_components';
import { axiosGet } from '~client/utils/axios';
import { useRouter } from 'next/router';

/*
  Renders the bos accounting command output in chart format.
  IPC to the main process to get chain-fees data.
*/

const styles = {
  form: {
    marginLeft: '50px',
    marginRight: '50px',
    marginTop: '50px',
    minWidth: '700px',
  },
};

const AccountingResult = () => {
  const router = useRouter();

  const query = {
    category: router.query.category,
    is_csv: router.query.is_csv,
    is_fiat_disabled: router.query.is_fiat_disabled,
    month: router.query.month,
    node: router.query.node,
    rate_provider: router.query.rate_provider,
    year: router.query.year,
  };

  const [data, setData] = React.useState({ rows: [] });
  const [summary, setSummary] = React.useState({ rows: [] });
  const [dataInCSV, setDataInCSV] = React.useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axiosGet({ path: 'accounting', query });

      if (!!result && query.is_csv === 'true') {
        setDataInCSV(result);
      }

      if (!!result && query.is_csv !== 'true') {
        setData({ rows: result.rows });
        setSummary({ rows: result.rows_summary });
      }
    };

    fetchData();
  }, []);

  return (
    <CssBaseline>
      <Head>
        <title>Accounting Result</title>
      </Head>
      <StartFlexBox>
        <Stack spacing={3} style={styles.form}>
          {!!dataInCSV || !!summary.rows.length ? (
            <>
              <div>
                {!!dataInCSV && query.is_csv === 'true' && (
                  <a href={`data:text/csv;charset=utf-8,${dataInCSV}`} download={`${query.category}.csv`}>
                    Results are ready, click here to download
                  </a>
                )}
              </div>
              {query.is_csv !== 'true' && !!summary.rows.length && (
                <>
                  <h3>{`Accounting ${query.category} summary`}</h3>
                  <AccountingOutputSummary data={summary} />
                </>
              )}
              {query.is_csv !== 'true' && !!data.rows.length && (
                <>
                  <h3>{`Accounting ${query.category} summary`}</h3>
                  <AccountingOutput data={data} />
                </>
              )}
            </>
          ) : (
            <h2>Loading...</h2>
          )}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default AccountingResult;
