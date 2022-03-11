import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

export default function OrderDetails() {
  const [value, setValue] = React.useState("1");

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
          }}
        >
          <TabList
            onChange={handleChange}
            aria-label="Order Details"
            variant="fullWidth"
          >
            <Tab label="Production" value="1" />
            <Tab label="Purchase Order" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">Production</TabPanel>
        <TabPanel value="2">Purchase Order</TabPanel>
      </TabContext>
    </Box>
  );
}
