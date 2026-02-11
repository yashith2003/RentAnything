// api/item.service.ts
import apiClient from './client';

export interface Item {
  id: number;
  title: string;
  description: string;
  condition: string;
  status: string;
  price?: number | string;
  image?: string;
  owner?: {
    fullName: string;
  };
  address?: {
    address: string;
  };
  rating?: string | number;
  distance?: string;
}

const itemService = {
  getItems: async (category?: string) => {
    const url = category ? `/items?cat=${category}` : '/items';
    const response = await apiClient.get<{ data: Item[] }>(url);
    return response.data.data;
  },

  getItem: async (id: number) => {
    const response = await apiClient.get<{ data: Item }>(`/items/${id}`);
    return response.data.data;
  },
};

export default itemService;
