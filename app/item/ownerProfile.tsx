import ReviewCard from '@/components/card/ReviewCard';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import ReviewPopup from '@/components/modal/ReviewPopup';
import RentalHistoryCard from '@/components/ownerProfile/RentalHistoryCard';
import StatsSection from '@/components/ownerProfile/StatsSection';
import ProgressBar from '@/components/ui/ProgressBar';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { PaddingStyles } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OwnerProfileScreen() {
  const router = useRouter();
  const [isReviewPopupVisible, setIsReviewPopupVisible] = useState(false);

  const stats = [
    { label: 'Active Rentals', value: '12' },
    { label: 'Reviews', value: '24' },
    { label: 'Listing Items', value: '15' },
  ];

  const verifiedDetails = [
    { label: 'Email', value: 'ji****@gmail.com' },
    { label: 'Phone Number', value: '076 *** ***7' },
    { label: 'Address', value: 'No ***/**, ******, Colombo' },
  ];

  const reviews = [
    {
      id: 1,
      name: 'Malith Perera',
      date: 'Today',
      rating: 5.0,
      comment: 'The rental car was clean, reliable, and the service was quick and efficient. Overall, the experience was hassle-free and enjoyable.',
      image: 'https://i.pravatar.cc/150?u=malith',
    },
    {
      id: 2,
      name: 'Malith Perera',
      date: 'Today',
      rating: 5.0,
      comment: 'The rental car was clean, reliable, and the service was quick and efficient. Overall, the experience was hassle-free and enjoyable.',
      image: 'https://i.pravatar.cc/150?u=malith',
    },
    {
      id: 3,
      name: 'Malith Perera',
      date: 'Today',
      rating: 5.0,
      comment: 'The rental car was clean, reliable, and the service was quick and efficient. Overall, the experience was hassle-free and enjoyable.',
      image: 'https://i.pravatar.cc/150?u=malith',
    },
  ];

  const rentalHistory = [
    {
      id: 1,
      title: 'Tesla Model S',
      owner: 'Malith Perera',
      period: '5 days | Rs: 15000.00',
      ended: 'Ended on 25 May, 2025',
      location: '5.6 km - Nugegoda',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=400&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'Tesla Model S',
      owner: 'Malith Perera',
      period: '5 days | Rs: 15000.00',
      ended: 'Ended on 25 May, 2025',
      location: '5.6 km - Nugegoda',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=400&auto=format&fit=crop',
    },
    {
      id: 3,
      title: 'Tesla Model S',
      owner: 'Malith Perera',
      period: '5 days | Rs: 15000.00',
      ended: 'Ended on 25 May, 2025',
      location: '5.6 km - Nugegoda',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=400&auto=format&fit=crop',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <ScreenHeader title="Profile" rightIcon="ellipsis-horizontal" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Info */}
        <View className="items-center mt-4">
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop' }} 
            style={{ width: 100, height: 100, borderRadius: 50 }} 
          />
          <View className="flex-row items-center mt-4 gap-x-2">
            <Text className="text-xl font-bold">Jithmi Shihara</Text>
            <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
            <Text>🏆</Text>
          </View>
          <Text className="text-gray-400 text-xs mt-1">jithmishihara@gmail.com</Text>
          <Text className="text-gray-400 text-[10px] mt-1">Joined 2021</Text>
        </View>

        {/* Stats Section Component */}
        <StatsSection stats={stats} />

        {/* About */}
        <View className="mt-8" style={PaddingStyles.page}>
          <Text className="text-base font-bold mb-2">About</Text>
          <Text className="text-gray-400 text-sm leading-5">
            I'm a photographer and love to travel. I'm always looking for new gear to try out and share my experiences with others.
          </Text>
        </View>

        {/* Verified Details */}
        <View className="mt-8 space-y-4" style={PaddingStyles.page}>
          {verifiedDetails.map((detail, index) => (
            <View key={index} className="mb-4">
              <Text className="text-sm font-bold text-gray-800">{detail.label}</Text>
              <View className="flex-row justify-between items-center mt-2">
                <Text className="text-xs text-gray-400">{detail.value}</Text>
                <VerifiedBadge />
              </View>
            </View>
          ))}
        </View>

        {/* Reviews Summary */}
        <View className="mt-8" style={PaddingStyles.page}>
          <Text className="text-base font-bold mb-4">Reviews</Text>
          <View className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <View className="flex-row items-center gap-x-4 mb-6">
                <Text className="text-5xl font-bold">4.0</Text>
                <View>
                    <View className="flex-row gap-x-1">
                        {[1, 2, 3, 4].map(s => <Ionicons key={s} name="star" size={16} color="#FFD700" />)}
                        <Ionicons name="star-outline" size={16} color="#FFD700" />
                    </View>
                    <Text className="text-gray-400 text-xs mt-1">1k reviews</Text>
                </View>
            </View>

            <TouchableOpacity 
                onPress={() => setIsReviewPopupVisible(true)}
                className="bg-[#2FA2B9] h-12 rounded-2xl items-center justify-center mb-6"
            >
                <Text className="text-white font-bold">Write a review</Text>
            </TouchableOpacity>

            {/* Progress Bars */}
            {[5, 4, 3, 2, 1].map((r) => (
                <ProgressBar 
                   key={r}
                   label={`${r}.0`}
                   progress={r * 15}
                   subLabel="5k reviews"
                />
            ))}
          </View>
        </View>

        {/* Individual Reviews */}
        <View className="mt-6" style={PaddingStyles.page}>
           {reviews.map((rev) => (
             <ReviewCard 
               key={rev.id}
               name={rev.name}
               image={rev.image}
               rating={rev.rating}
               comment={rev.comment}
               date={rev.date}
             />
           ))}
           <TouchableOpacity className="h-12 border border-cyan-500 rounded-full items-center justify-center mt-2">
              <Text className="text-cyan-500 font-bold text-sm">View all</Text>
           </TouchableOpacity>
        </View>

        {/* Rental History */}
        <View className="mt-8" style={PaddingStyles.page}>
           <Text className="text-base font-bold mb-4">Rental History</Text>
           {rentalHistory.map((item) => (
             <RentalHistoryCard key={item.id} item={item} />
           ))}
           <TouchableOpacity className="h-12 border border-cyan-500 rounded-full items-center justify-center mt-2">
              <Text className="text-cyan-500 font-bold text-sm">View all</Text>
           </TouchableOpacity>
        </View>
      </ScrollView>

      <ReviewPopup 
        isVisible={isReviewPopupVisible}
        onClose={() => setIsReviewPopupVisible(false)}
        onSubmit={(rating, feedback) => {
            console.log('Review submitted:', { rating, feedback });
            // Handle submission logic here
        }}
      />
    </SafeAreaView>
  );
}
