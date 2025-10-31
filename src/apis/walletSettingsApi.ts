// src/api/walletApi.ts
import axiosInstance from "../utils/axiosInstance";
import { ApiResponse } from "../types/authTypes";

// Wallet type
export interface WalletSetting {
  _id: string;
  name: string;
  address: string;
  network: string;
  nodeUrl: string;
  description?: string;
  tokenSymbol?: string;
  tokenContract?: string; // BEP20 contract address (for USDT etc.)
  tokenDecimals?: number;
}

// Helper to attach auth header
const authHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const walletApi = {
  // Get all wallets
  getAll: async (): Promise<ApiResponse<WalletSetting[]>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<WalletSetting[]>>(
        "/admin/wallets",
        authHeaders()
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.response?.statusText ||
          error.message ||
          "Failed to fetch wallets"
      );
    }
  },

  // Get one wallet
  getOne: async (id: string): Promise<ApiResponse<WalletSetting>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<WalletSetting>>(
        `/admin/wallets/${id}`,
        authHeaders()
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Create wallet
  create: async (wallet: {
    name: string;
    address: string;
    network: string;
    nodeUrl?: string;
    description?: string;
    tokenSymbol?: string;
    tokenContract?: string;
    tokenDecimals?: number;
  }): Promise<ApiResponse<WalletSetting>> => {
    try {
      const response = await axiosInstance.post<ApiResponse<WalletSetting>>(
        "/admin/wallets",
        wallet,
        authHeaders()
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Update wallet
  update: async (
    id: string,
    wallet: Partial<WalletSetting>
  ): Promise<ApiResponse<WalletSetting>> => {
    try {
      const response = await axiosInstance.put<ApiResponse<WalletSetting>>(
        `/admin/wallets/${id}`,
        wallet,
        authHeaders()
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Delete wallet
  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `/admin/wallets/${id}`,
        authHeaders()
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};
