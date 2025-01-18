import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/AxiosConfig";

export const getUserByEmail = createAsyncThunk(
  "user/getUserByEmail",
  async () => {
    try {
      const email = localStorage.getItem("email");
      const token = localStorage.getItem("token");

      const response = await axiosInstance.post(
        "/user/user",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, user }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.put(`/user/update/${id}`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      return error;
    }
  }
);

export const updateImage = createAsyncThunk(
  'user/updateImage',
  async ({file, id}) => {
      const token = localStorage.getItem("token");
      
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        const response = await axiosInstance.patch(`/user/update-image/${id}`, formData, {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
          },
        });
        return response.data;
      } catch (error) {
        return error;
      }
  }
)

const UserSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getUserByEmail
      .addCase(getUserByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserByEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getUserByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateUser
      .addCase(updateImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default UserSlice.reducer;
