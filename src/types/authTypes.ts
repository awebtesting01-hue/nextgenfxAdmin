// types/authTypes.ts
export interface Admin {
  _id: string;
  display_name: string;
  email: string;
  phone_number: number;
  ip_address: string;
  avatar: string;
  status: "active" | "inactive" | "suspended";
  roles: "superAdmin" | "admin" | "moderator";
  total_wallet_balance: number;
  total_withdrawl: number;
  referral_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  last_login: string;
}

export interface LoginResponse {
  statusCode: number;
  data: {
    admin: Admin;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}
