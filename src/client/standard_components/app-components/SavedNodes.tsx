import * as React from 'react';

import { Button, Menu, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';

import Router from 'next/router';
import { axiosGetNoLoading } from '~client/utils/axios';
import { grey } from '@mui/material/colors';

// Menu button on the commands page

const styles = {
  backgroundColor: grey[900],
  '&:hover': {
    backgroundColor: grey[700],
  },
  margin: '10px',
  fontWeight: 'bold',
  color: 'white',
  height: '30px',
  fontSize: '14px',
  marginLeft: '20px',
  marginTop: '15px',
};

const SavedNodes = () => {
  const [nodes, setSavedNodes] = useState(undefined);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = event => {
    const { nodeValue } = event.currentTarget.dataset;
    if (!!nodeValue) {
      localStorage.setItem('SELECTED_SAVED_NODE', nodeValue);
      Router.reload();
    }

    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await axiosGetNoLoading({
        path: 'grpc/get-saved-nodes',
        query: {},
      });

      if (!!result && !!result.nodes && !!result.nodes.length && result.nodes.length > 1) {
        setSavedNodes(result.nodes.filter(node => !!node.node_name).map(node => node.node_name));
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {!!nodes && !!nodes.length && nodes.length > 1 ? (
        <>
          <Button
            id="saved-nodes-button"
            aria-controls={open ? 'saved-nodes-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            style={styles}
          >
            Switch Saved Node
          </Button>
          <Menu
            id="saved-nodes-menu"
            aria-labelledby="saved-nodes-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {!!nodes
              ? nodes.map((node, index) => (
                  <MenuItem onClick={handleClose} key={index} data-node-value={node} id={node}>
                    {node}
                  </MenuItem>
                ))
              : null}
          </Menu>
        </>
      ) : null}
    </>
  );
};

export default SavedNodes;
