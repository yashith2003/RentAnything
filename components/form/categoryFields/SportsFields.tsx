//RentAnything/components/form/categoryFields/SportsFields.tsx

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LabelledInput } from '@/components/form/LabelledInput';
import { ChipGroup } from '@/components/form/ChipGroup';
import { Ionicons } from '@expo/vector-icons';

interface SportsFieldsProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
}

export const SportsFields: React.FC<SportsFieldsProps> = ({ formData, onFieldChange }) => {
  return (
    <View>
      {/* Sport Type */}
      <View className="mb-6">
        <Text className="text-sm font-bold text-black mb-2">Sport Type</Text>
        <TouchableOpacity className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 flex-row items-center justify-between">
          <Text className={formData.sportType ? "text-gray-700" : "text-gray-400"}>
            {formData.sportType || 'Select sport type'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <LabelledInput 
        label="Equipment Type" 
        placeholder="e.g., Bat, Ball, Racket" 
        value={formData.equipmentType || ''}
        onChangeText={(value) => onFieldChange('equipmentType', value)}
      />

      <ChipGroup 
        label="Suitable For" 
        options={['Beginner', 'Intermediate', 'Professional', 'All Levels']} 
        selected={formData.suitableFor || 'All Levels'} 
        onSelect={(value) => onFieldChange('suitableFor', value)} 
      />
    </View>
  );
};
