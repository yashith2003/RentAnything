import ReviewCard from '@/components/card/ReviewCard';
import SearchBar from '@/components/form/searchbar';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
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
      <ScreenHeader title="Reviews for Item" rightIcon="ellipsis-horizontal" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className={`px-${getTailwindSpacing(Spacing.pageHorizontal)} pb-6 pt-2`}>
          
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
            <ReviewCard 
              key={review.id}
              name={review.userName}
              image={review.avatar}
              rating={review.rating}
              comment={review.comment}
              date={review.date}
              isVerified={review.isVerified}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
