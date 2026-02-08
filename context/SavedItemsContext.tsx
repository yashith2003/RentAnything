import React, { createContext, ReactNode, useContext, useState } from 'react';

// Define the structure of a saved item
// This should roughly match the structure expected by SavedScreen and ItemCard
export interface SavedItem {
  id: number | string;
  image: string;
  title: string;
  price: string;
  extraPrice: string;
  owner: string;
  rating: string | number;
  distance: string;
  location: string;
  delivery: boolean;
  deliveryAvailable?: boolean; // For compatibility
}

interface SavedItemsContextType {
  savedItems: SavedItem[];
  addItem: (item: SavedItem) => void;
  removeItem: (id: number | string) => void;
  isSaved: (id: number | string) => boolean;
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined);

export const SavedItemsProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with some dummy data if needed, or empty array
  const [savedItems, setSavedItems] = useState<SavedItem[]>([
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1524338198850-8a2ff63aaceb?q=80&w=400&auto=format&fit=crop', // Security Camera
        title: 'Tesla Model S',
        price: 'Rs:1000',
        extraPrice: '- Per day',
        owner: 'Malith Perera',
        rating: '5.0',
        distance: '5.6 km',
        location: 'Nugegoda',
        delivery: true,
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1599727402636-1e96a40a233b?q=80&w=400&auto=format&fit=crop', // Plastic Barrels
        title: 'Tesla Model S',
        price: 'Rs:1000',
        extraPrice: '- Per day | Rs: 1500 - 2 days',
        owner: 'Malith Perera',
        rating: '5.0',
        distance: '5.6 km',
        location: 'Nugegoda',
        delivery: true,
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1519326844852-704caea5679e?q=80&w=400&auto=format&fit=crop', // Heater (Assuming heater)
        title: 'Tesla Model S',
        price: 'Rs:1000',
        extraPrice: '- 1 day',
        owner: 'Malith Perera',
        rating: '5.0',
        distance: '5.6 km',
        location: 'Nugegoda',
        delivery: true,
      },
      {
        id: 4,
        image: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?q=80&w=400&auto=format&fit=crop', // Sledgehammer
        title: 'Tesla Model S',
        price: 'Rs:1000',
        extraPrice: '- 1 day | Rs: 1500 - 2 days',
        owner: 'Malith Perera',
        rating: '5.0',
        distance: '5.6 km',
        location: 'Nugegoda',
        delivery: true,
      },
  ]);

  const addItem = (item: SavedItem) => {
    setSavedItems((prev) => {
      if (!prev.find((i) => i.id === item.id)) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const removeItem = (id: number | string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const isSaved = (id: number | string) => {
    return savedItems.some((item) => item.id === id);
  };

  return (
    <SavedItemsContext.Provider value={{ savedItems, addItem, removeItem, isSaved }}>
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
