import ReviewCard from '@/components/card/ReviewCard';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  image: string;
}

interface ItemReviewsProps {
  reviews: Review[];
  totalReviews: number;
}

export default function ItemReviews({ reviews, totalReviews }: ItemReviewsProps) {
  return (
    <View className="mt-8">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-bold">Reviews For Item ({totalReviews})</Text>
        <TouchableOpacity>
          <Text className="text-gray-400 text-xs font-medium">View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {reviews.map((rev) => (
          <ReviewCard 
            key={rev.id}
            name={rev.name}
            image={rev.image}
            rating={rev.rating}
            comment={rev.comment}
            containerStyle="w-72 mr-4 mb-0"
          />
        ))}
      </ScrollView>
    </View>
  );
}
