// app/search/searchMap.tsx

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState, useEffect, useCallback } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator, Linking } from 'react-native';
import Map, { MapMarker } from '../../components/shared/map';
import { itemApi } from '@/api/item.service';
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
  const [lastFetchedRegion, setLastFetchedRegion] = useState<Region | null>(null);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const mapRef = React.useRef<any>(null);

  const [triggerGetMapItems] = itemApi.useLazyGetMapItemsQuery();
  const [triggerGetItem] = itemApi.useLazyGetItemQuery();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let location = await Location.getCurrentPositionAsync({});
      const initial = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setRegion(initial);
      setLastFetchedRegion(initial);
      performSearch(initial);
    })();
  }, [categoryId, filters]);

  const performSearch = async (currentRegion: Region) => {
    setLoading(true);
    setShowSearchArea(false);
    setLastFetchedRegion(currentRegion);
    try {
      const bounds = {
        neLat: currentRegion.latitude + currentRegion.latitudeDelta / 2,
        neLng: currentRegion.longitude + currentRegion.longitudeDelta / 2,
        swLat: currentRegion.latitude - currentRegion.latitudeDelta / 2,
        swLng: currentRegion.longitude - currentRegion.longitudeDelta / 2,
      };

      const response = await triggerGetMapItems({ bounds, categoryId, filters }).unwrap();
      setMarkers(response || []);
    } catch (error) {
      console.error('Failed to fetch map items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
    
    // Check if we moved significantly from last search
    if (lastFetchedRegion) {
      const latDiff = Math.abs(newRegion.latitude - lastFetchedRegion.latitude);
      const lngDiff = Math.abs(newRegion.longitude - lastFetchedRegion.longitude);
      if (latDiff > newRegion.latitudeDelta * 0.3 || lngDiff > newRegion.longitudeDelta * 0.3) {
        setShowSearchArea(true);
      }
    }
  };

  const handleMarkerPress = async (marker: MapMarker) => {
    try {
      const fullItem = await triggerGetItem(marker.id).unwrap();
      setSelectedItem(fullItem);
      
      // Shift map up slightly so marker remains visible above the card
      if (region && mapRef.current) {
        const offsetRegion = {
          ...region,
          latitude: marker.latitude - (region.latitudeDelta * 0.2), // Shift view up
          longitude: marker.longitude,
        };
        mapRef.current.animateToRegion(offsetRegion, 300);
      }
    } catch (error) {
      console.error('Failed to fetch item details:', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 relative overflow-hidden">
        {region && (
          <Map 
            mapRef={mapRef}
            markers={markers} 
            onMarkerPress={handleMarkerPress} 
            onRegionChangeComplete={handleRegionChangeComplete}
            region={region}
            selectedMarkerId={selectedItem?.id}
          />
        )}

        {/* Search This Area Button */}
        {showSearchArea && !loading && (
          <View className="absolute top-4 w-full items-center">
            <TouchableOpacity 
              onPress={() => region && performSearch(region)}
              className="bg-[#2FA2B9] px-6 py-2.5 rounded-full flex-row items-center shadow-lg shadow-black/20"
              style={{ elevation: 10 }}
            >
              <MaterialCommunityIcons name="magnify" size={18} color="white" className="mr-2" />
              <Text className="text-white font-bold text-sm">Search this area</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading Indicator */}
        {loading && (
          <View className="absolute top-4 w-full items-center">
            <View className="bg-white/95 px-5 py-2.5 rounded-full flex-row items-center border border-gray-100 shadow-md">
              <ActivityIndicator size="small" color="#2FA2B9" className="mr-3" />
              <Text className="text-gray-700 font-semibold text-xs">Searching items...</Text>
            </View>
          </View>
        )}

        {/* Floating Product Card */}
        {selectedItem && (
          <View 
            className="absolute bottom-6 left-4 right-4 bg-white rounded-[24px] p-4 border border-gray-50 shadow-2xl shadow-black/30" 
            style={{ elevation: 15 }}
          >
            <View className="flex-row">
              {/* Image */}
              <View className="w-28 h-24 rounded-2xl overflow-hidden bg-gray-50 mr-4">
                <Image
                  source={{ uri: selectedItem.imageUrl || 'https://via.placeholder.com/400x300' }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
              </View>

              {/* Details */}
              <View className="flex-1 justify-between py-0.5">
                <View>
                  <View className="flex-row items-baseline mb-0.5">
                    <Text className="text-[#2FA2B9] font-extrabold text-sm mr-1">
                      Rs:{(selectedItem.price || selectedItem.pricings?.[0]?.price)?.split('.')[0]}
                    </Text>
                    <Text className="text-gray-400 text-[10px] font-medium">
                      - Per {selectedItem.pricings?.[0]?.rateType || 'day'}
                    </Text>
                  </View>
                  <Text className="font-bold text-[15px] text-[#0B0C15] mb-1" numberOfLines={1}>{selectedItem.title}</Text>
                  
                  <View className="flex-row items-center">
                    <Text className="text-gray-400 text-[11px]" numberOfLines={1}>
                      Owner: {selectedItem.owner?.individualUser?.fullName || selectedItem.owner?.company?.companyName || 'N/A'}
                    </Text>
                    <View className="ml-1.5 w-3.5 h-3.5 bg-[#2D8CFF] rounded-full items-center justify-center">
                      <Ionicons name="checkmark" size={9} color="white" />
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Text className="text-gray-600 text-[11px] font-bold mr-0.5">5.0</Text>
                    <Ionicons name="star" size={11} color="#FF9500" />
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="location-outline" size={12} color="#2FA2B9" />
                    <Text className="text-[#2FA2B9] text-[10px] font-bold ml-1">
                      5.6 km
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View className="flex-row items-center mt-4 gap-x-2">
              <TouchableOpacity className="flex-1 bg-[#2FA2B9] py-3 rounded-xl items-center justify-center shadow-md shadow-[#2FA2B9]/30">
                <Text className="text-white text-xs font-bold uppercase tracking-wider">Request for rent</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 items-center justify-center"
                onPress={() => {
                  if (selectedItem?.phone) {
                    Linking.openURL(`tel:${selectedItem.phone}`);
                  } else if (selectedItem?.owner?.phone) {
                    Linking.openURL(`tel:${selectedItem.owner.phone}`);
                  } else {
                    console.warn('[SearchMap] No phone number available');
                  }
                }}
              >
                <Ionicons name="call" size={16} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 items-center justify-center">
                <Ionicons name="chatbubble-ellipses" size={16} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedItem(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full items-center justify-center border border-gray-100 shadow-lg"
              style={{ elevation: 5 }}
            >
              <Ionicons name="close" size={20} color="#0B0C15" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
