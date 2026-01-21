// app/profile/reviewsPage.tsx

import SearchBar from '@/components/searchbar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


interface Review {
  id: string;
  userName: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
  isVerified: boolean;
}

const REVIEWS: Review[] = [
  {
    id: '1',
    userName: 'Malith Perera',
    avatar: 'https://i.pravatar.cc/150?u=malith',
    date: 'Today',
    rating: 5,
    comment: 'The rental car was clean, reliable, and the service was quick and efficient. Overall, the experience was hassle-free and enjoyable.',
    isVerified: true,
  },
  {
    id: '2',
    userName: 'Malith Perera',
    avatar: 'https://i.pravatar.cc/150?u=malith',
    date: 'Today',
    rating: 5,
    comment: 'The rental car was clean, reliable, and the service was quick and efficient. Overall, the experience was hassle-free and enjoyable.',
    isVerified: true,
  },
  {
    id: '3',
    userName: 'Malith Perera',
    avatar: 'https://i.pravatar.cc/150?u=malith',
    date: 'Today',
    rating: 5,
    comment: 'The rental car was clean, reliable, and the service was quick and efficient. Overall, the experience was hassle-free and enjoyable.',
    isVerified: true,
  },
  {
    id: '4',
    userName: 'Malith Perera',
    avatar: 'https://i.pravatar.cc/150?u=malith',
    date: 'Today',
    rating: 5,
    comment: 'The rental car was clean, reliable, and the service was quick and efficient. Overall, the experience was hassle-free and enjoyable.',
    isVerified: true,
  },
  {
    id: '5',
    userName: 'Malith Perera',
    avatar: 'https://i.pravatar.cc/150?u=malith',
    date: 'Today',
    rating: 5,
    comment: 'The rental car was clean, reliable, and the service was quick and efficient. Overall, the experience was hassle-free and enjoyable.',
    isVerified: true,
  },
  {
    id: '6',
    userName: 'Malith Perera',
    avatar: 'https://i.pravatar.cc/150?u=malith',
    date: 'Today',
    rating: 5,
    comment: 'The rental car was clean, reliable, and the service was quick and efficient. Overall, the experience was hassle-free and enjoyable.',
    isVerified: true,
  },
];

export default function ReviewsPage() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm"
        >
          <Ionicons name="chevron-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black">Reviews for Item</Text>
        <TouchableOpacity 
          className="w-10 h-10 items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm"
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pb-6 pt-2">
          
          {/* Summary */}
          <View className="flex-row items-center mb-6">
            <Ionicons name="star" size={24} color="#FF9800" />
            <Text className="text-xl font-bold ml-2">5.0 Reviews (125)</Text>
          </View>

          {/* Search Bar */}
          <SearchBar 
            placeholder="Find reviews........." 
            containerStyle={{ marginBottom: 24 }}
          />

          {/* List of Reviews */}
          {REVIEWS.map((review) => (
            <View
              key={review.id}
              className="mb-4 p-5 bg-white border border-gray-100 rounded-[28px] shadow-sm"
            >
              {/* Review Header */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <Image
                    source={{ uri: review.avatar }}
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                    contentFit="cover"
                  />
                  <View className="ml-3">
                    <View className="flex-row items-center">
                      <Text className="text-base font-bold text-black mr-1">
                        {review.userName}
                      </Text>
                      {review.isVerified && (
                        <Ionicons name="checkmark-circle" size={18} color="#2196F3" />
                      )}
                    </View>
                  </View>
                </View>
                <Text className="text-sm text-gray-400">Today</Text>
              </View>

              {/* Stars */}
              <View className="flex-row gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star"
                    size={20}
                    color={i < review.rating ? '#FF9800' : '#E0E0E0'}
                  />
                ))}
              </View>

              {/* Comment */}
              <Text className="text-[14px] text-gray-500 leading-6">
                {review.comment}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
