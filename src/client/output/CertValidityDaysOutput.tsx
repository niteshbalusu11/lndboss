import React from 'react';

// Render the output of the CertValidityDays command.

const styles = {
  div: {
    marginTop: '100px',
    marginLeft: '10px',
  },
  text: {
    fontSize: '15px',
    fontWeight: 'bold',
  },
};

type Data = {
  data: string;
};

const CertValidityDaysOutput = ({ data }: Data) => {
  return (
    <div style={styles.div}>
      <h3>Remaining number of days of certificate validity: {data}</h3>
    </div>
  );
};

export default CertValidityDaysOutput;
