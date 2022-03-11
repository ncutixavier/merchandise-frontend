import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../http-common";

export const updateOrder = createAsyncThunk(
  "order/update",
  async (data,{ rejectWithValue }) => {
    try {
      const response = await http.patch(`/orders/${data.id}`, {
        buyer: data.buyer,
        quantity: data.quantity,
        colors: data.colors,
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

export const updateOrderSlice = createSlice({
  name: "updateOrder",
  initialState: {
    loading: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: {
    [updateOrder.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    [updateOrder.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
    [updateOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    },
  },
});

export const selectUpdateOrder = (state) => state.updateOrder;
export default updateOrderSlice.reducer;
