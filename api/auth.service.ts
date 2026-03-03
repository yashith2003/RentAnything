//RentAnything/api/auth.service.ts
import apiClient from './client';

export interface RegisterIndividualDto {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  lat?: number;
  lng?: number;
  placeId?: string;
}

export interface RegisterCompanyDto {
  companyName: string;
  registrationNumber: string;
  email: string;
  phone: string;
  officeAddress: string;
  lat?: number;
  lng?: number;
  placeId?: string;
}

export interface LoginResponse {
  message: string;
  phone: string;
}

export interface VerifyOtpResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    phone: string;
    role: 'individual' | 'company';
    name: string;
  };
}

const authService = {
  registerIndividual: async (data: RegisterIndividualDto) => {
    const response = await apiClient.post<{ data: any }>('/auth/register/individual', data);
    return response.data.data;
  },

  registerCompany: async (data: RegisterCompanyDto) => {
    const response = await apiClient.post<{ data: any }>('/auth/register/company', data);
    return response.data.data;
  },

  login: async (phone: string) => {
    const response = await apiClient.post<{ data: LoginResponse }>('/auth/login', { phone });
    return response.data.data;
  },

  verifyOtp: async (phone: string, otp: string) => {
    const response = await apiClient.post<{ data: VerifyOtpResponse }>('/auth/verify-otp', { phone, otp });
    return response.data.data;
  },

  resendOtp: async (phone: string) => {
    const response = await apiClient.post<{ data: any }>('/auth/resend-otp', { phone });
    return response.data.data;
  },

  checkEmail: async (email: string) => {
    const response = await apiClient.post<{ data: { available: boolean } }>('/auth/check-email', { email });
    return response.data.data;
  },

  getProfile: async () => {
    const response = await apiClient.get<{ data: any }>('/user/profile');
    return response.data.data;
  },
  
  loginGuest: async () => {
    const response = await apiClient.post<{ data: { access_token: string; user: any } }>('/auth/login-guest');
    return response.data.data;
  },
};

export default authService;
