import React, { useState } from 'react';
import { donationLnaddress, donationLnurl } from '~client/utils/constants';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import QRCode from 'qrcode.react';
import Typography from '@mui/material/Typography';

// Renders the donation modal on the dashboard.

const styles = {
  box: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  },
  button: {
    fontWeight: 'bold',
    fontSize: '12px',
  },
  qr: {
    height: '250px',
    width: '250px',
    padding: '5px',
  },
};

const DonateModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen} sx={styles.button}>
        Share ❤️
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.box}>
          <Typography id="modal-modal-title" variant="h6" component="h6">
            To share some ❤️, send a ⚡️ tip to Nitesh: {donationLnaddress}
            <QRCode value={donationLnurl} size={250} style={styles.qr} id="qrcode" bgColor="white" fgColor="black" />
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default DonateModal;
