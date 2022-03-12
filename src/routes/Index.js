import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Layout from "../components/Layout";
import Login from "../pages/Login";
import Admin from "../pages/Admin";
import Home from "../pages/Home";
import Orders from "../pages/Orders";
import Samples from "../pages/Samples";
import OrderDetails from "../pages/OrderDetails";

const theme = createTheme({
  palette: {
    primary: {
      main: "#12A4D2",
    },
    secondary: {
      main: "#F1FCFF",
      text: "#888",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
    dark: {
      main: "#204C59",
    },
  },
  typography: {
    fontFamily: `"Work Sans", "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

const Index = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="merchandise" element={<Layout />}>
            <Route exact path="" element={<Admin />} />
            <Route exact path="Samples" element={<Samples />} />
            <Route exact path="Orders" element={<Orders />} />
            <Route exact path="Orders/purchase_order" element={<OrderDetails />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default Index;
