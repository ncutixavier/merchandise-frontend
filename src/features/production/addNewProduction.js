import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../http-common";

export const addNewProduction = createAsyncThunk(
  "production/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/productions?po=${data.po}`, {
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

export const addNewProductionSlice = createSlice({
  name: "addNewProduction",
  initialState: {
    loading: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: {
    [addNewProduction.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    [addNewProduction.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
    [addNewProduction.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    },
  },
});

export const selectAddNewProduction = (state) => state.addNewProduction;
export default addNewProductionSlice.reducer;
