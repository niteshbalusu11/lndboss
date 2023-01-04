import { CopyText } from '~client/standard_components/app-components';
import QRCode from 'qrcode.react';
import React from 'react';

const substring = n => n.slice(0, 20) + '......' + n.slice(-20);

/*
  Renders the output of the Invoice command.
*/

type Args = {
  data: {
    request: string;
    tokens: number;
  };
};
const InvoiceOutput = ({ data }: Args) => {
  return (
    <div style={styles.div} id="createinvoiceoutput">
      <QRCode value={data.request} size={250} style={styles.qr} id="qrcode" bgColor="white" fgColor="black" />
      <h3 style={styles.text} id="invoice">
        {substring(data.request)}
      </h3>
      <CopyText text={data.request} />
      <div>
        <h3 style={styles.text}>{`Tokens: ${data.tokens}`}</h3>
      </div>
    </div>
  );
};

export default InvoiceOutput;

const styles = {
  div: {
    marginTop: '30px',
    marginLeft: '10px',
  },
  qr: {
    height: '350px',
    width: '350px',
    padding: '5px',
  },
  text: {
    fontSize: '15px',
    fontWeight: 'bold',
    display: 'inline-block',
  },
};
