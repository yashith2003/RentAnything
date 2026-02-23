import React from 'react';
import { View } from 'react-native';
import { DetailRow } from '../DetailRow';
import { CategoryTag } from '../CategoryTag';

interface VehicleDetailsProps {
  item: any;
}

export const VehicleDetails: React.FC<VehicleDetailsProps> = ({ item }) => {
  const details = item.categoryDetails || {};

  return (
    <View className="mt-4">
      <View className="space-y-2">
        <DetailRow label="Vehicle Type" value={details.vehicleType} />
        <DetailRow label="Vehicle Number" value={details.vehicleNumber} />
        <DetailRow label="Seating Capacity" value={details.seatingCapacity} />
        <DetailRow label="Fuel Type" value={details.fuelType} />
        <DetailRow label="Color" value={details.color} />
        <DetailRow label="Delivery Fee" value={details.deliveryFee ? `Rs: ${details.deliveryFee}` : null} />
        {details.driverAvailable && (
          <>
            <DetailRow label="Driver Name" value={details.driverName} />
            <DetailRow label="Driver Fee" value={details.driverFee ? `Rs: ${details.driverFee}` : null} />
          </>
        )}
      </View>

      {/* Category Specific Tags */}
      {details.driverAvailable && (
        <View className="flex-row flex-wrap gap-2 mt-6">
          <CategoryTag text="With Driver" />
        </View>
      )}
    </View>
  );
};
