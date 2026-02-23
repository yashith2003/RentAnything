import React from 'react';
import { View } from 'react-native';
import { DetailRow } from '../DetailRow';
import { CategoryTag } from '../CategoryTag';

interface HomeDetailsProps {
  item: any;
}

export const HomeDetails: React.FC<HomeDetailsProps> = ({ item }) => {
  const details = item.categoryDetails || {};

  return (
    <View className="mt-4">
      <View className="space-y-2">
        <DetailRow label="Property Type" value={details.propertyType} />
        <DetailRow label="Rooms" value={details.numberOfRooms} />
        <DetailRow label="Bathrooms" value={details.numberOfBathrooms} />
        <DetailRow label="Area" value={details.area} />
        <DetailRow label="Amenities" value={details.amenities} />
      </View>

      {/* Category Specific Tags */}
      {details.isFurnished && (
        <View className="flex-row flex-wrap gap-2 mt-6">
          <CategoryTag text="Furnished" />
        </View>
      )}
    </View>
  );
};
