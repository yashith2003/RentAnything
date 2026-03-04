//RentAnything/hooks/useSearch.ts
import { useState, useEffect } from 'react';
import { useSearchItemsQuery } from '../api/item.service';

export const useSearch = (categoryId?: number, initialLimit: number = 20, filters: any = {}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);

  // Removed automatic debounce to honor manual trigger (search icon/enter key)
  // Search will only update when triggerSearch() is called

  const triggerSearch = (searchVal?: string) => {
    const finalQuery = searchVal !== undefined ? searchVal : query;
    setDebouncedQuery(finalQuery);
    setPage(1);
  };

  const { data: response, isLoading, isFetching, error, refetch } = useSearchItemsQuery(
    { 
      q: debouncedQuery, 
      category: categoryId, 
      page, 
      limit: initialLimit,
      ...filters
    },
    { skip: debouncedQuery.length === 0 && !categoryId }
  );

  const results = response?.items || [];
  const total = response?.total || 0;

  const loadMore = () => {
    if (!isLoading && !isFetching && results.length < total) {
      setPage(prev => prev + 1);
    }
  };

  return {
    query,
    setQuery,
    debouncedQuery,
    triggerSearch,
    results,
    total,
    isLoading,
    isFetching,
    error,
    loadMore,
    hasMore: results.length < total,
    refetch,
  };
};
