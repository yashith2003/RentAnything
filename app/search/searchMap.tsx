//app/search/searchMap.tsx

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Map, { MapMarker } from '../../components/shared/map';

// Map markers positioned to match the London map design
const mapMarkers: MapMarker[] = [
  // Top area (Hampstead, Holloway, Camden Town)
  { id: 1, type: 'cluster', count: 3, top: '18%', left: '52%' },
  { id: 2, type: 'cluster', count: 4, top: '20%', left: '65%' },
  { id: 3, type: 'cluster', count: 2, top: '24%', left: '18%' },
  
  // Middle area (Camden Town, Islington)
  { id: 4, type: 'price', value: 'Rs:16.50', top: '26%', left: '38%' },
  { id: 5, type: 'cluster', count: 3, top: '28%', left: '78%' },
  { id: 6, type: 'price', value: 'Rs:11', top: '30%', left: '48%' },
  { id: 7, type: 'price', value: 'Rs:4', top: '32%', left: '62%' },
  
  // Central area (City of London)
  { id: 8, type: 'cluster', count: 2, top: '36%', left: '75%' },
  
  // Lower middle (Westminster, Brixton)
  { id: 9, type: 'cluster', count: 4, top: '42%', left: '48%' },
  { id: 10, type: 'price', value: 'Rs:55', top: '46%', left: '8%' },
  { id: 11, type: 'price', value: 'Rs:33', top: '47%', left: '24%' },
  { id: 12, type: 'price', value: 'Rs:27.50', top: '48%', left: '35%' },
  { id: 13, type: 'price', value: 'Rs:33', top: '48%', left: '52%' },
  { id: 14, type: 'cluster', count: 6, top: '45%', left: '64%' },
  { id: 15, type: 'cluster', count: 15, top: '50%', left: '78%' },
  
  // Bottom area (Brixton)
  { id: 16, type: 'cluster', count: 2, top: '54%', left: '43%' },
  { id: 17, type: 'price', value: 'Rs:237', top: '58%', left: '35%' },
];

export default function SearchMap() {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  const handleMarkerPress = (marker: MapMarker) => {
    setSelectedMarker(marker);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Map Content */}
      <View className="flex-1 relative overflow-hidden">
        <Map markers={mapMarkers} onMarkerPress={handleMarkerPress} />

        {/* Load More Items Button */}
        <View className="absolute top-4 w-full items-center">
          <TouchableOpacity 
            className="bg-white border-2 border-[#2FA2B9] px-6 py-2.5 rounded-full shadow-lg"
            style={{ elevation: 4 }}
          >
            <Text className="text-[#2FA2B9] font-bold text-sm">Load more items</Text>
          </TouchableOpacity>
        </View>

        {/* Floating Product Card - Only show when marker is selected */}
        {selectedMarker && (
          <View className="absolute bottom-6 left-6 right-6">
            <View
              className="bg-white rounded-[32px] p-4 border border-gray-100 shadow-xl shadow-black/10"
              style={{ elevation: 8 }}
            >
              <View className="flex-row">
                {/* Product Image */}
                <View className="w-32 h-24 rounded-2xl overflow-hidden bg-gray-50 mr-4">
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=600&auto=format&fit=crop' }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="contain"
                  />
                </View>

                {/* Product Info */}
                <View className="flex-1">
                  <View className="flex-row flex-wrap items-baseline">
                    <Text className="text-[#2FA2B9] font-bold text-xs">Rs:1000</Text>
                    <Text className="text-gray-400 text-[8px] ml-0.5">- Per day | Rs: 1500 - 2 days</Text>
                  </View>

                  <Text className="font-bold text-base mt-1 text-black">Tesla Model S</Text>

                  <View className="flex-row items-center mt-1">
                    <Text className="text-gray-500 text-[10px]">Owner: Malith Perera</Text>
                    <MaterialCommunityIcons name="check-decagram" size={12} color="#2FA2B9" style={{ marginLeft: 4 }} />
                  </View>

                  <View className="flex-row items-center mt-1">
                    <Text className="text-gray-800 font-bold text-[10px] mr-1">5.0</Text>
                    <Ionicons name="star" size={10} color="#FFCC00" />
                  </View>

                  <View className="flex-row items-center mt-1">
                    <Ionicons name="location-outline" size={12} color="#2FA2B9" />
                    <Text className="text-[#2FA2B9] text-[10px] font-medium ml-1">5.6 km - Nugegoda</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row items-center mt-4 gap-x-3">
                <TouchableOpacity className="flex-1 bg-[#2FA2B9] rounded-2xl py-3.5 items-center">
                  <Text className="text-white text-xs font-bold">Request for rent</Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-10 h-10 rounded-full border border-gray-100 items-center justify-center">
                  <Ionicons name="call-outline" size={18} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity className="w-10 h-10 rounded-full border border-gray-100 items-center justify-center">
                  <Ionicons name="chatbubble-ellipses-outline" size={18} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Delivery Tag */}
              <View className="flex-row items-center mt-3 justify-center">
                <Ionicons name="car-outline" size={12} color="#999" />
                <Text className="text-gray-400 text-[10px] ml-1">Delivery Available</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
