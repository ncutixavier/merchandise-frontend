import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../http-common";

export const deletePurchaseOrder = createAsyncThunk(
  "PurchaseOrder/delete",
  async (data,{ rejectWithValue }) => {
    try {
      const response = await http.delete(
        `/orders/${data.id}/purchaseorder/${data.purchaseOrderId}`
      );
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response);
    }
  }
);

export const deletePurchaseOrderSlice = createSlice({
  name: "deletePurchaseOrder",
  initialState: {
    loading: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: {
    [deletePurchaseOrder.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    [deletePurchaseOrder.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
    [deletePurchaseOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    },
  },
});

export const selectDeletePurchaseOrder = (state) => state.deletePurchaseOrder;
export default deletePurchaseOrderSlice.reducer;
