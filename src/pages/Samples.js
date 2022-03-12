import React, { useEffect } from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import {
  Box,
  Grid,
  Container,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Input,
  Autocomplete,
  Snackbar,
  useMediaQuery,
  DialogContentText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSamples,
  selectGetAllSamples,
} from "../features/samples/getAllSamples";
import { addNewSample } from "../features/samples/addNewSample";
import { deleteSample } from "../features/samples/deleteSample";
import { updateSample } from "../features/samples/updateSample";

export const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "white",
}));

 export const TopHeader = styled(Box)({
   display: "flex",
   alignItems: "center",
   justifyContent: "space-between",
   backgroundColor: "#fff",
   padding: "1rem",
 });

const Samples = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
    status: "Pending"
  });

  const validationSchema = Yup.object().shape({
    style_no: Yup.string().required("Style No is required"),
    image: Yup.mixed().test("required", "Image is required", (value) => {
      return value && value.length > 0;
    }),
    status: Yup.string().required("Status is required"),
  });

  const {
    register,
    handleSubmit,
    resetField,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleCreate = (data) => {
    setState({ ...state, loading: true });
    const sample = new FormData();
    sample.append("style_no", data.style_no);
    sample.append("image", data.image[0]);
    sample.append("status", data.status);

    dispatch(addNewSample(sample))
      .then((res) => {
        setState({
          ...state,
          open: false,
          openSnackbar: true,
          successMessage: "Sample added successfully",
        });
        resetField("style_no");
        resetField("image");
        resetField("status");
        setTimeout(() => {
          setState({
            ...state,
            openSnackbar: false,
            loading: false,
            open: false,
          });
        }, 1000);
        dispatch(getAllSamples());
      })
  };

  const handleDelete = () => {
    setState({ ...state, loading: true });
    dispatch(deleteSample(state.sampleId)).then((res) => {
      setState({
        ...state,
        openDeleteForm: false,
        openSnackbar: true,
        successMessage: "Sample deleted successfully",
        loading: false,
      });
      setTimeout(() => {
        setState({
          ...state,
          openSnackbar: false,
          openDeleteForm: false,
        });
      }, 1000);
      dispatch(getAllSamples());
    });
  };

  const handleUpdate = (data) => {
    const sample = {
      style_no: data.style_no,
      id: state.sampleId,
      status: data.status,
    };
    setState({ ...state, loading: true });
    dispatch(updateSample(sample)).then((res) => {
      setState({
        ...state,
        open: false,
        openSnackbar: true,
        successMessage: "Sample updated successfully",
        loading: false,
      });
      setTimeout(() => {
        setState({
          ...state,
          openSnackbar: false,
          open: false,
        });
      }, 1000);
      dispatch(getAllSamples());
    });
  };

  const handleCreateForm = () => {
    setState({
      ...state,
      open: true,
      formTitle: "Add New Sample",
      createForm: "block",
      editForm: "none",
    });
  };

  const handleEditForm = (data) => {
    setState({
      ...state,
      open: true,
      formTitle: "Edit Sample",
      editForm: "flex",
      createForm: "none",
      sampleId: data._id,
      status: data.status,
    });
    setValue("style_no", data.style_no);
    setValue("status", data.status);
    setValue("image", data.image);
  };

  const handleDeleteDialog = (data) => {
    setState({
      ...state,
      openDeleteForm: true,
      sampleId: data._id,
    });
  };

  const handleClose = () => {
    setState({ ...state, open: false, openDeleteForm: false });
  };

  useEffect(() => {
    dispatch(getAllSamples());
  }, [dispatch]);

  const samples = useSelector(selectGetAllSamples);
  let content;

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    color: theme.palette.text.secondary,
    boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
  }));

  const StatusText = styled(Typography)(({ theme }) => ({
    color: "white",
    backgroundColor: theme.palette.dark.main,
    position: "absolute",
    top: 0,
    left: 0,
    textAlign: "center",
    padding: "0 1rem",
    borderRadius: "0 2rem 2rem 0",
    fonsize: "0.5rem",
  }));

  const StyleText = styled(Typography)(({ theme }) => ({
    color: theme.palette.dark.main,
    backgroundColor: "rgba(255,255,255,0.8)",
    position: "absolute",
    bottom: 0,
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    padding: "0.5rem 0",
  }));

  if (samples.loading) {
    content = (
      <Box sx={{ position: "absolute", left: "47.5%", top: "45%" }}>
        <CircularProgress size={60} />
      </Box>
    );
  } else if (samples.error) {
    content = (
      <Alert severity="error">
        Error occured while fetching data. Please try again later.
      </Alert>
    );
  } else if (samples.data) {
    content = samples?.data?.data?.samples.map((data, index) => (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <Item elevation={0}>
          <Box
            sx={{
              width: "100%",
              height: { sm: "350px", md: "230px" },
              position: "relative",
            }}
          >
            <img
              src={data.image}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <StyleText variant="body1" component="div">
              {data.style_no}
            </StyleText>
            <StatusText
              variant="caption"
              sx={{
                backgroundColor:
                  data.status === "Received"
                    ? theme.palette.primary.main
                    : data.status === "Inline"
                    ? theme.palette.warning.main
                    : theme.palette.dark.main,
              }}
            >
              {data.status}
            </StatusText>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 .5rem",
            }}
          >
            <IconButton color="error" onClick={() => handleDeleteDialog(data)}>
              <DeleteIcon />
            </IconButton>
            <IconButton color="primary" onClick={() => handleEditForm(data)}>
              <EditIcon />
            </IconButton>
          </Box>
        </Item>
      </Grid>
    ));
  }

  return (
    <Container sx={{ flexGrow: 1, py: 2 }}>
      <TopHeader sx={{ mb: 2 }}>
        <Typography variant="h5" component="div">
          Samples
        </Typography>
        <ColorButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateForm}
        >
          Add
        </ColorButton>
      </TopHeader>
      <Grid
        container
        spacing={{ xs: 2, md: 6 }}
        columns={{ xs: 12, sm: 8, md: 12 }}
      >
        {content}
      </Grid>
      <Dialog open={state.open} onClose={handleClose} fullScreen={fullScreen}>
        <DialogTitle sx={{ backgroundColor: theme.palette.secondary.main }}>
          {state.formTitle}
        </DialogTitle>
        <DialogContent sx={{ minWidth: { md: "400px" } }}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Style No"
            fullWidth
            sx={{ height: "5rem" }}
            variant="standard"
            {...register("style_no")}
            error={errors.style_no ? true : false}
            helperText={errors.style_no ? errors.style_no.message : ""}
          />
          <Autocomplete
            id="clear-on-escape"
            clearOnEscape
            options={["Pending", "Received", "Inline"]}
            sx={{ height: "5rem" }}
            defaultValue={state.status}
            renderInput={(params) => (
              <TextField
                {...params}
                label="status"
                variant="standard"
                {...register("status")}
              />
            )}
          />

          <Box sx={{ display: state.createForm }}>
            <Input
              accept="image/*"
              type="file"
              fullWidth
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
            Confirm to delete a sample
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
        <Alert variant="filled" severity="success" sx={{ width: "100%" }}>
          {state.successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Samples;
