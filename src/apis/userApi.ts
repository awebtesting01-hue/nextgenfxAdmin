// userApi.ts
import axiosInstance from "../utils/axiosInstance";
import { ApiResponse } from "../types/authTypes";

export type User = {
  _id: string;
  image?: string;
  team?: number;
  display_name?: string;
  email?: string;
  phone_number?: string;
  referral_id?: string;
  isActive?: boolean;
  payment_screenshot?: string;
  total_deposit?: number;
  joined_by_referral_id?: string;
};

export const userApi = {
  // Fetch all users (admin only) with pagination, search, and sort
  getAllUsers: async (
    queryParams?: {
      q?: string;
      page?: number;
      pageSize?: number;
      status?: string;
      sortBy?: string;
      sortOrder?: number;
    },
    config?: any
  ): Promise<
    ApiResponse<{
      users: User[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > => {
    try {
      const response = await axiosInstance.get<
        ApiResponse<{
          users: User[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        }>
      >("/admin/users", {
        params: queryParams,
        ...config,
      });
      return response.data;
    } catch (error: any) {
      let errorMessage = "Failed to fetch users";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.statusText ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  // Fetch a single user by ID (POST body)
  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    try {
      const response = await axiosInstance.post<ApiResponse<User>>(
        "/user/get-profile",
        { id }
      );
      return response.data;
    } catch (error: any) {
      let errorMessage = "Failed to fetch user";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.statusText ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  toggleUserStatus: async (userId: string, toggle_value: boolean) => {
    try {
      const response = await axiosInstance.post(`/admin/users/toggle-status`, {
        userId,
        toggle_value,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};
