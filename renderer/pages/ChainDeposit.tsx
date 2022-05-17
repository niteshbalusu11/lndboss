import { CssBaseline, Stack, TextField } from "@mui/material";
import { ipcRenderer } from "electron";
import router from "next/router";
import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import commands from "../commands";
import StandardButtonLink from "../standard_components/StandardButtonLink";
import StartFlexBox from "../standard_components/StartFlexBox";
import SubmitButton from "../standard_components/SubmitButton";
import ChainDepositOutput from "../output/ChainDepositOutput";

const ChainDepositCommand = commands.find((n) => n.value === "ChainDeposit");
const stringify = (data: any) => JSON.stringify(data);

const styles = createUseStyles({
  form: {
    marginLeft: "50px",
    marginTop: "100px",
    width: "300px",
  },
});

const ChainDeposit = () => {
  const classes = styles();
  const [amount, setAmount] = useState("");
  const [data, setData] = useState({});

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const fetchData = async () => {
    const flags = {
      amount,
    };
    const { error, result } = await ipcRenderer.invoke(
      "command:chainDeposit",
      flags
    );

    console.log(result);
    if (!!error) {
      window.alert(stringify(error));
      return;
    }

    if (!!result) {
      setData(result);
    }
  };
  return (
    <CssBaseline>
      <StartFlexBox>
        <StandardButtonLink label="Home" destination="/home" />
        <Stack spacing={3} className={classes.form}>
          <TextField
            type="text"
            placeholder="Above (Number)"
            label={ChainDepositCommand.flags.amount}
            id={ChainDepositCommand.flags.amount}
            onChange={handleAmountChange}
          />
          <SubmitButton variant="contained" onClick={fetchData}>
            Run Command
          </SubmitButton>
          {!!data && <ChainDepositOutput data={data} />}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default ChainDeposit;
