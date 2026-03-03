//RentAnything/components/form/categoryFields/FashionFields.tsx

import React from 'react';
import { View } from 'react-native';
import { LabelledInput } from '@/components/form/LabelledInput';
import { ChipGroup } from '@/components/form/ChipGroup';

interface FashionFieldsProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
}

export const FashionFields: React.FC<FashionFieldsProps> = ({ formData, onFieldChange }) => {
  return (
    <View>
      <ChipGroup 
        label="Size" 
        options={['XS', 'S', 'M', 'L', 'XL', 'XXL']} 
        selected={formData.size || 'M'} 
        onSelect={(value) => onFieldChange('size', value)} 
      />
      <ChipGroup 
        label="Gender" 
        options={['Male', 'Female', 'Unisex', 'Kids']} 
        selected={formData.gender || 'Unisex'} 
        onSelect={(value) => onFieldChange('gender', value)} 
      />
      <LabelledInput 
        label="Brand" 
        placeholder="Type here..." 
        value={formData.brand || ''}
        onChangeText={(value) => onFieldChange('brand', value)}
      />
      <LabelledInput 
        label="Material" 
        placeholder="e.g., Cotton, Polyester" 
        value={formData.material || ''}
        onChangeText={(value) => onFieldChange('material', value)}
      />
    </View>
  );
};
