import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, Divider, Box } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useTheme } from "@emotion/react";

const Team = () => {
  const theme = useTheme();
  return (
    <>
      <Container sx={{ flexGrow: 1, py: 4 }} name="team">
        <Box sx={{ my: 4 }}>
          <Typography gutterBottom variant="h4" component="div">
            Our Team
          </Typography>
          <Divider />
        </Box>
        <Grid
          container
          spacing={{ xs: 2, md: 10 }}
          columns={{ xs: 12, sm: 12, md: 12 }}
          sx={{ pb: 8 }}
        >
          {Array.from(Array(4)).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card variant="outlined">
                <CardMedia
                  component="img"
                  height="200"
                  image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                  alt="Teammates"
                />
                <CardActionArea>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      color={theme.palette.dark.main}
                    >
                      John Doe
                    </Typography>
                    <Typography
                      variant="body2"
                      color={theme.palette.secondary.text}
                    >
                      Production Manager
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Team;
