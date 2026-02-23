import React from 'react';
import { View } from 'react-native';
import { DetailRow } from '../DetailRow';

interface ElectronicsDetailsProps {
  item: any;
}

export const ElectronicsDetails: React.FC<ElectronicsDetailsProps> = ({ item }) => {
  const details = item.categoryDetails || {};

  return (
    <View className="mt-4">
      <View className="space-y-2">
        <DetailRow label="Brand" value={details.brand} />
        <DetailRow label="Model" value={details.model} />
        <DetailRow label="Warranty" value={details.warranty} />
        <DetailRow label="Specifications" value={details.specifications} />
      </View>
    </View>
  );
};
