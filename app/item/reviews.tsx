import ReviewCard from '@/components/card/ReviewCard';
import { PaddingStyles } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const reviewsData = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: 'Malith Perera',
  image: 'https://i.pravatar.cc/150?u=malith',
  rating: 5,
  comment: 'The rental car was clean, reliable, and the service was quick and efficient. Overall, the experience was hassle-free and enjoyable.',
  date: 'Today',
  isVerified: true
}));

export default function ItemReviewsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between py-4 bg-white border-b border-gray-50" style={PaddingStyles.page}>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black">Reviews for Item</Text>
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-gray-50">
           <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View className="flex-1" style={PaddingStyles.page}>
        {/* Rating Summary */}
        <View className="flex-row items-center mt-6 mb-4">
            <Ionicons name="star" size={24} color="#FFD700" />
            <Text className="text-lg font-bold ml-2">5.0 Reviews (125)</Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-6">
            <Ionicons name="search-outline" size={20} color="#9CA3AF" />
             <TextInput 
                placeholder="Find reviews........." 
                className="flex-1 ml-3 text-sm text-black"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
        </View>

        {/* Reviews List */}
        <FlatList
            data={reviewsData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <ReviewCard 
                    name={item.name}
                    image={item.image}
                    rating={item.rating}
                    comment={item.comment}
                    date={item.date}
                    isVerified={item.isVerified}
                    containerStyle="mb-4 w-full"
                />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}
