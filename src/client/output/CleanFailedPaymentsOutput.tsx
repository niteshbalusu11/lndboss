import React from 'react';

/*
  Renders the output of the CleanFailedPayments command.
*/

const styles = {
  div: {
    marginTop: '50px',
    marginLeft: '10px',
  },
  text: {
    fontSize: '15px',
    fontWeight: 'bold',
    display: 'inline-block',
  },
};

type Data = {
  data: {
    total_failed_payments_deleted?: number;
    total_failed_payments_found?: number;
  };
};

const CleanFailedPaymentsOutput = ({ data }: Data) => {
  return (
    <div style={styles.div}>
      {data.total_failed_payments_deleted === undefined && data.total_failed_payments_found === undefined ? (
        <h3>{'No Failed Payments Found/Deleted'}</h3>
      ) : null}

      {data.total_failed_payments_deleted !== undefined ? (
        <h3 id="paymentsdeleted">{`Total Failed Payments Deleted: ${data.total_failed_payments_deleted}`}</h3>
      ) : null}

      {data.total_failed_payments_found !== undefined ? (
        <h3 id="paymentsfound">{`Total Failed Payments Found: ${data.total_failed_payments_found}`}</h3>
      ) : null}
    </div>
  );
};

export default CleanFailedPaymentsOutput;
