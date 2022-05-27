import { InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

/*
  Gets the list of saved nodes and populates the saved nodes dropdown menu in all commands
  Sends IPC to the main process to get saved node folders.
*/

const SavedNodes = ({ getSavedNode }) => {
  const [defaultNode, setDefaultNode] = React.useState('');
  const [savedNode, setSavedNode] = React.useState('');
  const [nodeList, setNodeList] = React.useState(['']);

  React.useEffect(() => {
    const fetchData = async () => {
      const { defaultSavedNode, savedNodes, error } = await window.electronAPI.getSavedNodes();

      if (!!error) {
        window.alert(error);
      }
      if (!!savedNodes) {
        setDefaultNode(defaultSavedNode);
        setNodeList(savedNodes.filter(node => node !== defaultSavedNode));
        getSavedNode(defaultSavedNode);
      }
    };
    fetchData();
  }, []);

  const handleChoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSavedNode(event.target.value);
    getSavedNode(event.target.value);
  };

  return (
    <>
      <InputLabel id="demo-simple-select-standard-label" style={{ fontWeight: 'bold', color: 'black' }}>
        Saved Node
      </InputLabel>
      <Select
        labelId="saved-nodes"
        id="saved-nodes"
        value={savedNode || defaultNode || ''}
        onChange={handleChoiceChange}
        label="Saved Nodes"
        style={{ marginTop: '0px' }}
      >
        <MenuItem value={defaultNode}>{defaultNode}</MenuItem>
        {nodeList.map((node: string) => {
          return (
            <MenuItem value={node} key={node}>
              {node}
            </MenuItem>
          );
        })}
      </Select>
    </>
  );
};

export default SavedNodes;
