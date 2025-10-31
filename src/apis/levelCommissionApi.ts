// apis/levelCommissionApi.ts
import axiosInstance from "../utils/axiosInstance";
import { ApiResponse } from "../types/authTypes";

export interface LevelCommission {
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

export interface CreateLevelCommissionData {
  level: number;
  from_amount: number;
  to_amount: number | null;
  commission_type: "flat" | "percent";
  commission_value: number;
}

export const levelCommissionApi = {
  // Get all level commissions
  getAll: async (
    params?: any
  ): Promise<
    ApiResponse<{ commissions: LevelCommission[]; total: number }>
  > => {
    const response = await axiosInstance.get("/level-commissions", { params });
    return response.data;
  },

  // Get by ID
  getById: async (
    id: string
  ): Promise<ApiResponse<{ commission: LevelCommission }>> => {
    const response = await axiosInstance.get(`/level-commissions/${id}`);
    return response.data;
  },

  // Create new commission
  create: async (
    data: CreateLevelCommissionData
  ): Promise<ApiResponse<{ commission: LevelCommission }>> => {
    const response = await axiosInstance.post("/level-commissions", data);
    return response.data;
  },

  // Update commission
  update: async (
    id: string,
    data: Partial<CreateLevelCommissionData>
  ): Promise<ApiResponse<{ commission: LevelCommission }>> => {
    const response = await axiosInstance.put(`/level-commissions/${id}`, data);
    return response.data;
  },

  // Delete commission
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(`/level-commissions/${id}`);
    return response.data;
  },

  // Get by level
  getByLevel: async (
    level: number
  ): Promise<ApiResponse<{ commissions: LevelCommission[] }>> => {
    const response = await axiosInstance.get(
      `/level-commissions/level/${level}`
    );
    return response.data;
  },

  // Get applicable commission
  getApplicable: async (
    level: number,
    amount: number
  ): Promise<ApiResponse<{ commission: LevelCommission | null }>> => {
    const response = await axiosInstance.get("/level-commissions/applicable", {
      params: { level, amount },
    });
    return response.data;
  },
};
