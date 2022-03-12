import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../http-common";

export const getAllStyles = createAsyncThunk(
  "styles/fetchAll",
  async (data) => {
    try {
      const response = await http.get(`/styles?po=${data.po_number}&order=${data.order}`);
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      Promise.reject(err.response);
    }
  }
);

export const stylesSlice = createSlice({
  name: "getAllStyles",
  initialState: {
    loading: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: {
    [getAllStyles.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    [getAllStyles.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
    [getAllStyles.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    },
  },
});

export const selectGetAllStyles = (state) => state.getAllStyles;
export default stylesSlice.reducer;
