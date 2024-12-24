import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "admin/login",
  async (formdata, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/auth/admin-login`,
        formdata
      );
      return res.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message || "Something went wrong!");
    }
  }
);

export const submitSchedule = createAsyncThunk(
  "schedule/invites",
  async (scheduleData) => {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URI}/api/schedule/meetings`,
      scheduleData
    );
    return res.data;
  }
);

export const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    employeesData: [],
    adminEmail: null,
    loading: false,
    error: null,
    scheduleSent: false,
  },
  reducers: {
    toggleScheduleSent: (state) => {
      state.scheduleSent = !state.scheduleSent; 
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.employeesData = action.payload.allEmployees;
      state.adminEmail = action.payload.adminEmail;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(submitSchedule.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(submitSchedule.fulfilled, (state) => {
      state.loading = false;
      state.scheduleSent = true;
    });
    builder.addCase(submitSchedule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const getEmployeesData = (state) => state.employees.employeesData;
export const getLoadingState = (state) => state.employees.loading;
export const getErrorMessage = (state) => state.employees.error;
export const getScheduleSentState = (state) => state.employees.scheduleSent;
export const getAdminEmail = (state) => state.employees.adminEmail;
export const { toggleScheduleSent } = employeesSlice.actions;

export default employeesSlice.reducer;
