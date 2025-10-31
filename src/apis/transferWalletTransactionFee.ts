// transactionFeeApi.ts
import axiosInstance from "../utils/axiosInstance";
import { ApiResponse } from "../types/authTypes";

export type TransactionFee = {
  _id: string;
  fromAmount: number;
  toAmount: number | null;
  type: "flat" | "percent";
  value: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export const transactionFeeApiTransferWallet = {
  // Fetch all transaction fees
  getAllFees: async (): Promise<ApiResponse<TransactionFee[]>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<TransactionFee[]>>(
        "/admin/wallet-transaction-fees/transfer"
      );
      return response.data;
    } catch (error: any) {
      let errorMessage = "Failed to fetch transaction fees";
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

  // Create a new transaction fee
  createFee: async (fee: {
    fromAmount: number;
    toAmount?: number | null;
    type: "flat" | "percent";
    value: number;
  }): Promise<ApiResponse<TransactionFee>> => {
    try {
      const response = await axiosInstance.post<ApiResponse<TransactionFee>>(
        "/admin/wallet-transaction-fees/transfer",
        fee
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Get a single transaction fee by ID
  getFee: async (id: string): Promise<ApiResponse<TransactionFee>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<TransactionFee>>(
        `/admin/wallet-transaction/transfer/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Update a transaction fee by ID
  updateFee: async (
    id: string,
    fee: {
      fromAmount: number;
      toAmount?: number | null;
      type: "flat" | "percent";
      value: number;
    }
  ): Promise<ApiResponse<TransactionFee>> => {
    try {
      const response = await axiosInstance.put<ApiResponse<TransactionFee>>(
        `/admin/wallet-transaction/transfer/${id}`,
        fee
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Delete a transaction fee by ID
  deleteFee: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `/admin/wallet-transaction/transfer/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};
