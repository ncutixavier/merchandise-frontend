import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { Box, Button, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import { Link as NavLink } from "react-scroll";
import { useTheme } from "@emotion/react";

const navLinks = [
  {
    name: "Home",
    offset: -540,
    to: "home",
  },
  {
    name: "Team",
    offset: -60,
    to: "team",
  }
];

function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

export const LogoLink = styled(Link)(({ theme }) => ({
  color: theme.palette.dark.main,
  textDecoration: "none",
  textTransform: "uppercase",
}));

const NavLinkItem = styled(NavLink)(({ theme }) => ({
  margin: theme.spacing(2),
  textDecoration: "none",
  cursor: "pointer",
  "&:hover": {
    fontWeight: "500",
    color: theme.palette.primary.main,
  },
}));

const NavToolbar = styled(Toolbar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  display: "flex",
  justifyContent: "space-between",
}));

const HomeContainer = styled(Paper)(({ theme }) => ({
  backgroundImage: `url(https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80)`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export default function FrontPage(props) {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <React.Fragment>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar color="secondary" name="home">
          <NavToolbar>
            <Typography variant="h6" component="div">
              <LogoLink to="/">Merchandise</LogoLink>
            </Typography>
            <Box sx={{ mr: 2, display: { xs: "none", md: "flex" } }}>
              {navLinks.map(({ name, offset, to }) => (
                <NavLinkItem
                  key={name}
                  to={to}
                  spy={true}
                  smooth={true}
                  offset={offset}
                  duration={500}
                >
                  {name}
                </NavLinkItem>
              ))}
            </Box>
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </NavToolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
      <HomeContainer elevation={0} sx={{ height: { xs: "60vh", md: "85vh" } }}>
        <Typography
          variant="h1"
          component="div"
          sx={{
            width: { xs: "100%", md: "50%" },
            textAlign: "center",
            color: theme.palette.dark.main,
            fontSize: { xs: "2.8rem", md: "4rem" },
            fontWeight: "bold",
          }}
        >
          Welcome to our office!
        </Typography>
      </HomeContainer>
    </React.Fragment>
  );
}
