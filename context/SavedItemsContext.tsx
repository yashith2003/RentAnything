//RentAnything/context/SavedItemsContext.tsx

import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useGetSavedItemsQuery, useToggleSaveItemMutation } from '../api/savedItemApi';
import { useUser } from './userContext';

export interface SavedItem {
  id: number | string;
  imageUrl: string | null | undefined;
  title: string;
  description: string;
  status: string;
  deliveryAvailable: boolean;
  phone?: string;
  category: { id: number; name: string };
  owner: { id: number; phone: string; individualUser?: { firstName: string; lastName: string } };
}

interface SavedItemsContextType {
  savedItems: any[];
  isLoading: boolean;
  toggleItem: (id: number) => Promise<void>;
  isSaved: (id: number) => boolean;
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined);

export const SavedItemsProvider = ({ children }: { children: ReactNode }) => {
  const { token, isLoading: isLoadingUser } = useUser();
  const {
    data: rawSavedItems = [],
    isLoading: isQueryLoading,
    error,
    refetch
  } = useGetSavedItemsQuery(undefined, {
    skip: isLoadingUser || !token,
  });

  const isLoading = isLoadingUser || isQueryLoading;

  if (error) {
    console.error('[SavedItemsCtx] getSavedItems error:', JSON.stringify(error, null, 2));
  }

  const [toggleSave] = useToggleSaveItemMutation();

  // Track IDs removed optimistically — avoids copying server state into useState
  const [removedIds, setRemovedIds] = useState<Set<number>>(new Set());

  // Derive saved items from server data, filtered by optimistic removals
  const savedItems = useMemo(() => {
    // console.log('[SavedItemsCtx] rawSavedItems:', Array.isArray(rawSavedItems) ? `array[${rawSavedItems.length}]` : typeof rawSavedItems, rawSavedItems);
    if (!Array.isArray(rawSavedItems)) return [];
    const result = rawSavedItems
      .filter((si: any) => si?.item && !removedIds.has(Number(si.item.id)))
      .map((si: any) => ({
        ...si.item,
        savedId: si.id,
        createdAt: si.createdAt,
      }));
    console.log('[SavedItemsCtx] computed savedItems count:', result.length);
    return result;
  }, [rawSavedItems, removedIds]);

  const toggleItem = async (id: number) => {
    const exists = savedItems.some((item: any) => Number(item.id) === Number(id));
    try {
      if (exists) {
        // Optimistically hide immediately
        setRemovedIds(prev => new Set(prev).add(id));
        await toggleSave(id).unwrap();
        // Server confirmed — clean up the removed set and re-sync
        setRemovedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
        await refetch();
      } else {
        // For adds, just call the server and refetch
        await toggleSave(id).unwrap();
        await refetch();
      }
    } catch (error) {
      console.error('Failed to toggle save item:', error);
      // Revert optimistic removal on error
      setRemovedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    }
  };

  const isSaved = (id: number) =>
    savedItems.some((item: any) => Number(item.id) === Number(id));

  const value = useMemo(() => ({
    savedItems,
    isLoading,
    toggleItem,
    isSaved,
  }), [savedItems, isLoading]);

  return (
    <SavedItemsContext.Provider value={value}>
      {children}
    </SavedItemsContext.Provider>
  );
};

export const useSavedItems = () => {
  const context = useContext(SavedItemsContext);
  if (!context) {
    throw new Error('useSavedItems must be used within a SavedItemsProvider');
  }
  return context;
};
