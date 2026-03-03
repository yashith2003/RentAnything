//RentAnything/api/filter.service.ts

import apiClient from './client';

export interface FilterConfig {
  id: number;
  label: string;
  key: string;
  type: 'select' | 'multi-select' | 'range' | 'toggle' | 'text' | 'slider' | 'date' | 'color-select';
  options: any[];
  categoryId: number;
}

class FilterService {
  async getFiltersByCategory(categoryId: number): Promise<FilterConfig[]> {
    try {
      const response = await apiClient.get<{ data: FilterConfig[] }>(`/categories/${categoryId}/filters`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch filters for category ${categoryId}:`, error);
      return [];
    }
  }
}

export default new FilterService();
