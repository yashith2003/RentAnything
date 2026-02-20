// components/shared/map.tsx

import React from 'react';
import { Text, View, ViewStyle, Platform, StyleSheet } from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import ClusteredMapView from 'react-native-map-clustering';
import { Colors } from '@/constants/theme';

export interface MapMarker {
  id: number;
  latitude: number;
  longitude: number;
  title?: string;
  price?: number | string;
  isCluster?: boolean;
  count?: number;
}

interface MapProps {
  markers: MapMarker[];
  onMarkerPress?: (marker: MapMarker) => void;
  onRegionChangeComplete?: (region: Region) => void;
  initialRegion?: Region;
  style?: ViewStyle;
}

export default function Map({ 
  markers, 
  onMarkerPress, 
  onRegionChangeComplete, 
  initialRegion,
  style 
}: MapProps) {
  
  const defaultRegion: Region = initialRegion || {
    latitude: 6.9271,
    longitude: 79.8612,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const renderMarker = (marker: MapMarker) => {
    return (
      <Marker
        key={marker.id}
        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
        onPress={() => onMarkerPress?.(marker)}
      >
        <View style={styles.priceMarker}>
          <Text style={styles.priceText}>
            {typeof marker.price === 'number' ? `Rs: ${marker.price.toLocaleString()}` : marker.price}
          </Text>
        </View>
      </Marker>
    );
  };

  return (
    <View className="flex-1" style={style}>
      <ClusteredMapView
        style={StyleSheet.absoluteFill}
        initialRegion={defaultRegion}
        provider={PROVIDER_GOOGLE}
        onRegionChangeComplete={onRegionChangeComplete}
        clusterColor={Colors.primary}
        clusterTextColor="white"
        spiralEnabled={false}
      >
        {markers.map(renderMarker)}
      </ClusteredMapView>
    </View>
  );
}

const styles = StyleSheet.create({
  priceMarker: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2FA2B9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  priceText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 12,
  }
});
