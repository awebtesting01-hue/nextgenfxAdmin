import axiosInstance from "../utils/axiosInstance";

export const monthlyProfitShareApi = {
  /**
   * ✅ Create a new Monthly Profit Share slab
   */
  createProfitShare: async (profitShareData: any): Promise<any> => {
    try {
      const response = await axiosInstance.post<{ data: any }>(
        "admin/daily/profit/share",
        profitShareData
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * ✅ Get all Monthly Profit Share slabs
   */
  getAllProfitShares: async (): Promise<any[]> => {
    try {
      const response = await axiosInstance.get<{
        data: any[];
        success: boolean;
        message: string;
      }>("admin/daily/profit/share");

      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * ✅ Get Monthly Profit Share by ID
   * @param id - Profit Share ID
   */
  getProfitShareById: async (id: string): Promise<any> => {
    try {
      const response = await axiosInstance.get<{ data: any }>(
        `admin/daily/profit/share/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * ✅ Update Monthly Profit Share by ID
   * @param id - Profit Share ID
   */
  updateProfitShare: async (id: string, updateData: any): Promise<any> => {
    try {
      const response = await axiosInstance.put<{ data: any }>(
        `admin/daily/profit/share/${id}`,
        updateData
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * ✅ Delete Monthly Profit Share by ID
   * @param id - Profit Share ID
   */
  deleteProfitShare: async (id: string): Promise<any> => {
    try {
      const response = await axiosInstance.delete<{ data: any }>(
        `admin/daily/profit/share/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * ✅ Get Monthly Profit Share by amount range
   * Example usage: getProfitShareByRange(100) or getProfitShareByRange(100, 200)
   */
  getProfitShareByRange: async (from?: number, to?: number): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (from) params.append("from", from.toString());
      if (to) params.append("to", to.toString());

      const response = await axiosInstance.get<{ data: any }>(
        `admin/daily/profit/share/get/by/amount?${params.toString()}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};
