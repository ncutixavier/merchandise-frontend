import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../http-common";

export const logout = createAsyncThunk(
  "auth/logout",
  async () => {
    try {
      const response = await http.post("/auth/logout");
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return Promise.reject(err.response);
    }
  }
);

export const logoutSlice = createSlice({
  name: "logout",
  initialState: {
    loading: false,
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: {
    [logout.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    [logout.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
    [logout.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    },
  },
});

export const selectLogout = (state) => state.logout;
export default logoutSlice.reducer;
