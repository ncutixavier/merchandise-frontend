import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../http-common";

export const addNewStyle = createAsyncThunk(
  "style/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post("/styles", data);
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response);
    }
  }
);

export const addNewStyleSlice = createSlice({
  name: "addNewStyle",
  initialState: {
    loading: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: {
    [addNewStyle.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    [addNewStyle.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
    [addNewStyle.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    },
  },
});

export const selectAddNewStyle = (state) => state.addNewStyle;
export default addNewStyleSlice.reducer;
