//components/map.tsx

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';

export interface MapMarker {
  id: number | string;
  type: 'cluster' | 'price';
  value?: string;
  count?: number;
  top: string | number;
  left: string | number;
  active?: boolean;
}

interface MapProps {
  markers: MapMarker[];
  onMarkerPress?: (marker: MapMarker) => void;
  style?: ViewStyle;
}

export default function Map({ markers, onMarkerPress, style }: MapProps) {
  return (
    <View className="flex-1 relative overflow-hidden" style={style}>
      {/* Map Background Image */}
      <Image
        source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-0.1276,51.5074,11.5,0/800x1200?access_token=pk.eyJ1IjoiY2hhdWNoYSIsImEiOiJjazA1eWozYmwwMG5xM25vYmR4eWw0bXhxIn0.q6Yn0k9_xG9z-uX4hKz4_A' }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
      />

      {/* Markers Overlay */}
      {markers.map((marker) => (
        <View
          key={marker.id}
          style={{ 
            position: 'absolute', 
            top: marker.top as any, 
            left: marker.left as any 
          }}
          className="items-center justify-center"
        >
          {marker.type === 'cluster' ? (
            <TouchableOpacity
              onPress={() => onMarkerPress?.(marker)}
              className={`w-12 h-12 rounded-full items-center justify-center border-[3px] ${
                marker.active ? 'bg-[#2FA2B9] border-white' : 'bg-white border-[#2FA2B9]'
              } shadow-lg`}
              style={{ elevation: 6 }}
            >
              <Text className={`font-bold text-base ${marker.active ? 'text-white' : 'text-gray-800'}`}>
                {marker.count}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPress={() => onMarkerPress?.(marker)}
              className="bg-white px-2.5 py-1.5 rounded-lg border-2 border-gray-800 shadow-lg"
              style={{ elevation: 4 }}
            >
              <Text className="text-gray-800 font-bold text-xs">{marker.value}</Text>
            </TouchableOpacity>
          )}
          
          {marker.active && (
            <View className="absolute -bottom-9">
              <MaterialCommunityIcons name="gesture-tap" size={36} color="#2FA2B9" />
            </View>
          )}
        </View>
      ))}

      {/* Mapbox Attribution (required) */}
      <View className="absolute bottom-1 right-1 bg-white/70 px-1.5 py-0.5 rounded">
        <Text className="text-[8px] text-gray-600">© Mapbox</Text>
      </View>
    </View>
  );
}
