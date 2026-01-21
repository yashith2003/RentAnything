import ItemCard from '@/components/itemCard';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const searchResults = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=400&auto=format&fit=crop',
    title: 'Tennis Racquet',
    price: 'Rs:1000',
    extraPrice: '- Per day',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    delivery: true,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop',
    title: 'Nikon D90 DSLR Camera',
    price: 'Rs:1000',
    extraPrice: '- Per day | Rs: 1500 - 2 days',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    delivery: true,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=400&auto=format&fit=crop',
    title: 'Tesla Model S',
    price: 'Rs:1000',
    extraPrice: '- Per day | Rs: 1500 - 2 days',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    delivery: true,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1599727402636-1e96a40a233b?q=80&w=400&auto=format&fit=crop',
    title: '55 Gal Plastic Barrels',
    price: 'Rs:1000',
    extraPrice: '- Per day',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    delivery: true,
  },
];

export default function SearchList() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      {/* Products Count */}
      <View className="px-6 mb-4">
        <Text className="text-xl font-bold text-black">32 products found</Text>
      </View>

      {/* Products Grid */}
      <View className="flex-row flex-wrap justify-between px-6 pb-10">
        {searchResults.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}

