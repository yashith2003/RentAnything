// components/shared/map.tsx

import React from 'react';
import { Text, View, ViewStyle, Platform, StyleSheet } from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import ClusteredMapView from 'react-native-map-clustering';
import { Colors } from '@/constants/theme';

const greenStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebf3ea"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#525f3f"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f1f6ec"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c5e0a5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4b6f2f"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#a1d7f4"
      }
    ]
  }
];

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
  region?: Region;
  style?: ViewStyle;
  selectedMarkerId?: number;
  mapRef?: React.RefObject<any>;
}

export default function Map({ 
  markers, 
  onMarkerPress, 
  onRegionChangeComplete, 
  region,
  style,
  selectedMarkerId,
  mapRef
}: MapProps) {
  
  const renderCluster = (cluster: any) => {
    const { id, pointCount, coordinate, onPress } = cluster;

    return (
      <Marker
        key={`cluster-${id}`}
        coordinate={coordinate}
        onPress={onPress}
        tracksViewChanges={false}
      >
        <View style={styles.clusterPill}>
          <Text style={styles.clusterText}>{pointCount}</Text>
        </View>
      </Marker>
    );
  };

  const renderMarker = (marker: MapMarker) => {
    const isSelected = selectedMarkerId === marker.id;
    return (
      <Marker
        key={marker.id}
        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
        onPress={() => onMarkerPress?.(marker)}
        tracksViewChanges={false}
      >
        <View style={[
          styles.priceMarker, 
          isSelected && styles.activeMarker,
          isSelected && { transform: [{ scale: 1.1 }] }
        ]}>
          <Text style={[styles.priceText, isSelected && styles.activeText]}>
            {typeof marker.price === 'number' ? `Rs: ${marker.price.toLocaleString()}` : marker.price}
          </Text>
        </View>
      </Marker>
    );
  };

  return (
    <View className="flex-1" style={style}>
      <ClusteredMapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        region={region}
        provider={PROVIDER_GOOGLE}
        customMapStyle={greenStyle}
        onRegionChangeComplete={onRegionChangeComplete}
        renderCluster={renderCluster}
        tracksViewChanges={false}
        spiralEnabled={false}
        animationEnabled={true}
        layoutAnimationConf={{
          duration: 300,
          update: {
            type: 'easeInEaseOut',
          },
        }}
      >
        {(Array.isArray(markers) ? markers : []).map(renderMarker)}
      </ClusteredMapView>
    </View>
  );
}

const styles = StyleSheet.create({
  priceMarker: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1, // Thinner border
    borderColor: '#2FA2B9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, // Softer shadow
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  priceText: {
    color: '#0B0C15',
    fontWeight: '700',
    fontSize: 11, // Slightly larger font
  },
  activeMarker: {
    backgroundColor: '#2FA2B9',
    borderColor: 'white',
    elevation: 5,
    shadowOpacity: 0.3,
  },
  activeText: {
    color: 'white',
  },
  clusterPill: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2FA2B9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clusterText: {
    color: '#2FA2B9',
    fontWeight: 'bold',
    fontSize: 12,
  }
});
