import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../http-common";

export const deleteSample = createAsyncThunk(
  "sample/delete",
  async (id,{ rejectWithValue }) => {
    try {
      const response = await http.delete(`/samples/${id}`);
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response);
    }
  }
);

export const deleteSampleSlice = createSlice({
  name: "deleteSample",
  initialState: {
    loading: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: {
    [deleteSample.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    [deleteSample.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
    [deleteSample.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    },
  },
});

export const selectDeleteSample = (state) => state.deleteSample;
export default deleteSampleSlice.reducer;
