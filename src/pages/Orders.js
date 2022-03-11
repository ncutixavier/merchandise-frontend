import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import DialogContentText from "@mui/material/DialogContentText";
import Snackbar from "@mui/material/Snackbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import { ColorButton, TopHeader } from "./Samples";
import { getAllOrders } from "../features/order/getAllOrders";
import { addNewOrder } from "../features/order/addNewOrder";
import { deleteOrder } from "../features/order/deleteOrder";
import { updateOrder } from "../features/order/updateOrder";
import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    textTransform: "uppercase",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.secondary.main,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    borderBottom: `3px solid ${theme.palette.primary.main}`,
  },
}));

const Orders = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const validationSchema = Yup.object().shape({
    buyer: Yup.string().required("Buyer is required"),
    quantity: Yup.string().required("Quantity is required"),
    colors: Yup.string().required("Color(s) is required"),
  });

  const {
    register,
    handleSubmit,
    watch,
    resetField,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [state, setState] = React.useState({
    open: false,
    openSnackbar: false,
    loading: false,
    formTitle: "",
    successMessage: "",
    createForm: "none",
    editForm: "none",
    sampleId: "",
    openDeleteForm: false,
    status: "Pending",
    failedMessage: "",
  });

  const handleOpenAddForm = () => {
    setState({
      ...state,
      createForm: "block",
      editForm: "none",
      open: true,
      formTitle: "Add New Order",
    });
  };

  const handleOpenDeleteDialog = (data) => {
    setState({
      ...state,
      openDeleteForm: true,
      sampleId: data._id,
    });
  };

  const handleOpenEditForm = (data) => {
    setState({
      ...state,
      createForm: "none",
      editForm: "block",
      open: true,
      formTitle: "Edit Order",
      sampleId: data._id,
    });
    setValue("buyer", data.buyer);
    setValue("quantity", data.quantity);
    setValue("colors", data.colors);
  };

  const handleClose = () => {
    setState({ ...state, open: false, openDeleteForm: false });
  };

  const handleCreate = (data) => {
    setState({ ...state, loading: true });
    const order = {
      buyer: data.buyer,
      quantity: data.quantity,
      colors: data.colors.split(","),
    };
    dispatch(addNewOrder(order)).then((res) => {
      if (res.payload.status === 201) {
        setState({
          ...state,
          successMessage: "Order has been added successfully",
          openSnackbar: true,
          open: false,
          createForm: "none",
          loading: false,
        });
        dispatch(getAllOrders());
        resetField("buyer");
        resetField("quantity");
        resetField("colors");
      } else {
        setState({
          ...state,
          loading: false,
          failedMessage: res.payload.data.message,
          openSnackbar: true,
        });
      }

      setTimeout(() => {
        setState({ ...state, openSnackbar: false, open: false });
      }, 3000);
    });
  };

  const handleUpdate = (data) => {
    setState({ ...state, loading: true });
    const order = {
      buyer: data.buyer,
      quantity: data.quantity,
      colors: data.colors.split(","),
      id: state.sampleId,
    };
    dispatch(updateOrder(order)).then((res) => {
      if (res.payload.status === 200) {
        setState({
          ...state,
          successMessage: "Order has been updated successfully",
          openSnackbar: true,
          open: false,
          editForm: "none",
          loading: false,
        });
        dispatch(getAllOrders());
        resetField("buyer");
        resetField("quantity");
        resetField("colors");
      } else {
        setState({
          ...state,
          loading: false,
          failedMessage: res.payload.data.message,
          openSnackbar: true,
        });
      }

      setTimeout(() => {
        setState({ ...state, openSnackbar: false, open: false });
      }, 3000);
    });
  };

  const handleDelete = () => {
    setState({ ...state, loading: true });
    dispatch(deleteOrder(state.sampleId)).then((res) => {
      setState({
        ...state,
        openDeleteForm: false,
        successMessage: "Order has been deleted successfully",
        openSnackbar: true,
        loading: false,
      });
      dispatch(getAllOrders());

      setTimeout(() => {
        setState({ ...state, openSnackbar: false, openDeleteForm: false });
      }, 3000);
    });
  };

  const handleNavigate = (data) => { 
    navigate(`/merchandise/orders/${data._id}`);
  }

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const orders = useSelector((state) => state.getAllOrders);

  const displayData = (rows) => {
    const search = watch("search");
    let filteredData = rows?.data;
    if (search) {
      filteredData = rows?.data?.filter((row) => {
        return (
          row.buyer.toLowerCase().includes(search.toLowerCase()) ||
          row.quantity.toLowerCase().includes(search.toLowerCase())
        );
      });
    }
    return (
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              {["Buyer", "Quantity", "Colors", ""].map((cell, index) => (
                <StyledTableCell key={index}>{cell}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {(filteredData || []).map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell>{row.buyer}</StyledTableCell>
                <StyledTableCell>{row.quantity}</StyledTableCell>
                <StyledTableCell>{row.colors.join(",")}</StyledTableCell>
                <StyledTableCell align="center">
                  <IconButton
                    color="error"
                    onClick={() => handleOpenDeleteDialog(row)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenEditForm(row)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton color="dark" onClick={() => handleNavigate(row)}>
                    <FolderIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  let content;
  if (orders.loading) {
    content = (
      <Box sx={{ position: "absolute", left: "47.3%", top: "45%" }}>
        <CircularProgress size={60} />
      </Box>
    );
  } else if (orders.error) {
    content = (
      <Alert severity="error">
        Error occured while fetching data. Please try again later.
      </Alert>
    );
  } else if (orders.data) {
    content = displayData(orders?.data?.data);
  }

  return (
    <Container sx={{ flexGrow: 1, py: 2 }}>
      <TopHeader sx={{ mb: 2, zoom: { xs: 0.75, md: 1 } }}>
        <Typography variant="h5" component="div">
          Orders
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 230,
            height: "35px",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search"
            inputProps={{ "aria-label": "search" }}
            {...register("search")}
          />
          <IconButton sx={{ p: "10px" }} aria-label="search" disabled>
            <SearchIcon />
          </IconButton>
        </Paper>
        <ColorButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddForm}
        >
          Add
        </ColorButton>
      </TopHeader>
      {content}

      <Dialog open={state.open} onClose={handleClose} fullScreen={fullScreen}>
        <DialogTitle sx={{ backgroundColor: theme.palette.secondary.main }}>
          {state.formTitle}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Buyer"
            fullWidth
            sx={{ height: "4rem" }}
            variant="standard"
            {...register("buyer")}
            error={errors.buyer ? true : false}
            helperText={errors.buyer ? errors.buyer.message : ""}
          />

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Quantity"
            fullWidth
            sx={{ height: "4rem" }}
            variant="standard"
            {...register("quantity")}
            error={errors.quantity ? true : false}
            helperText={errors.quantity ? errors.quantity.message : ""}
          />

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Colors"
            fullWidth
            sx={{ height: "4rem" }}
            variant="standard"
            {...register("colors")}
            error={errors.colors ? true : false}
            helperText={errors.colors ? errors.colors.message : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit(handleCreate)}
            sx={{ display: state.createForm }}
          >
            {state.loading ? <CircularProgress size={24} /> : "Add"}
          </Button>
          <Button
            onClick={handleSubmit(handleUpdate)}
            sx={{ display: state.editForm }}
          >
            {state.loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={state.openDeleteForm} onClose={handleClose}>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Confirm to delete order
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleDelete} autoFocus>
            {state.loading ? "Loading..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={state.openSnackbar}>
        {state.successMessage ? (
          <Alert variant="filled" severity="success" sx={{ width: "100%" }}>
            {state.successMessage}
          </Alert>
        ) : (
          <Alert variant="filled" severity="error" sx={{ width: "100%" }}>
            {state.failedMessage}
          </Alert>
        )}
      </Snackbar>
    </Container>
  );
};

export default Orders;
