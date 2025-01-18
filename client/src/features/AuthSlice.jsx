import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/AxiosConfig";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (register) => {
    try {
      const response = await axiosInstance.post("/auth/register", register);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const loginUser = createAsyncThunk("auth/login", async (login) => {
  try {
    const response = await axiosInstance.post("/auth/login", login);
    return response.data;
  } catch (error) {
    return error;
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  return {};
});

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action.payload)
        if (action.payload.status === 200) {
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("email", action.payload.email);
        }
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // logout
      .addCase(logout.fulfilled, (state) => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
      });
  },
});

export default AuthSlice.reducer;
