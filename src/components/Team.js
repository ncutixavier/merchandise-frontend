import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, Divider, Box } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useTheme } from "@emotion/react";
import img1 from "../assets/team/img-1.png";
import img2 from "../assets/team/img-2.png";
import img3 from "../assets/team/img-3.png";
import img4 from "../assets/team/img-4.png";

const teams = [
  {
    name: "Eric TUYISHIME",
    title: "Merchandise",
    image: img1,
  },
  {
    name: "Eric NIYIBIZI",
    title: "Merchandise",
    image: img2,
  },
  {
    name: "Annah MUKARUSANGA",
    title: "Merchandise",
    image: img3,
  },
  {
    name: "Dominah KAMARAYIKA",
    title: "Merchandise",
    image: img4,
  },
];

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
          spacing={{ xs: 2, md: 6 }}
          columns={{ xs: 12, sm: 12, md: 12 }}
          sx={{ pb: 8 }}
        >
          {teams.map((team, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card variant="outlined">
                <Box
                  sx={{
                    width: "100%",
                    height: { md: "250px", sm: "350px" },
                  }}
                >
                  <img
                    src={team.image}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <CardActionArea>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography
                      gutterBottom
                      variant="body1"
                      component="div"
                      color={theme.palette.dark.main}
                    >
                      {team.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={theme.palette.secondary.text}
                    >
                      {team.title}
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
