import React, { useState } from 'react';
// import { ipcRenderer } from 'electron';

const Test = () => {
  const [amount, setAmount] = useState('');
  React.useEffect(() => {
    window.electronAPI.passArgs((event, data) => {
      // alert(data);
      console.log(data);
      setAmount(data.amount);
    });
  }, []);

  return (
    <div>
      <h1>Test</h1>
      {!!amount ? <div>{amount}</div> : <div>Loading...</div>}
    </div>
  );
};

export default Test;
