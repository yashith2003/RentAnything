//RentAnything/components/shared/map.tsx

import React from 'react';
import { Text, View, Platform, StyleSheet } from 'react-native';
import { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import ClusteredMapView from 'react-native-map-clustering';

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
  style?: any;
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
        <View 
          className="bg-white px-2.5 py-1.5 rounded-full border border-[#2FA2B9] shadow-sm min-w-[35px] items-center justify-center shadow-black/15"
          style={{ elevation: 3 }}
        >
          <Text className="text-[#2FA2B9] font-bold text-xs">{pointCount}</Text>
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
        <View 
          className={`px-2 py-1 rounded-full border shadow-sm ${
            isSelected 
              ? 'bg-[#2FA2B9] border-white scale-110 shadow-black/30' 
              : 'bg-white border-[#2FA2B9] shadow-black/15'
          }`}
          style={{ elevation: isSelected ? 5 : 3 }}
        >
          <Text className={`font-bold text-[11px] ${isSelected ? 'text-white' : 'text-[#0B0C15]'}`}>
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
