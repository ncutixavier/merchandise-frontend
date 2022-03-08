import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@emotion/react";
import FrontPage from "../components/FrontPage";
import Team from "../components/Team";
import Footer from "../components/Footer";

const Home = () => {
  const theme = useTheme();
  return (
    <React.Fragment>
      <Box sx={{ background: theme.palette.secondary.main }}>
        <FrontPage />
        <Team />
        <Footer />
      </Box>
    </React.Fragment>
  );
};

export default Home;
