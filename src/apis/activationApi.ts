// activationApi.ts
import axiosInstance from "../utils/axiosInstance";
import { ApiResponse } from "../types/authTypes";

export type ActivationFee = {
  _id: string;
  fromAmount: number;
  toAmount: number | null;
  type: "flat" | "percent";
  value: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export const activationApi = {
  // Fetch all activation fees
  getAllFees: async (): Promise<ApiResponse<any[]>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<any[]>>(
        "/admin/activation-fees"
      );
      return response.data;
    } catch (error: any) {
      let errorMessage = "Failed to fetch activation fees";
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

  // Create a new activation fee
  createFee: async (fee: {
    fromAmount: number;
    toAmount?: number | null;
    type: "flat" | "percent";
    value: number;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post<ApiResponse<any>>(
        "/admin/activation-fees",
        fee
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Delete an activation fee by ID
  deleteFee: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `/admin/activation-fees/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Update an existing activation fee
  updateFee: async (
    id: string,
    fee: {
      fromAmount: number;
      toAmount?: number | null;
      type: "flat" | "percent";
      value: number;
    }
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.put<ApiResponse<any>>(
        `/admin/activation-fees/${id}`,
        fee
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};
