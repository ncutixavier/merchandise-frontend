import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../http-common";

export const addNewPurchaseOrder = createAsyncThunk(
  "PurchaseOrder/add",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.post(`/orders/${id}/purchaseorder`);
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response);
    }
  }
);

export const addNewPurchaseOrderSlice = createSlice({
  name: "addNewPurchaseOrder",
  initialState: {
    loading: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: {
    [addNewPurchaseOrder.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    [addNewPurchaseOrder.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
    [addNewPurchaseOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    },
  },
});

export const selectAddNewPurchaseOrder = (state) => state.addNewPurchaseOrder;
export default addNewPurchaseOrderSlice.reducer;
