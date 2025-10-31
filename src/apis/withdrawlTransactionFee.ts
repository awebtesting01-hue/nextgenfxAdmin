// withdrawalChargeTransactionFeeApi.ts
import axiosInstance from "../utils/axiosInstance";
import { ApiResponse } from "../types/authTypes";

export type WithdrawalChargeTransactionFee = {
  _id: string;
  fromAmount: number;
  toAmount: number | null;
  type: "flat" | "percent";
  value: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export const withdrawalChargeTransactionFeeApi = {
  // Fetch all withdrawal charge transaction fees
  getAllFees: async (): Promise<
    ApiResponse<WithdrawalChargeTransactionFee[]>
  > => {
    try {
      const response = await axiosInstance.get<
        ApiResponse<WithdrawalChargeTransactionFee[]>
      >("/admin/get-all-withdrawl");
      return response.data;
    } catch (error: any) {
      let errorMessage = "Failed to fetch withdrawal transaction fees";
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

  // Create a new withdrawal charge transaction fee
  createFee: async (fee: {
    fromAmount: number;
    toAmount?: number | null;
    type: "flat" | "percent";
    value: number;
  }): Promise<ApiResponse<WithdrawalChargeTransactionFee>> => {
    try {
      const response = await axiosInstance.post<
        ApiResponse<WithdrawalChargeTransactionFee>
      >("/admin/create-withdrawl", fee);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Get a single withdrawal charge transaction fee by ID
  getFee: async (
    id: string
  ): Promise<ApiResponse<WithdrawalChargeTransactionFee>> => {
    try {
      const response = await axiosInstance.get<
        ApiResponse<WithdrawalChargeTransactionFee>
      >(`/admin/get-withdrawl-by-id/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Update a withdrawal charge transaction fee by ID
  updateFee: async (
    id: string,
    fee: {
      fromAmount: number;
      toAmount?: number | null;
      type: "flat" | "percent";
      value: number;
    }
  ): Promise<ApiResponse<WithdrawalChargeTransactionFee>> => {
    try {
      const response = await axiosInstance.put<
        ApiResponse<WithdrawalChargeTransactionFee>
      >(`/admin/update-withdrawl-by-id/${id}`, fee);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Delete a withdrawal charge transaction fee by ID
  deleteFee: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `/admin/delete-withdrawl-by-id/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};
