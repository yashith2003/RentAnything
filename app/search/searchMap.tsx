// app/search/searchMap.tsx

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState, useEffect, useCallback } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import Map, { MapMarker } from '../../components/shared/map';
import itemService from '@/api/item.service';
import { Region } from 'react-native-maps';
import { Colors } from '@/constants/theme';
import * as Location from 'expo-location';

interface SearchMapProps {
  categoryId?: number;
  filters?: any;
}

export default function SearchMap({ categoryId, filters }: SearchMapProps) {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, [categoryId]);

  const fetchMarkers = async (currentRegion: Region) => {
    setLoading(true);
    try {
      const bounds = {
        neLat: currentRegion.latitude + currentRegion.latitudeDelta / 2,
        neLng: currentRegion.longitude + currentRegion.longitudeDelta / 2,
        swLat: currentRegion.latitude - currentRegion.latitudeDelta / 2,
        swLng: currentRegion.longitude - currentRegion.longitudeDelta / 2,
      };

      const data = await itemService.getMapItems(bounds, categoryId, filters);
      setMarkers(data);
    } catch (error) {
      console.error('Failed to fetch map items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
    fetchMarkers(newRegion);
  };

  const handleMarkerPress = async (marker: MapMarker) => {
    try {
      const fullItem = await itemService.getItem(marker.id);
      setSelectedItem(fullItem);
    } catch (error) {
      console.error('Failed to fetch item details:', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 relative overflow-hidden">
        <Map 
          markers={markers} 
          onMarkerPress={handleMarkerPress} 
          onRegionChangeComplete={handleRegionChangeComplete}
          initialRegion={region || undefined}
        />

        {/* Loading Indicator */}
        {loading && (
          <View className="absolute top-4 w-full items-center">
            <View className="bg-white/90 px-4 py-2 rounded-full flex-row items-center border border-gray-100 shadow-sm">
              <ActivityIndicator size="small" color={Colors.primary} className="mr-2" />
              <Text className="text-gray-600 font-medium text-xs">Searching area...</Text>
            </View>
          </View>
        )}

        {/* Floating Product Card */}
        {selectedItem && (
          <View className="absolute bottom-6 left-6 right-6">
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setSelectedItem(null)}
              className="absolute -top-10 right-0 w-8 h-8 bg-white rounded-full items-center justify-center border border-gray-100 shadow-sm"
            >
               <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>

            <View
              className="bg-white rounded-[32px] p-4 border border-gray-100 shadow-xl shadow-black/10"
              style={{ elevation: 8 }}
            >
              <View className="flex-row">
                <View className="w-32 h-24 rounded-2xl overflow-hidden bg-gray-50 mr-4">
                  <Image
                    source={{ uri: selectedItem.imageUrl || 'https://via.placeholder.com/400x300' }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="contain"
                  />
                </View>

                <View className="flex-1">
                  <View className="flex-row flex-wrap items-baseline">
                    <Text className="text-[#2FA2B9] font-bold text-xs">
                      Rs: {selectedItem.price?.toLocaleString() || selectedItem.pricings?.[0]?.price?.toLocaleString()}
                    </Text>
                    <Text className="text-gray-400 text-[8px] ml-0.5">- Per day</Text>
                  </View>

                  <Text className="font-bold text-base mt-1 text-black" numberOfLines={1}>{selectedItem.title}</Text>

                  <View className="flex-row items-center mt-1">
                     <Text className="text-gray-500 text-[10px]" numberOfLines={1}>Owner: {selectedItem.owner?.individualUser?.fullName || selectedItem.owner?.company?.companyName || 'N/A'}</Text>
                  </View>

                  <View className="flex-row items-center mt-1">
                    <Ionicons name="location-outline" size={12} color="#2FA2B9" />
                    <Text className="text-[#2FA2B9] text-[10px] font-medium ml-1" numberOfLines={1}>
                      {selectedItem.address?.address}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center mt-4 gap-x-3">
                <TouchableOpacity className="flex-1 bg-[#2FA2B9] rounded-2xl py-3.5 items-center">
                  <Text className="text-white text-xs font-bold">Request for rent</Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-10 h-10 rounded-full border border-gray-100 items-center justify-center">
                  <Ionicons name="call-outline" size={18} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
