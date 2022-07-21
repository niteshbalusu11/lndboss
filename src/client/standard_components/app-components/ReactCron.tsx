import 'antd/dist/antd.css';
import 'react-js-cron/dist/styles.css';

import * as React from 'react';

import Cron, { CronError } from 'react-js-cron';

const styles = {
  p: {
    marginTop: 20,
    fontWeight: 'bold',
  },
};

type Props = {
  handleScheduleChange: (schedule: string) => void;
  handleCronUrlChange: (newCronUrl: string) => void;
};

const ReactCron: React.FC<Props> = ({ handleScheduleChange, handleCronUrlChange }) => {
  const inputRef = React.useRef<any>(null);

  const defaultValue = '30 5 * * 1,6';

  const [value, setValue] = React.useState(defaultValue);

  const customSetValue = React.useCallback(
    (newValue: string) => {
      setValue(newValue);
      inputRef.current = newValue;

      handleScheduleChange(newValue);

      const url = `https://crontab.guru/#${newValue.replace(/\s/g, '_')}`;

      handleCronUrlChange(url);
    },
    [inputRef]
  );

  const [error, onError] = React.useState<CronError>();

  return (
    <div>
      <Cron value={value} setValue={customSetValue} onError={onError}></Cron>

      <p style={styles.p}>Error: {error ? error.description : 'No Errors'}</p>
    </div>
  );
};

export default ReactCron;
