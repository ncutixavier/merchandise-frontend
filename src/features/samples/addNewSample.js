import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../http-common";

export const addNewSample = createAsyncThunk(
  "sample/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post("/samples", data);
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response);
    }
  }
);

export const addNewSampleSlice = createSlice({
  name: "addNewSample",
  initialState: {
    loading: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: {
    [addNewSample.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    [addNewSample.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
    [addNewSample.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    },
  },
});

export const selectAddNewSample = (state) => state.addNewSample;
export default addNewSampleSlice.reducer;
