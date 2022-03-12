import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {
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
import { ColorButton, TopHeader } from "../pages/Samples";
import { getAllProduction } from "../features/production/getAllProduction";
import { addNewProduction } from "../features/production/addNewProduction";
import { deleteProduction } from "../features/production/deleteProduction";
import { updateProduction } from "../features/production/updateProduction";

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

const Production = (props) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const validationSchema = Yup.object().shape({
    input: Yup.string().required("Input is required"),
    output: Yup.string().required("Output is required"),
    packed: Yup.string().required("Packed is required"),
    style: Yup.string().required("Style is required"),
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
    productionId: "",
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
      formTitle: "Add New Production",
    });
  };

  const handleOpenDeleteDialog = (data) => {
    setState({
      ...state,
      openDeleteForm: true,
      productionId: data._id,
    });
  };

  const handleOpenEditForm = (data) => {
    setState({
      ...state,
      createForm: "none",
      editForm: "block",
      open: true,
      formTitle: "Edit Production",
      productionId: data._id,
    });
    setValue("input", data.input);
    setValue("output", data.output);
    setValue("packed", data.packed);
    setValue("style", data.style);
  };

  const handleClose = () => {
    setState({ ...state, open: false, openDeleteForm: false });
    resetField("input");
    resetField("output");
    resetField("packed");
    resetField("style");
  };

  const handleCreate = (data) => {
    setState({ ...state, loading: true });
    const payload = {
      ...data,
      po: props.po,
    };

    dispatch(addNewProduction(payload))
      .then((res) => {
        if (res.payload.status === 201) {
          setState({
            ...state,
            loading: false,
            successMessage: "Order added successfully",
            openSnackbar: true,
            open: false,
          });
          resetField("input");
          resetField("output");
          resetField("packed");
          resetField("style");
          dispatch(getAllProduction());
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
      })
      .catch((err) => {
        setState({
          ...state,
          loading: false,
          failedMessage: err.payload.data.message,
          openSnackbar: true,
        });
      });
  };

  const handleUpdate = (data) => {
    setState({ ...state, loading: true });
    const payload = {
      ...data,
      id: state.productionId,
    };

    dispatch(updateProduction(payload)).then((res) => {
      if (res.payload.status === 200) {
        setState({
          ...state,
          loading: false,
          successMessage: "Order updated successfully",
          openSnackbar: true,
          open: false,
        });
        resetField("input");
        resetField("output");
        resetField("packed");
        resetField("style");
        dispatch(getAllProduction());
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
    dispatch(deleteProduction(state.productionId)).then((res) => {
      if (res.payload.status === 200) {
        setState({
          ...state,
          successMessage: "Order has been deleted successfully",
          openSnackbar: true,
          openDeleteForm: false,
          loading: false,
        });
        dispatch(getAllProduction());
      } else {
        setState({
          ...state,
          loading: false,
          failedMessage: res.payload.data.message,
          openSnackbar: true,
        });
      }
      setTimeout(() => {
        setState({ ...state, openSnackbar: false, openDeleteForm: false });
      }, 3000);
    });
  };

  useEffect(() => {
    dispatch(getAllProduction());
  }, [dispatch]);

  const production = useSelector((state) => state.getAllProduction);

  const displayData = (rows) => {
    const search = watch("search");
    let filteredData = rows?.data;
    if (search) {
      filteredData = rows?.data?.filter((row) => {
        return row.purchaseOrder.order.buyer
          .toLowerCase()
          .includes(search.toLowerCase());
      });
    }
    return (
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 850 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              {[
                "Buyer",
                "Qty",
                "Colors",
                "Input",
                "Output",
                "Packed",
                "Style",
                "",
              ].map((cell, index) => (
                <StyledTableCell key={index}>{cell}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {(filteredData || []).map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell>
                  {row.purchaseOrder.order.buyer}
                </StyledTableCell>
                <StyledTableCell>
                  {row.purchaseOrder.order.quantity}
                </StyledTableCell>
                <StyledTableCell>
                  {row.purchaseOrder.order.colors.join(",")}
                </StyledTableCell>
                <StyledTableCell>{row.style}</StyledTableCell>
                <StyledTableCell>{row.input}</StyledTableCell>
                <StyledTableCell>{row.output}</StyledTableCell>
                <StyledTableCell>{row.packed}</StyledTableCell>
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
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  let content;
  if (production.loading) {
    content = (
      <Box sx={{ position: "absolute", left: "47.3%", top: "45%" }}>
        <CircularProgress size={60} />
      </Box>
    );
  } else if (production.error) {
    content = (
      <Alert severity="error">
        Error occured while fetching data. Please try again later.
      </Alert>
    );
  } else if (production.data) {
    content = displayData(production?.data?.data);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <TopHeader sx={{ mb: 2, zoom: { xs: 0.7, md: 1 } }}>
        <Typography variant="h6" component="div">
          Production
        </Typography>
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
            label="Input"
            fullWidth
            sx={{ height: "4rem" }}
            variant="standard"
            {...register("input")}
            error={errors.input ? true : false}
            helperText={errors.input ? errors.input.message : ""}
          />

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Output"
            fullWidth
            sx={{ height: "4rem" }}
            variant="standard"
            {...register("output")}
            error={errors.output ? true : false}
            helperText={errors.output ? errors.output.message : ""}
          />

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Style"
            fullWidth
            sx={{ height: "4rem" }}
            variant="standard"
            {...register("style")}
            error={errors.style ? true : false}
            helperText={errors.style ? errors.style.message : ""}
          />

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Packed"
            fullWidth
            sx={{ height: "4rem" }}
            variant="standard"
            {...register("packed")}
            error={errors.packed ? true : false}
            helperText={errors.packed ? errors.packed.message : ""}
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
            Confirm to delete production data
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
    </Box>
  );
};

export default Production;
