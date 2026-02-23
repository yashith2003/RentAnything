import React from 'react';
import { View } from 'react-native';
import { DetailRow } from '../DetailRow';

interface FashionDetailsProps {
  item: any;
}

export const FashionDetails: React.FC<FashionDetailsProps> = ({ item }) => {
  const details = item.categoryDetails || {};

  return (
    <View className="mt-4">
      <View className="space-y-2">
        <DetailRow label="Size" value={details.size} />
        <DetailRow label="Gender" value={details.gender} />
        <DetailRow label="Material" value={details.material} />
      </View>
    </View>
  );
};
