//RentAnything/api/category.service.ts

import { apiSlice } from './apiSlice';

export interface Category {
  id: number;
  name: string;
  image?: any;
  subCategories?: Category[];
  parentCategory?: Category;
}

export interface FilterConfig {
  id: number;
  label: string;
  key: string;
  type: 'select' | 'multi-select' | 'range' | 'toggle' | 'text' | 'slider' | 'date' | 'color-select';
  options: any[];
  categoryId: number;
}

export const categoryApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      transformResponse: (response: { data: Category[] }) => response.data,
      providesTags: ['Category'],
    }),
    getCategoryFilters: builder.query<FilterConfig[], number>({
      query: (categoryId) => `/categories/${categoryId}/filters`,
      transformResponse: (response: { data: FilterConfig[] }) => response.data,
      providesTags: (result, error, id) => [{ type: 'Category', id: `FILTERS_${id}` }],
    }),
  }),
});

export const { useGetCategoriesQuery, useGetCategoryFiltersQuery } = categoryApi;

import { Config } from '@/constants/config';

// Keeping legacy export for minimal breakage during transition, though it's now just a wrapper
const categoryService = {
  getAll: async () => {
    // This is a temporary bridge, components should move to useGetCategoriesQuery
    const response = await fetch(`${Config.API_URL}/categories`).then(res => res.json());
    return response.data;
  },
};

export default categoryService;
