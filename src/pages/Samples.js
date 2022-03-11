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

export const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "white",
}));

const Samples = () => {
    const theme = useTheme();
  const dispatch = useDispatch();

  const [state, setState] = React.useState({
    open: false,
    openSnackbar: false,
    loading: false,
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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    setState({ ...state, loading: true });
    const sample = new FormData();
    sample.append("style_no", data.style_no);
    sample.append("image", data.image[0]);
    sample.append("status", data.status);

    dispatch(addNewSample(sample))
      .then((res) => {
        console.log(res);
        setState({ ...state, open: false, openSnackbar: true });
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
        }, 3000);
        dispatch(getAllSamples());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpen = () => {
    setState({ ...state, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
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

  const TopHeader = styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: "1rem",
  });

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
            <StatusText variant="caption">{data.status}</StatusText>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 .5rem",
            }}
          >
            <IconButton color="error">
              <DeleteIcon />
            </IconButton>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Box>
        </Item>
      </Grid>
    ));
  }

  return (
    <Container sx={{ flexGrow: 1, mt: 3 }}>
      <TopHeader sx={{ my: 3 }}>
        <Typography variant="h5" component="div">
          Samples
        </Typography>
        <ColorButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
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
      <Dialog open={state.open} onClose={handleClose}>
        <DialogTitle>Add New Sample</DialogTitle>
        <DialogContent>
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
            defaultValue={"Pending"}
            sx={{ height: "5rem" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="status"
                variant="standard"
                {...register("status")}
                value={"Pending"}
              />
            )}
          />

          <Box>
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
          <Button onClick={handleSubmit(onSubmit)}>
            {state.loading ? <CircularProgress size={24} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={state.openSnackbar}>
        <Alert variant="filled" severity="success" sx={{ width: "100%" }}>
          Sample added successfully
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Samples;
