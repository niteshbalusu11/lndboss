import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import { useNotify } from '~client/hooks/useNotify';

// Renders the button to copy the text to the clipboard

type Args = {
  text: string;
};
const CopyText = ({ text }: Args) => {
  return (
    <CopyToClipboard text={text} onCopy={() => useNotify({ type: 'success', message: 'Copied to clipboard' })}>
      <IconButton>
        <ContentCopyIcon sx={{ fontSize: 'medium' }} />
      </IconButton>
    </CopyToClipboard>
  );
};

export default CopyText;
