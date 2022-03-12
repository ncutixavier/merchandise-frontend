import * as React from "react";
import { Box } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useLocation } from "react-router-dom";
import Production from "../components/Production";

export default function OrderDetails() {
  const [value, setValue] = React.useState("1");
  const useQuery = () => new URLSearchParams(useLocation().search);
  let query = useQuery();
  console.log(query.get('po'))

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            backgroundColor: "#fff",
            position: "sticky",
            top: { xs: "55px", sm: "65px" },
            zIndex: "1",
          }}
        >
          <TabList
            onChange={handleChange}
            aria-label="Order Details"
            variant="fullWidth"
          >
            <Tab label="Production" value="1" />
            <Tab label="Style" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Production po={query.get("po")} />
        </TabPanel>
        <TabPanel value="2">Style</TabPanel>
      </TabContext>
    </Box>
  );
}
