import * as React from "react";
import { useState } from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Typography, CircularProgress, Box } from "@mui/material";
import { useTheme } from "@emotion/react";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/LoginSlice";
import { LogoLink } from "../components/FrontPage";
import { GoogleLogin } from "react-google-login";
import Cookie from "js-cookie";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(3),
  color: theme.palette.text.secondary,
}));

const useStyles = makeStyles(({ spacing }) => ({
  loginForm: {},
  "google-login-button": {
    width: "100%",
    justifyContent: "center",
  },
}));

export default function Login() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const classes = useStyles();
  let navigate = useNavigate();

  const [loginError, setLoginError] = useState({
    display: "none",
    message: "",
  });

  const onGoogleSuccess = (response) => {
    const tokenId = response.tokenId;

    dispatch(login({ tokenId })).then((res) => {
      if (res.payload.status === 200) {
        Cookie.set("token", tokenId);
        navigate("/merchandise");
      } else {
        setLoginError({
          display: "block",
          message: res.payload.data.message,
        });
      }
    });
  };

  const onGoogleFailure = (error) => {
    console.log("FAILURE::", error);
  };

  const loginWithGoogle = useSelector((state) => state.login);
  const { loading } = loginWithGoogle;

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ background: theme.palette.secondary.main, minHeight: "100vh" }}
    >
      <Grid item xs={12} sm={8} md={4}>
        <Item className={classes.loginForm} sx={{ py: 9 }} variant="outlined">
          <Alert severity="error" sx={{ display: loginError.display }}>
            {loginError.message ?? "Error occured while logging in"}
          </Alert>

          <Typography
            variant="body1"
            sx={{
              my: 2,
              textAlign: "center",
              color: theme.palette.primary.main,
            }}
          >
            <LogoLink to="/">Back to home</LogoLink>
          </Typography>

          <Typography
            variant="h5"
            sx={{
              my: 3,
              textAlign: "center",
            }}
          >
            Welcome to Merchandise dashboard!
          </Typography>

          <Box
            sx={{
              display: "flex",
              position: "relative",
            }}
          >
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              buttonText={loading ? "Signing..." : "Sign in with Google"}
              onSuccess={onGoogleSuccess}
              onFailure={onGoogleFailure}
              className={classes["google-login-button"]}
              disabled={loading}
            />

            {loading && (
              <CircularProgress
                color="primary"
                size={25}
                thickness={5}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  marginTop: -12,
                }}
              />
            )}
          </Box>
        </Item>
      </Grid>
    </Grid>
  );
}
