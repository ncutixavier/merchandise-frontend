import React from "react";
import Typography from "@mui/material/Typography";
import { Box, Container } from "@mui/material";
import { useTheme } from "@emotion/react";
import waves from "../assets/images/waves.svg";

const Footer = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <img
        src={waves}
        alt=""
        style={{
          width: "100%",
          height: "70px",
          transform: "rotate(180deg)",
          position: "absolute",
          bottom: "110px",
        }}
      />
      <Box
        sx={{
          background: theme.palette.dark.main,
          color: theme.palette.secondary.main,
          padding: "50px 30px",
        }}
      >
        <Container>
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            &copy; {new Date().getFullYear()} - Made with{" "}
            <a
              style={{ color: "white" }}
              href="https://ncutixavier.xyz/"
              target="_blank"
              rel="noreferrer"
            >
              ncutixavier.xyz
            </a>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
