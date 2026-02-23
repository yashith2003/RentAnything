import React from 'react';
import { View } from 'react-native';
import { DetailRow } from '../DetailRow';

interface SportsDetailsProps {
  item: any;
}

export const SportsDetails: React.FC<SportsDetailsProps> = ({ item }) => {
  const details = item.categoryDetails || {};

  return (
    <View className="mt-4">
      <View className="space-y-2">
        <DetailRow label="Sport type" value={details.sportType} />
        <DetailRow label="Equipment type" value={details.equipmentType} />
        <DetailRow label="Suitable for" value={details.suitableFor} />
      </View>
    </View>
  );
};
