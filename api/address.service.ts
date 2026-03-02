//RentAnything/api/address.service.ts
import apiClient from './client';

export interface Address {
  id: number;
  address: string;
  mainText?: string;
  secondaryText?: string;
  lat?: number;
  lng?: number;
  placeId?: string;
}

const addressService = {
  create: async (payload: string | Partial<Address>) => {
    const data = typeof payload === 'string' ? { address: payload } : payload;
    const response = await apiClient.post<{ data: Address }>('/addresses', data);
    return response.data.data;
  },

  search: async (query: string) => {
    const response = await apiClient.get<{ data: Address[] }>('/addresses/search', {
      params: { q: query },
    });
    return response.data.data;
  },

  getAll: async () => {
    const response = await apiClient.get<{ data: Address[] }>('/addresses');
    return response.data.data;
  },
};

export default addressService;
