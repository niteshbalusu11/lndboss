import { CssBaseline, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

import { Stack } from '@mui/system';
import { StartFlexBox } from '~client/standard_components/app-components';
import YamlEditor from '@focus-reactive/react-yaml';
import { configs } from '~client/utils/fee_strategies';

const sampleConfigs = Object.keys(configs);

const FeeStrategies = () => {
  const [strategy, setStrategy] = useState(undefined);
  const actions = useRef(null);

  const Search = React.forwardRef<any>(function x(props, ref) {
    return <YamlEditor json={configs} onChange={handleChange} onError={handleError} ref={ref} />;
  });

  useEffect(() => {
    // Here we have access to imperative actions

    if (!strategy) {
      actions.current.replaceValue({ json: configs.defaultConfig });
    } else {
      actions.current.replaceValue({ json: configs[strategy] });
    }
  }, [strategy]);

  const handleChange = ({ json }) => {
    console.log(json);
  };

  const handleError = errorObject => {
    console.log(errorObject.message);
  };
  return (
    <CssBaseline>
      <StartFlexBox>
        <Stack style={styles.form}>
          <FormControl sx={{ minWidth: 120, marginLeft: '10px' }}>
            <InputLabel id="strategies" style={styles.inputLabel}>
              Sample Strategies
            </InputLabel>
            <Select
              label={'Sample Strategies'}
              onChange={event => setStrategy(event.target.value)}
              name={'samplestrategies'}
              style={styles.select}
              placeholder={'Sample Strategies'}
              value={strategy || ''}
            >
              {sampleConfigs.map((config, i) => (
                <MenuItem id={config} value={config} key={i}>
                  {config}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div style={{ background: 'white', maxWidth: '100vh', marginTop: '30px' }}>
            <YamlEditor json={configs} onChange={handleChange} onError={handleError} ref={actions} />
          </div>
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default FeeStrategies;

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '1500px',
  },
  textField: {
    width: '220px',
    marginLeft: '10px',
  },
  h4: {
    marginTop: '0px',
  },
  button: {
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '10px',
    border: '1px solid black',
    marginTop: '20px',
    width: '50px',
  },
  iconButton: {
    width: '50px',
    marginTop: '0px',
  },
  switch: {
    width: '100px',
  },
  select: {
    width: '200px',
  },
  inputLabel: {
    color: 'black',
  },
  formControl: {
    marginLeft: '10px',
    width: '100px',
  },
};
