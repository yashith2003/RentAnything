
import apiClient from './client';

export interface Category {
  id: number;
  name: string;
  image?: any;
  subCategories?: Category[];
  parentCategory?: Category;
}

const categoryService = {
  getAll: async () => {
    const response = await apiClient.get<{ data: Category[] }>('/categories');
    return response.data.data;
  },
};

export default categoryService;
