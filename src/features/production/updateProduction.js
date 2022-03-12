import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../http-common";

export const updateProduction = createAsyncThunk(
  "production/update",
  async (data,{ rejectWithValue }) => {
    try {
      const response = await http.patch(`/productions/${data.id}`, {
        input: data.input,
        output: data.output,
        packed: data.packed,
        style: data.style,
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

export const updateProductionSlice = createSlice({
  name: "updateProduction",
  initialState: {
    loading: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: {
    [updateProduction.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    [updateProduction.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
    [updateProduction.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    },
  },
});

export const selectUpdateProduction = (state) => state.updateProduction;
export default updateProductionSlice.reducer;
