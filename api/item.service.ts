// api/item.service.ts
import apiClient from './client';

export interface Item {
  id: number;
  title: string;
  description: string;
  condition: string;
  status: string;
  phone?: string;
  rentalTerms?: string;
  instructions?: string;
  securityDeposit?: number;
  imageUrl?: string;
  price?: number | string;
  owner?: {
    fullName: string;
  };
  address?: {
    id: number;
    address: string;
  };
}

export interface CreateAvailabilityDto {
  availableDate: string;
  startTime?: string;
  endTime?: string;
  isAvailable?: boolean;
}

export interface CreateItemDto {
  title: string;
  description: string;
  categoryId: number;
  addressId: number;
  condition?: string;
  phone?: string;
  rentalTerms?: string;
  instructions?: string;
  securityDeposit?: number;
  imageUrl?: string;
  rateType?: string;
  price?: number;
  availabilities?: CreateAvailabilityDto[];
}

const itemService = {
  create: async (data: CreateItemDto) => {
    const response = await apiClient.post<{ data: Item }>('/items', data);
    return response.data.data;
  },

  getItems: async (category?: string) => {
    const url = category ? `/items?cat=${category}` : '/items';
    const response = await apiClient.get<{ data: Item[] }>(url);
    return response.data.data;
  },

  getItem: async (id: number) => {
    const response = await apiClient.get<{ data: Item }>(`/items/${id}`);
    return response.data.data;
  },

  getMyItems: async () => {
    const response = await apiClient.get<{ data: Item[] }>(`/items/my-items`);
    return response.data.data;
  },
};

export default itemService;
