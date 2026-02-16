import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { LabelledInput } from '@/components/form/LabelledInput';
import { Ionicons } from '@expo/vector-icons';

interface HomeFieldsProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
}

export const HomeFields: React.FC<HomeFieldsProps> = ({ formData, onFieldChange }) => {
  return (
    <View>
      {/* Property Type */}
      <View className="mb-6">
        <Text className="text-sm font-bold text-black mb-2">Property Type</Text>
        <TouchableOpacity className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 flex-row items-center justify-between">
          <Text className={formData.propertyType ? "text-gray-700" : "text-gray-400"}>
            {formData.propertyType || 'Select property type'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <LabelledInput 
        label="Number of Rooms" 
        placeholder="Type here..." 
        value={formData.numberOfRooms?.toString() || ''}
        onChangeText={(value) => onFieldChange('numberOfRooms', parseInt(value) || 0)}
        keyboardType="numeric"
      />
      <LabelledInput 
        label="Number of Bathrooms" 
        placeholder="Type here..." 
        value={formData.numberOfBathrooms?.toString() || ''}
        onChangeText={(value) => onFieldChange('numberOfBathrooms', parseInt(value) || 0)}
        keyboardType="numeric"
      />
      <LabelledInput 
        label="Area" 
        placeholder="e.g., 1200 sq ft" 
        value={formData.area || ''}
        onChangeText={(value) => onFieldChange('area', value)}
      />

      {/* Furnished Toggle */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-sm font-bold text-black">Furnished</Text>
        <Switch 
          value={formData.isFurnished || false} 
          onValueChange={(value) => onFieldChange('isFurnished', value)} 
          trackColor={{ false: '#E5E7EB', true: '#2FA2B9' }}
        />
      </View>
    </View>
  );
};
