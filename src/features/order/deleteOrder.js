import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../http-common";

export const deleteOrder = createAsyncThunk(
  "order/delete",
  async (id,{ rejectWithValue }) => {
    try {
      const response = await http.delete(`/orders/${id}`);
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response);
    }
  }
);

export const deleteOrderSlice = createSlice({
  name: "deleteOrder",
  initialState: {
    loading: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: {
    [deleteOrder.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    [deleteOrder.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
    [deleteOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    },
  },
});

export const selectDeleteOrder = (state) => state.deleteOrder;
export default deleteOrderSlice.reducer;
