import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../http-common";

export const getAllOrders = createAsyncThunk(
  "order/fetchAll",
  async () => {
    try {
      const response = await http.get("/orders");
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      Promise.reject(err.response);
    }
  }
);

export const orderSlice = createSlice({
  name: "getAllOrders",
  initialState: {
    loading: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: {
    [getAllOrders.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    [getAllOrders.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
    [getAllOrders.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    },
  },
});

export const selectGetAllOrders = (state) => state.getAllOrders;
export default orderSlice.reducer;
