// addWallet.api.ts
import axiosInstance from "../utils/axiosInstance";
import { ApiResponse } from "../types/authTypes";

// Define AddWalletRequest type if not already
export interface AddWalletRequest {
  _id: string;
  userId: {
    _id: string;
    email: string;
    display_name: string;
  };
  totalPayable: number;
  transactionCharge: number;
  receiveAmount: number;
  screenshotUrls: string[];
  user_remarks: string;
  admin_remarks?: string;
  transferType: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export const addWalletApi = {
  getAddWalletRequests: async (): Promise<ApiResponse<AddWalletRequest[]>> => {
    try {
      const token = localStorage.getItem("adminAccessToken");
      const response = await axiosInstance.get<ApiResponse<AddWalletRequest[]>>(
        "/admin/get-add-wallets-requests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Fetch AddWallet requests error:", error);
      throw error.response?.data?.message || error.message;
    }
  },

  updateAddWalletRequest: async (
    id: string,
    payload: {
      admin_remarks?: string;
      status?: "pending" | "approve" | "reject";
    }
  ): Promise<ApiResponse<AddWalletRequest>> => {
    try {
      const token = localStorage.getItem("adminAccessToken");
      const response = await axiosInstance.put<ApiResponse<AddWalletRequest>>(
        `/admin/update-add-wallets/${id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Update AddWallet request error:", error);
      throw error.response?.data?.message || error.message;
    }
  },
};
