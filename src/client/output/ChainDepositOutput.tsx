import QRCode from 'react-qr-code';
import React from 'react';

/*
  Renders the output of the ChainDeposit command.
*/

const styles = {
  div: {
    marginTop: '100px',
    marginLeft: '10px',
  },
  qr: {
    height: '250px',
    width: '250px',
    padding: '5px',
  },
  text: {
    fontSize: '15px',
    fontWeight: 'bold',
  },
};

type Data = {
  data: {
    address: string;
    url: string;
  };
};

const ChainDepositOutput = ({ data }: Data) => {
  return (
    <div style={styles.div}>
      <QRCode value={data.url} size={250} style={styles.qr} id="qrcode" bgColor="white" fgColor="black" />
      <p style={styles.text}>{data.address}</p>
    </div>
  );
};

export default ChainDepositOutput;
