import React, { useMemo } from 'react';
import { View } from 'react-native';
import { VehicleDetails } from './categories/VehicleDetails';
import { ElectronicsDetails } from './categories/ElectronicsDetails';
import { HomeDetails } from './categories/HomeDetails';
import { FashionDetails } from './categories/FashionDetails';
import { SportsDetails } from './categories/SportsDetails';

// Senior-level pattern: Component map for O(1) lookup
const CATEGORY_COMPONENTS: Record<string, React.FC<{ item: any }>> = {
  vehicle: VehicleDetails,
  car: VehicleDetails,
  bike: VehicleDetails,
  scooter: VehicleDetails,
  truck: VehicleDetails,
  cycle: VehicleDetails,
  electronics: ElectronicsDetails,
  phone: ElectronicsDetails,
  computer: ElectronicsDetails,
  tablet: ElectronicsDetails,
  camera: ElectronicsDetails,
  headphone: ElectronicsDetails,
  home: HomeDetails,
  furniture: HomeDetails,
  appliance: HomeDetails,
  decoration: HomeDetails,
  kitchen: HomeDetails,
  bedding: HomeDetails,
  fashion: FashionDetails,
  cloth: FashionDetails,
  shoe: FashionDetails,
  men: FashionDetails,
  women: FashionDetails,
  kid: FashionDetails,
  accessor: FashionDetails,
  sports: SportsDetails,
  gym: SportsDetails,
  cricket: SportsDetails,
  football: SportsDetails,
  tennis: SportsDetails,
  badminton: SportsDetails,
};

interface CategoryDetailRendererProps {
  item: any;
}

const CategoryDetailRendererComponent: React.FC<CategoryDetailRendererProps> = ({ item }) => {
  // Use slug if available, fallback to normalized name
  const categoryKey = useMemo(() => {
    const rawKey = item.category?.slug || item.category?.name || '';
    return rawKey.toLowerCase();
  }, [item.category]);

  // Find the matching component by checking if the key is contained in or equal to defined categories
  const matchedKey = Object.keys(CATEGORY_COMPONENTS).find(k => categoryKey.includes(k));
  const Component = matchedKey ? CATEGORY_COMPONENTS[matchedKey] : null;

  if (!Component) return null;

  return <Component item={item} />;
};

// Performance optimization: Memoize the dispatcher
export const CategoryDetailRenderer = React.memo(CategoryDetailRendererComponent);
