// components/shared/map.web.tsx
// Web stub — react-native-maps is native only; render a placeholder on web.

import React from 'react';
import { View, Text } from 'react-native';
import type { MapMarker } from './map';

export type { MapMarker };

interface MapProps {
  markers?: any[];
  onMarkerPress?: (marker: any) => void;
  onRegionChangeComplete?: (region: any) => void;
  initialRegion?: any;
  style?: any;
  selectedMarkerId?: number;
}

export default function Map(_props: MapProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e8f4f0' }}>
      <Text style={{ color: '#888', fontSize: 14 }}>Map is not available on web.</Text>
    </View>
  );
}
