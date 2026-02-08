import ActionButtons from '@/components/itemDetails/ActionButtons';
import ImageSlider from '@/components/itemDetails/ImageSlider';
import ItemReviews from '@/components/itemDetails/ItemReviews';
import OwnerAbout from '@/components/itemDetails/OwnerAbout';
import TrustBanners from '@/components/itemDetails/TrustBanners';
import { PaddingStyles } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const itemImages = [
  'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=400&auto=format&fit=crop',
];

const reviews = [
  {
    id: 1,
    name: 'Mr. Jack',
    rating: 5.0,
    comment: 'The rental car was clean, reliable, and the service was quick and efficient.',
    image: 'https://i.pravatar.cc/150?u=jack',
  },
  {
    id: 2,
    name: 'Mr. Jack',
    rating: 5.0,
    comment: 'The rental car was clean, reliable, and the service was quick and efficient.',
    image: 'https://i.pravatar.cc/150?u=jack2',
  },
];

const ownerData = {
    name: 'Malith Perera',
    image: 'https://i.pravatar.cc/150?u=malith',
    memberSince: '2018',
    rating: '5.0 (11 reviews)',
    listings: '181'
};

export default function ItemDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('Description');

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between py-4" style={PaddingStyles.page}>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Item details</Text>
        <View className="flex-row items-center gap-x-2">
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-gray-50">
                <Ionicons name="share-outline" size={22} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-gray-50">
                <Ionicons name="heart-outline" size={22} color="#000" />
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Image Slider Component */}
        <ImageSlider images={itemImages} />

        <View style={PaddingStyles.page} className="mt-6">
            <View className="flex-row items-center gap-x-4 mb-4">
                <View className="flex-row items-center">
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text className="text-xs font-bold ml-1">5.0 (11 Reviews)</Text>
                </View>
                <View className="flex-row items-center">
                    <Ionicons name="location-outline" size={14} color="#2FA2B9" />
                    <Text className="text-xs text-[#2FA2B9] font-medium ml-1">5.6 km - Nugegoda</Text>
                </View>
            </View>

            <View className="flex-row items-center gap-x-2">
                <Text className="text-2xl font-bold">Tesla Model 3</Text>
                <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
            </View>

            <Text className="text-gray-500 text-sm mt-2 leading-5">
                A car with high space that is rented. A car with high space that is rented all at an affordable price.
            </Text>

            <View className="mt-4 space-y-2">
                <View className="flex-row justify-between">
                    <Text className="text-gray-400 text-xs">Vehicle Number :</Text>
                    <Text className="text-gray-800 text-xs font-semibold">LJC3456</Text>
                </View>
                <View className="flex-row justify-between">
                    <Text className="text-gray-400 text-xs">Insurance ID :</Text>
                    <Text className="text-gray-800 text-xs font-semibold">123456</Text>
                </View>
                <View className="flex-row justify-between">
                    <Text className="text-gray-400 text-xs">Insurance Expiry Date :</Text>
                    <Text className="text-gray-800 text-xs font-semibold">31 May 2026</Text>
                </View>
            </View>

            {/* Tags */}
            <View className="flex-row flex-wrap gap-2 mt-6">
                <View className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <Text className="text-gray-400 text-[10px] font-medium">Used like new condition</Text>
                </View>
                <View className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <Text className="text-gray-400 text-[10px] font-medium">Delivery available</Text>
                </View>
                <View className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <Text className="text-gray-400 text-[10px] font-medium">With Driver</Text>
                </View>
                <View className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <Text className="text-gray-400 text-[10px] font-medium">Pickup at owners location available</Text>
                </View>
            </View>

            {/* Rental Fee Section */}
            <View className="mt-8">
                <Text className="text-base font-bold mb-4">Rental Fee</Text>
                <View className="flex-row items-baseline gap-x-1 mb-4">
                    <Text className="text-[#2FA2B9] text-sm font-bold">Rs: 1500.00</Text>
                    <Text className="text-gray-400 text-xs">- Daily Rental</Text>
                </View>
                
                <View className="flex-row gap-x-4">
                    <View className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <Text className="text-sm font-bold text-gray-800">Rs: 12150.00</Text>
                        <Text className="text-xs text-gray-400 mt-1">14 days</Text>
                    </View>
                    <View className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <Text className="text-sm font-bold text-gray-800">Rs: 2100.00</Text>
                        <Text className="text-xs text-gray-400 mt-1">7 days</Text>
                    </View>
                </View>
            </View>

            {/* Date Pickers Placeholder */}
            <View className="mt-8">
                <Text className="text-base font-bold mb-4">Your Rental</Text>
                <View className="flex-row gap-x-4">
                    <View className="flex-1">
                        <Text className="text-xs font-medium text-gray-800 mb-2">Pickup Date</Text>
                        <TouchableOpacity className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex-row justify-between items-center">
                            <Text className="text-gray-400 text-xs">yyyy-mm-dd</Text>
                            <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1">
                        <Text className="text-xs font-medium text-gray-800 mb-2">Return Date</Text>
                        <TouchableOpacity className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex-row justify-between items-center">
                            <Text className="text-gray-400 text-xs">yyyy-mm-dd</Text>
                            <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Availability Calendar Placeholder */}
            <View className="mt-8">
                <Text className="text-base font-bold mb-4">Availability</Text>
                <View className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm">
                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-row items-center gap-x-2 bg-cyan-500 px-3 py-2 rounded-xl">
                            <Ionicons name="time-outline" size={16} color="white" />
                            <Text className="text-white text-xs font-bold">10 : 30 am</Text>
                        </View>
                        <View className="flex-row items-center gap-x-2 border border-gray-100 px-3 py-2 rounded-xl">
                            <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                            <Text className="text-gray-400 text-xs">05 : 30 pm</Text>
                        </View>
                    </View>
                    <Text className="text-center font-bold mb-4 text-sm">January 2022</Text>
                    {/* Simplified Calendar UI */}
                    <View className="flex-row justify-between mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                            <Text key={d} className="text-[10px] text-gray-400 w-8 text-center">{d}</Text>
                        ))}
                    </View>
                    <View className="flex-row flex-wrap justify-between gap-y-2">
                        {Array.from({ length: 31 }).map((_, i) => (
                            <View 
                                key={i} 
                                className={`w-8 h-8 items-center justify-center rounded-full 
                                    ${i+1 === 6 ? 'bg-gray-800' : ''}
                                    ${[9, 17, 19, 23].includes(i+1) ? 'bg-red-500' : ''}
                                    ${i+1 === 20 || i+1 === 21 || i+1 === 22 ? 'bg-red-100' : ''}
                                `}
                            >
                                <Text className={`text-[10px] ${(i+1 === 6 || [9, 17, 19, 23].includes(i+1)) ? 'text-white' : 'text-gray-800'}`}>{i+1}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            {/* Owner Section Component */}
            <OwnerAbout owner={ownerData} />

            {/* Reviews Section Component */}
            <ItemReviews 
                reviews={reviews} 
                totalReviews={11} 
                onViewAll={() => router.push('/item/reviews')}
            />

            {/* Trust Banners Component */}
            <TrustBanners />

            {/* Tabs */}
            <View className="mt-8 flex-row border-b border-gray-100">
                {['Description', 'Rental Terms', 'Instructions to use'].map((tab) => (
                    <TouchableOpacity 
                        key={tab} 
                        onPress={() => setActiveTab(tab)}
                        className={`pb-2 mr-6 ${activeTab === tab ? 'border-b-2 border-cyan-500' : ''}`}
                    >
                        <Text className={`text-xs font-bold ${activeTab === tab ? 'text-cyan-600' : 'text-gray-400'}`}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Tab Content */}
            <View className="mt-4">
                <Text className="text-xs font-bold mb-2">Overview :</Text>
                <Text className="text-[10px] text-gray-400 leading-4">
                    Uncover hidden treasures with our easy to use metal detector available for hire. Perfect for hobbyists and adventure seekers exploring the beautiful landscapes around Ottawa.
                </Text>
                <Text className="text-[10px] text-gray-400 mt-2 leading-4">
                    Whether you're searching for historical artifacts or just having fun, this metal detector is ideal for both beginners and seasoned treasure hunters. Enjoy the thrill of discovery in nearby parks and open spaces!
                </Text>

                <Text className="text-xs font-bold mt-4 mb-2">What's included:</Text>
                {['Metal detector with adjustable stem', 'Headphones for clear audio signals', 'Carrying bag for easy transport', 'Instruction manual'].map((item, i) => (
                    <Text key={i} className="text-[10px] text-gray-400">• {item}</Text>
                ))}

                <TouchableOpacity className="mt-4">
                    <Text className="text-[#2FA2B9] text-xs font-bold underline">Read More</Text>
                </TouchableOpacity>
            </View>

            {/* Location Map Placeholder */}
            <View className="mt-8">
                <Text className="text-base font-bold mb-2">Location</Text>
                <Text className="text-[10px] text-gray-400 mb-4">
                    This item is available for pickup at owner location, delivery available to No:52, Nugegoda Road, Colombo.
                </Text>
                <View className="h-48 bg-gray-100 rounded-3xl overflow-hidden mb-4">
                    <Image 
                        source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop' }} 
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                    />
                </View>
                <TouchableOpacity className="h-12 border border-cyan-500 rounded-full items-center justify-center">
                    <Text className="text-cyan-500 font-bold">Got Direction</Text>
                </TouchableOpacity>
            </View>

            {/* Similar Items Placeholder */}
            <View className="mt-8">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-base font-bold">Similar Items</Text>
                    <TouchableOpacity>
                        <Text className="text-gray-400 text-xs font-medium">View All</Text>
                    </TouchableOpacity>
                </View>
                {/* Horizontal list of cards (simplified for now) */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-x-4 pb-4">
                     {/* One simplified card */}
                     <View className="bg-white rounded-3xl border border-gray-100 w-44 overflow-hidden shadow-sm">
                        <Image source={{ uri: itemImages[0] }} style={{ width: '100%', height: 100 }} contentFit="cover" />
                        <View className="p-3">
                            <Text className="text-cyan-600 text-[10px] font-bold">Rs: 1500 - per day</Text>
                            <Text className="font-bold text-xs mt-1" numberOfLines={1}>Tesla Model S</Text>
                            <Text className="text-gray-400 text-[8px]">Owner: Malith Perera</Text>
                        </View>
                     </View>
                     <View className="bg-white rounded-3xl border border-gray-100 w-44 overflow-hidden shadow-sm">
                        <Image source={{ uri: itemImages[0] }} style={{ width: '100%', height: 100 }} contentFit="cover" />
                        <View className="p-3">
                            <Text className="text-cyan-600 text-[10px] font-bold">Rs: 1500 - per day</Text>
                            <Text className="font-bold text-xs mt-1" numberOfLines={1}>Tesla Model S</Text>
                            <Text className="text-gray-400 text-[8px]">Owner: Malith Perera</Text>
                        </View>
                     </View>
                </ScrollView>
            </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Buttons Component */}
      <ActionButtons 
        onCreateBundle={() => router.push('/item/bundle')}
        onRequestRent={() => router.push('/item/rentalDetails')}
      />
    </SafeAreaView>
  );
}


