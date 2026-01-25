// app/profile/incident/incidentRequest.tsx

import IncidentCard from '@/components/incidentCard';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

// Use same mock data for consistency
const MOCK_INCIDENTS = [
  {
    id: '1',
    itemName: 'Tesla Model S',
    itemDescription: 'A car with high specs that are rented. A car with high specs that are rented ot an affordable price.',
    itemCondition: 'Used (like new)',
    itemImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=300&auto=format&fit=crop',
    user: {
      name: 'Malith Perera',
      avatar: 'https://i.pravatar.cc/150?u=malith',
      isVerified: true,
    },
    bookingDate: 'Jan 09 20225',
    duration: '5 days',
    price: 'Rs:15000.00',
    incidentType: 'Product Damage',
    evidenceImages: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=150&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=150&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=150&auto=format&fit=crop',
    ],
    evidenceVideo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop',
    description: 'Product Damage A car with high specs that are rented. A car with high specs that are rented ot an affordable price. A car with high specs that are rented ot an affordable price.',
  },
  {
    id: '2',
    itemName: 'Tesla Model S',
    itemDescription: 'A car with high specs that are rented. A car with high specs that are rented ot an affordable price.',
    itemCondition: 'Used (like new)',
    itemImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=300&auto=format&fit=crop',
    user: {
      name: 'Malith Perera',
      avatar: 'https://i.pravatar.cc/150?u=malith',
      isVerified: true,
    },
    bookingDate: 'Jan 09 20225',
    duration: '5 days',
    price: 'Rs:15000.00',
    incidentType: 'Product Damage',
    evidenceImages: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=150&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=150&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=150&auto=format&fit=crop',
    ],
    evidenceVideo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop',
    description: 'Product Damage A car with high specs that are rented. A car with high specs that are rented ot an affordable price. A car with high specs that are rented ot an affordable price.',
  },
];

export default function IncidentRequestContent() {
  return (
    <View className="flex-1">
      <View className="mb-4">
        <Text className="text-sm font-bold text-black font-Outfit-Bold">
          {MOCK_INCIDENTS.length} Incident Requests Available
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {MOCK_INCIDENTS.map((item) => (
          <IncidentCard key={item.id} item={item} />
        ))}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
