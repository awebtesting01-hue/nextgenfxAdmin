import axiosInstance from "../utils/axiosInstance";

export const withdrawalRequestApi = {
  /**
   * Create a new withdrawal request
   */
  createWithdrawal: async (
    withdrawalData: any // ✅ replaced WithdrawalData with any
  ): Promise<any> => {
    // ✅ replaced WithdrawalResponse with any
    try {
      const response = await axiosInstance.post<{ data: any }>(
        "/user/create-withdrawl",
        withdrawalData
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Get all withdrawal requests
   */
  getAllWithdrawals: async (): Promise<any[]> => {
    // ✅ replaced WithdrawalResponse[] with any[]
    try {
      const response = await axiosInstance.get<{
        data: any[];
        success: boolean;
        message: string;
      }>("/user/get-all-withdrawl");

      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Update a withdrawal request status by ID
   * @param id - Withdrawal ID
   * @param status - "approved" | "rejected"
   */
  updateWithdrawalStatus: async (
    id: string,
    status: "approved" | "rejected"
  ): Promise<any> => {
    // ✅ replaced WithdrawalResponse with any
    console.log({ id, status });
    try {
      const response = await axiosInstance.put<{ data: any }>(
        `/user/update-withdrawl-by-id/${id}`,
        { status }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};
