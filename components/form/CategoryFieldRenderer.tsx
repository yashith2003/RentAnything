import React from 'react';
import { View } from 'react-native';
import { VehicleFields } from './categoryFields/VehicleFields';
import { ElectronicsFields } from './categoryFields/ElectronicsFields';
import { HomeFields } from './categoryFields/HomeFields';
import { FashionFields } from './categoryFields/FashionFields';
import { SportsFields } from './categoryFields/SportsFields';

interface CategoryFieldRendererProps {
  categoryName: string;
  categoryData: any;
  onFieldChange: (field: string, value: any) => void;
}

export const CategoryFieldRenderer: React.FC<CategoryFieldRendererProps> = ({
  categoryName,
  categoryData,
  onFieldChange,
}) => {
  const normalizedCategory = categoryName.toLowerCase();

  if (normalizedCategory.includes('vehicle') || normalizedCategory.includes('car') || normalizedCategory.includes('bike') || normalizedCategory.includes('scooter') || normalizedCategory.includes('truck') || normalizedCategory.includes('cycle')) {
    return <VehicleFields formData={categoryData} onFieldChange={onFieldChange} />;
  } else if (normalizedCategory.includes('electronic') || normalizedCategory.includes('phone') || normalizedCategory.includes('computer') || normalizedCategory.includes('tablet') || normalizedCategory.includes('camera') || normalizedCategory.includes('headphone')) {
    return <ElectronicsFields formData={categoryData} onFieldChange={onFieldChange} />;
  } else if (normalizedCategory.includes('home') || normalizedCategory.includes('furniture') || normalizedCategory.includes('appliance') || normalizedCategory.includes('decoration') || normalizedCategory.includes('kitchen') || normalizedCategory.includes('bedding')) {
    return <HomeFields formData={categoryData} onFieldChange={onFieldChange} />;
  } else if (normalizedCategory.includes('fashion') || normalizedCategory.includes('cloth') || normalizedCategory.includes('shoe') || normalizedCategory.includes('men') || normalizedCategory.includes('women') || normalizedCategory.includes('kid') || normalizedCategory.includes('accessor')) {
    return <FashionFields formData={categoryData} onFieldChange={onFieldChange} />;
  } else if (normalizedCategory.includes('sport') || normalizedCategory.includes('gym') || normalizedCategory.includes('cricket') || normalizedCategory.includes('football') || normalizedCategory.includes('tennis') || normalizedCategory.includes('badminton')) {
    return <SportsFields formData={categoryData} onFieldChange={onFieldChange} />;
  }

  return <View />;
};
