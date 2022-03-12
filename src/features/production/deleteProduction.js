import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../http-common";

export const deleteProduction = createAsyncThunk(
  "production/delete",
  async (id,{ rejectWithValue }) => {
    try {
      const response = await http.delete(`/productions/${id}`);
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response);
    }
  }
);

export const deleteProductionSlice = createSlice({
  name: "deleteProduction",
  initialState: {
    loading: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: {
    [deleteProduction.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    [deleteProduction.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
    [deleteProduction.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    },
  },
});

export const selectDeleteProduction = (state) => state.deleteProduction;
export default deleteProductionSlice.reducer;
