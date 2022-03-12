import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../http-common";

export const getAllProduction = createAsyncThunk(
  "productions/fetchAll",
  async () => {
    try {
      const response = await http.get("/productions");
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      Promise.reject(err.response);
    }
  }
);

export const productionSlice = createSlice({
  name: "getAllProduction",
  initialState: {
    loading: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: {
    [getAllProduction.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    [getAllProduction.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
    [getAllProduction.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    },
  },
});

export const selectGetAllProduction = (state) => state.getAllProduction;
export default productionSlice.reducer;
