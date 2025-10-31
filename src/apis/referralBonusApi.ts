// apis/referralBonusApi.ts
import axiosInstance from "../utils/axiosInstance";
import { ApiResponse } from "../types/authTypes";

export interface ReferralBonus {
  _id: string;
  level: number;
  from_amount: number;
  to_amount: number | null;
  commission_type: "flat" | "percent";
  commission_value: number;
  is_active: boolean;
  created_by: any;
  updated_by: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReferralBonusData {
  level: number;
  from_amount: number;
  to_amount: number | null;
  commission_type: "flat" | "percent";
  commission_value: number;
}

export const referralBonusApi = {
  // Get all referral bonuses
  getAll: async (
    params?: any
  ): Promise<ApiResponse<{ bonuses: ReferralBonus[]; total: number }>> => {
    const response = await axiosInstance.get("/referral-bonus", { params });
    return response.data;
  },

  // Get by ID
  getById: async (
    id: string
  ): Promise<ApiResponse<{ bonus: ReferralBonus }>> => {
    const response = await axiosInstance.get(`/referral-bonus/${id}`);
    return response.data;
  },

  // Create new bonus
  create: async (
    data: CreateReferralBonusData
  ): Promise<ApiResponse<{ bonus: ReferralBonus }>> => {
    const response = await axiosInstance.post("/referral-bonus", data);
    return response.data;
  },

  // Update bonus
  update: async (
    id: string,
    data: Partial<CreateReferralBonusData>
  ): Promise<ApiResponse<{ bonus: ReferralBonus }>> => {
    const response = await axiosInstance.put(`/referral-bonus/${id}`, data);
    return response.data;
  },

  // Delete bonus
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(`/referral-bonus/${id}`);
    return response.data;
  },

  // Get by level
  getByLevel: async (
    level: number
  ): Promise<ApiResponse<{ bonuses: ReferralBonus[] }>> => {
    const response = await axiosInstance.get(`/referral-bonus/level/${level}`);
    return response.data;
  },

  // Get applicable bonus
  getApplicable: async (
    level: number,
    amount: number
  ): Promise<ApiResponse<{ bonus: ReferralBonus | null }>> => {
    const response = await axiosInstance.get("/referral-bonus/applicable", {
      params: { level, amount },
    });
    return response.data;
  },
};
