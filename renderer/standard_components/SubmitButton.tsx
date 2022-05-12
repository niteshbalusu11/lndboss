import { Button, ButtonProps, styled } from "@mui/material";
import { grey } from "@mui/material/colors";

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(grey[900]),
  backgroundColor: grey[900],
  "&:hover": {
    backgroundColor: grey[800],
  },
  marginTop: "30px",
  fontWeight: "bold",
}));

const SubmitButton = (props: ButtonProps) => {
  return <ColorButton {...props}>{props.children}</ColorButton>;
};

export default SubmitButton;
