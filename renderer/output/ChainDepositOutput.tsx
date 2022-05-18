import { createUseStyles } from 'react-jss';
import React from 'react';
import QRCode from 'react-qr-code';

const styles = createUseStyles({
  div: {
    marginTop: '150px',
    marginLeft: '20px',
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
});

type Data = {
  data: {
    address: string;
    url: string;
  };
};

const ChainDepositOutput = ({ data }: Data) => {
  const classes = styles();

  return (
    <div className={classes.div}>
      <QRCode
        value={data.url}
        size={250}
        className={classes.qr}
        bgColor="white"
        fgColor="black"
      />
      <p className={classes.text}>{data.address}</p>
    </div>
  );
};

export default ChainDepositOutput;
