// app/profile/reviewsPage.tsx

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
];

export default function ReviewsPage() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black">Reviews</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="pt-2 pb-6">
          {REVIEWS.map((review) => (
            <View
              key={review.id}
              className="mb-4 p-4 border border-gray-100 rounded-[24px] bg-white shadow-sm"
              style={{
                borderColor: '#F0F0F0',
              }}
            >
              {/* Review Header */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-3">
                  <Image
                    source={{ uri: review.avatar }}
                    style={{ width: 44, height: 44, borderRadius: 22 }}
                    contentFit="cover"
                  />
                  <View className="flex-row items-center gap-1">
                    <Text className="text-base font-bold text-black">
                      {review.userName}
                    </Text>
                    {review.isVerified && (
                      <Ionicons name="checkmark-circle" size={18} color="#2196F3" />
                    )}
                  </View>
                </View>
                <Text className="text-sm text-gray-400">{review.date}</Text>
              </View>

              {/* Stars */}
              <View className="flex-row gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star"
                    size={18}
                    color={i < review.rating ? '#FF9800' : '#E0E0E0'}
                  />
                ))}
              </View>

              {/* Comment */}
              <Text className="text-sm text-gray-400 leading-5">
                {review.comment}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
