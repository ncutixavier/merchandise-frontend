import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../http-common";

export const getAllSamples = createAsyncThunk(
  "samples/fetchAll",
  async () => {
    try {
      const response = await http.get("/samples");
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      Promise.reject(err.response);
    }
  }
);

export const samplesSlice = createSlice({
  name: "getAllSamples",
  initialState: {
    loading: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: {
    [getAllSamples.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    [getAllSamples.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
    [getAllSamples.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    },
  },
});

export const selectGetAllSamples = (state) => state.getAllSamples;
export default samplesSlice.reducer;
