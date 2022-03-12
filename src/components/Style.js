import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Container,
  Input,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Paper, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import DialogContentText from "@mui/material/DialogContentText";
import Snackbar from "@mui/material/Snackbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddIcon from "@mui/icons-material/Add";
import { ColorButton, TopHeader } from "../pages/Samples";
import { getAllStyles } from "../features/style/getAllStyles";
import { addNewStyle } from "../features/style/addNewStyle";
import { deleteStyle } from "../features/style/deleteStyle";

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

const Style = (props) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const styleData = {
    po_number: props.po_number,
    order: props.order,
  };

  const validationSchema = Yup.object().shape({
    image: Yup.mixed().test("required", "Image is required", (value) => {
      return value && value.length > 0;
    }),
  });

  const {
    register,
    handleSubmit,
    watch,
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
    styleId: "",
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
      styleId: data._id,
    });
  };

  const handleClose = () => {
    setState({ ...state, open: false, openDeleteForm: false });
  };

  const handleCreate = (data) => {
    setState({ ...state, loading: true });
    const style = new FormData();
    style.append("image", data.image[0]);
    style.append("purchaseOrder", props.po_number);
    style.append("order", props.order);

    dispatch(addNewStyle(style))
      .then((response) => {
        if (response.payload.status === 201) {
          setState({
            ...state,
            loading: false,
            open: false,
            openSnackbar: true,
            successMessage: "Style added successfully",
          });
          dispatch(getAllStyles(styleData));
        } else {
          setState({
            ...state,
            loading: false,
            open: false,
            openSnackbar: true,
            failedMessage: response.payload.data.message,
          });
        }
        setTimeout(() => {
          setState({ ...state, openSnackbar: false, open: false });
        }, 1000);
      })
      .catch((error) => {
        setState({
          ...state,
          loading: false,
          open: false,
          openSnackbar: true,
          failedMessage: error.payload.data.message,
        });
        setTimeout(() => {
          setState({ ...state, openSnackbar: false, open: false });
        }, 1000);
      });
  };

  const handleDelete = () => {
    setState({ ...state, loading: true });
    dispatch(deleteStyle(state.styleId)).then((res) => {
      if (res.payload.status === 200) {
        setState({
          ...state,
          successMessage: "Style has been deleted successfully",
          openSnackbar: true,
          openDeleteForm: false,
          loading: false,
        });
        dispatch(getAllStyles(styleData));
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
      }, 1000);
    });
  };

  useEffect(() => {
    dispatch(getAllStyles({
      po_number: props.po_number,
      order: props.order,
    }));
  }, [dispatch, props]);

  const styles = useSelector((state) => state.getAllStyles);

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
        <Table sx={{ minWidth: 550 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              {["PO Number", "Buyer", "Created At", "Style", ""].map((cell, index) => (
                <StyledTableCell key={index}>{cell}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {(filteredData || []).map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell>{row.purchaseOrder.po_number}</StyledTableCell>
                <StyledTableCell>{row.order.buyer}</StyledTableCell>
                <StyledTableCell>
                  {row.createdAt.split("T")[0]}
                </StyledTableCell>
                <StyledTableCell>
                  <a
                    href={row.image}
                    style={{ color: theme.palette.primary.main }}
                  >
                    Download
                  </a>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <IconButton
                    color="error"
                    onClick={() => handleOpenDeleteDialog(row)}
                  >
                    <DeleteIcon />
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
  if (styles.loading) {
    content = (
      <Box sx={{ position: "absolute", left: "47.3%", top: "45%" }}>
        <CircularProgress size={60} />
      </Box>
    );
  } else if (styles.error) {
    content = (
      <Alert severity="error">
        Error occured while fetching data. Please try again later.
      </Alert>
    );
  } else if (styles.data) {
    content = displayData(styles?.data?.data);
  }

  return (
    <Container sx={{ flexGrow: 1 }}>
      <TopHeader sx={{ mb: 2 }}>
        <Typography variant="h6" component="div">
          Styles
        </Typography>

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
          Add New Style
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: "60px" }}>
            <Input
              accept="image/*"
              type="file"
              fullWidth
              sx={{ mt: 2 }}
              {...register("image")}
              error={errors.image ? true : false}
              helperText={errors.image ? errors.image.message : ""}
            />
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.8rem",
                color: theme.palette.error.main,
              }}
            >
              {errors.image ? errors.image.message : ""}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit(handleCreate)}
            sx={{ display: state.createForm }}
          >
            {state.loading ? <CircularProgress size={24} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={state.openDeleteForm} onClose={handleClose}>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Confirm to remove style data
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleDelete} autoFocus>
            {state.loading ? "Deleting..." : "Delete"}
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

export default Style;
