import ReviewCard from '@/components/card/ReviewCard';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  image: string;
  reviewerStatus?: string;
}

interface ItemReviewsProps {
  reviews: Review[];
  totalReviews: number;
  onViewAll?: () => void;
}

export default function ItemReviews({ reviews, totalReviews, onViewAll }: ItemReviewsProps) {
  return (
    <View className="mt-8">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-bold">Reviews For Item ({totalReviews || 0})</Text>
        {totalReviews > 0 && (
          <TouchableOpacity onPress={onViewAll}>
            <Text className="text-gray-400 text-xs font-medium">View All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {!reviews || reviews.length === 0 ? (
        <View className="py-6 items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
          <Text className="text-gray-500 font-medium">No reviews yet.</Text>
          <Text className="text-xs text-gray-400 mt-1">Be the first to review this item!</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-1">
          {reviews.map((rev) => (
            <ReviewCard 
              key={rev.id}
              name={rev.name}
              image={rev.image}
              rating={rev.rating}
              comment={rev.comment}
              reviewerStatus={rev.reviewerStatus}
              containerStyle="w-72 mr-4 mb-0"
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
