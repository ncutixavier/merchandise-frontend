import React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Box, Grid, Container, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";

const statsData = [
  {
    title: "Total Orders",
    value: "1,000",
    color: "primary",
  },
  {
    title: "Total Buyers",
    value: "1,000",
    color: "secondary",
  },
  {
    title: "Total Samples",
    value: "200",
    color: "secondary",
  },
  {
    title: "Total Samples",
    value: "200",
    color: "secondary",
  },
];

export const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "white",
}));

const Samples = () => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  }));

  const TopHeader = styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: "1rem",
  });

  const theme = useTheme();
  return (
    <Container sx={{ flexGrow: 1, mt: 3 }}>
      <TopHeader sx={{ my: 3 }}>
        <Typography variant="h5" component="div">
          Samples
        </Typography>
        <ColorButton variant="contained" startIcon={<AddIcon />}>
          Add
        </ColorButton>
      </TopHeader>
      <Grid
        container
        spacing={{ xs: 2, md: 6 }}
        columns={{ xs: 12, sm: 8, md: 12 }}
      >
        {statsData.map((data, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Item elevation={0} variant="outlined">
              <Box
                sx={{
                  width: "100%",
                  height: "200px",
                }}
              >
                <img
                  src={
                    "https://worldwidegiftshowroom.com/storage/images/products/f/8289/0005817_zsts2-alternative-stock-classic-high-visibility-t-shirt-no-returns.jpeg"
                  }
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{ color: theme.palette.primary.main }}
              ></Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h4">{data.value}</Typography>
              </Box>
            </Item>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Samples;
