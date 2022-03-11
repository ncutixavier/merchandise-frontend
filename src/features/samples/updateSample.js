import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../http-common";

export const updateSample = createAsyncThunk(
  "sample/update",
  async (data,{ rejectWithValue }) => {
    try {
      const response = await http.patch(`/samples/${data.id}`, {
        style_no: data.style_no,
        status: data.status
      });
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response);
    }
  }
);

export const updateSampleSlice = createSlice({
  name: "updateSample",
  initialState: {
    loading: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: {
    [updateSample.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    [updateSample.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
    [updateSample.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    },
  },
});

export const selectUpdateSample = (state) => state.updateSample;
export default updateSampleSlice.reducer;
