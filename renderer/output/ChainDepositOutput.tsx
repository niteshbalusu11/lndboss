import { CssBaseline, Paper, Stack, styled } from "@mui/material";
import { createUseStyles } from "react-jss";
import { useRouter } from "next/router";
import React from "react";
import QRCode from "react-qr-code";
import StartFlexBox from "../standard_components/StartFlexBox";
import StandardButtonLink from "../standard_components/StandardButtonLink";

const styles = createUseStyles({
  div: {
    marginTop: "150px",
    marginLeft: "20px",
  },
  qr: {
    background: "white",
    height: "250px",
    width: "250px",
    padding: "5px",
  },
  text: {
    fontSize: "15px",
    fontWeight: "bold",
  },
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const ChainDepositOutput = ({ data }) => {
  const classes = styles();

  return (
    <CssBaseline>
      <StartFlexBox>
        <div>
          <StandardButtonLink
            label="ChainDeposit"
            destination="/ChainDeposit"
          />
          <StandardButtonLink label="Home" destination="/home" />
        </div>
        <div className={classes.div}>
          {/* <QRCode
            value={data.address}
            size={250}
            className={classes.qr}
            bgColor="white"
            fgColor="black"
          /> */}
          <p className={classes.text}>{data.address}</p>
        </div>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default ChainDepositOutput;
