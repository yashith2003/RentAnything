// components/itemDetails/LocationMap.tsx

import React from 'react';
import { View, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  address: string;
}

export default function LocationMap({ latitude, longitude, address }: LocationMapProps) {
  const openMaps = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latitude},${longitude}`;
    const label = encodeURIComponent(address);
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <View className="mt-8">
      <Text className="text-base font-bold mb-2">Location</Text>
      <Text className="text-[10px] text-gray-400 mb-4">
        {address}
      </Text>
      
      <View className="h-48 bg-gray-100 rounded-3xl overflow-hidden mb-4">
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ width: '100%', height: '100%' }}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
        >
          <Marker
            coordinate={{ latitude, longitude }}
            title="Item Location"
          />
        </MapView>
      </View>

      <TouchableOpacity 
        onPress={openMaps}
        className="h-12 border border-cyan-500 rounded-full items-center justify-center"
      >
        <Text className="text-cyan-500 font-bold">Get Directions</Text>
      </TouchableOpacity>
    </View>
  );
}
