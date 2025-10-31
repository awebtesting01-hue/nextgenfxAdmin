// authApi.ts
import axiosInstance from "../utils/axiosInstance";
import { LoginResponse, Admin, ApiResponse } from "../types/authTypes";

export const adminAuthApi = {
  // Admin login
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axiosInstance.post<LoginResponse>("/admin/login", {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      console.log("Login error:", error);
      let errorMessage = "Login failed";

      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage =
            error.response.statusText ||
            `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  // Refresh token
  refreshToken: async (
    refreshToken: string
  ): Promise<{ accessToken: string }> => {
    try {
      const response = await axiosInstance.post<{ accessToken: string }>(
        "/admin/refresh-token",
        {
          refreshToken,
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      const response = await axiosInstance.post("/admin/logout");
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || error.message;
    }
  },
};

export const adminApi = {
  getProfile: async (): Promise<ApiResponse<Admin>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Admin>>(
        "/admin/profile"
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || error.message;
    }
  },
};
