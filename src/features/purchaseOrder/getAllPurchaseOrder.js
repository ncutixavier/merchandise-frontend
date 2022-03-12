import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../http-common";

export const getAllPurchaseOrder = createAsyncThunk(
  "purchaseOrder/fetchAll",
  async (id) => {
    try {
      const response = await http.get(`/orders/${id}/purchaseorder`);
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      Promise.reject(err.response);
    }
  }
);

export const purchaseOrderSlice = createSlice({
  name: "getAllPurchaseOrder",
  initialState: {
    loading: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: {
    [getAllPurchaseOrder.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    [getAllPurchaseOrder.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
    [getAllPurchaseOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    },
  },
});

export const selectGetAllPurchaseOrder = (state) => state.getAllPurchaseOrder;
export default purchaseOrderSlice.reducer;
