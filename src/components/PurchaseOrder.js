import React, { useEffect } from "react";
import {
  Container,
  Box,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Paper, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import DialogContentText from "@mui/material/DialogContentText";
import Snackbar from "@mui/material/Snackbar";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import { ColorButton, TopHeader } from "../pages/Samples";
import { useNavigate } from "react-router-dom";
import { getAllPurchaseOrder } from "../features/purchaseOrder/getAllPurchaseOrder";
import { addNewPurchaseOrder } from "../features/purchaseOrder/addNewPurchaseOrder";
import { deletePurchaseOrder } from "../features/purchaseOrder/deletePurchaseOrder";

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

const PurchaseOrder = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    watch,
  } = useForm({
    resolver: yupResolver(),
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
    purchaseOrderId: "",
    openDeleteForm: false,
    status: "Pending",
    failedMessage: "",
  });

  const handleOpenDeleteDialog = (data) => {
    setState({
      ...state,
      openDeleteForm: true,
      purchaseOrderId: data._id,
    });
  };

  const handleClose = () => {
    setState({ ...state, open: false, openDeleteForm: false });
  };

  const handleCreate = () => {
    setState({ ...state, loading: true });
    dispatch(addNewPurchaseOrder(props.id)).then((res) => {
      console.log(res);
      if (res.payload.status === 201) {
        setState({
          ...state,
          openSnackbar: true,
          successMessage: "Purchase Order added successfully",
          loading: false,
        });
        dispatch(getAllPurchaseOrder(props.id));
      }

      setTimeout(() => {
        setState({ ...state, openSnackbar: false, loading: false });
      }, 2000);
    });
  };

  const handleDelete = () => {
    setState({ ...state, loading: true });
    const data = {
      id: props.id,
      purchaseOrderId: state.purchaseOrderId,
    };
    dispatch(deletePurchaseOrder(data)).then((res) => {
      if (res.payload.status === 200) {
        setState({
          ...state,
          openSnackbar: true,
          successMessage: "Purchase Order deleted successfully",
          openDeleteForm: false,
          loading: false,
        });
        dispatch(getAllPurchaseOrder(props.id));
      } else {
        setState({
          ...state,
          loading: false,
          failedMessage: res.payload.data.message,
          openSnackbar: true,
        });
      }

      setTimeout(() => {
        setState({
          ...state,
          openSnackbar: false,
          loading: false,
          openDeleteForm: false,
        });
      }, 3000);
    });
  };

  const handleNavigate = (data) => {
    navigate(`/merchandise/orders/purchase_order?po=${data.po_number}`);
  };

  useEffect(() => {
    dispatch(getAllPurchaseOrder(props.id));
  }, [dispatch, props.id]);

  const purchaseOrder = useSelector((state) => state.getAllPurchaseOrder);
  console.log(purchaseOrder);

  const displayData = (rows) => {
    const search = watch("search");
    let filteredData = rows?.data;
    if (search) {
      filteredData = rows?.data?.filter((row) => {
        return (
          row.order.buyer.toLowerCase().includes(search.toLowerCase()) ||
          row.po_number.toLowerCase().includes(search.toLowerCase())
        );
      });
    }
    return (
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              {["PO Number", "Buyer", "Order Qty", "Colors", ""].map(
                (cell, index) => (
                  <StyledTableCell key={index}>{cell}</StyledTableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {(filteredData || []).map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell>{row.po_number}</StyledTableCell>
                <StyledTableCell>{row.order.buyer}</StyledTableCell>
                <StyledTableCell>{row.order.quantity}</StyledTableCell>
                <StyledTableCell>{row.order.colors.join(",")}</StyledTableCell>
                <StyledTableCell align="center">
                  <IconButton
                    color="error"
                    onClick={() => handleOpenDeleteDialog(row)}
                  >
                    <DeleteIcon />
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
  if (purchaseOrder.loading) {
    content = (
      <Box sx={{ position: "absolute", left: "47.3%", top: "45%" }}>
        <CircularProgress size={60} />
      </Box>
    );
  } else if (purchaseOrder.error) {
    content = (
      <Alert severity="error">
        Error occured while fetching data. Please try again later.
      </Alert>
    );
  } else if (purchaseOrder.data) {
    content = displayData(purchaseOrder?.data?.data);
  }

  return (
    <Container sx={{ flexGrow: 1 }}>
      <TopHeader sx={{ mb: 2, px: 0 }}>
        <Paper
          variant="outlined"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 200,
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
          startIcon={
            state.loading ? (
              <CircularProgress size={15} style={{ color: "white" }} />
            ) : (
              <AddIcon />
            )
          }
          onClick={handleCreate}
        >
          {state.loading ? "Adding..." : "Create"}
        </ColorButton>
      </TopHeader>
      {content}

      <Dialog open={state.openDeleteForm} onClose={handleClose}>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Confirm to delete purchase order
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

export default PurchaseOrder;
