import React from 'react';
import { View } from 'react-native';
import { LabelledInput } from '@/components/form/LabelledInput';

interface ElectronicsFieldsProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
}

export const ElectronicsFields: React.FC<ElectronicsFieldsProps> = ({ formData, onFieldChange }) => {
  return (
    <View>
      <LabelledInput 
        label="Brand" 
        placeholder="Type here..." 
        value={formData.brand || ''}
        onChangeText={(value) => onFieldChange('brand', value)}
      />
      <LabelledInput 
        label="Model" 
        placeholder="Type here..." 
        value={formData.model || ''}
        onChangeText={(value) => onFieldChange('model', value)}
      />
      <LabelledInput 
        label="Warranty" 
        placeholder="e.g., 1 year manufacturer warranty" 
        value={formData.warranty || ''}
        onChangeText={(value) => onFieldChange('warranty', value)}
      />
      <LabelledInput 
        label="Specifications" 
        placeholder="Enter detailed specifications..." 
        multiline
        value={formData.specifications || ''}
        onChangeText={(value) => onFieldChange('specifications', value)}
      />
    </View>
  );
};
