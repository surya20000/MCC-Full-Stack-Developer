import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./reducer/employeesSlice.js";

export default configureStore({
  reducer: {
    employees: employeeReducer,
  },
});
