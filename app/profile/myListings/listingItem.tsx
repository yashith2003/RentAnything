import { ScreenHeader } from '@/components/layout/ScreenHeader';
import RatingStars from '@/components/ui/ratingStars';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for rentals
const RENTAL_REQUESTS = [
  {
    id: '1',
    user: {
      name: 'Malith Perera',
      avatar: 'https://i.pravatar.cc/150?u=1',
      verified: true,
      rating: 5,
    },
    bookingDate: 'Jan 09 2025',
    days: 5,
    price: 15000.00,
    withDriver: true,
    status: 'Active',
  },
  {
    id: '2',
    user: {
      name: 'Malith Perera',
      avatar: 'https://i.pravatar.cc/150?u=2',
      verified: true,
      rating: 5,
    },
    bookingDate: 'Jan 09 2025',
    days: 5,
    price: 15000.00,
    withDriver: true,
    status: 'Active',
  },
  {
    id: '3',
    user: {
      name: 'Malith Perera',
      avatar: 'https://i.pravatar.cc/150?u=3',
      verified: true,
      rating: 5,
    },
    bookingDate: 'Jan 09 2025',
    days: 5,
    price: 15000.00,
    withDriver: true,
    status: 'Active',
  },
  {
    id: '4',
    user: {
      name: 'Malith Perera',
      avatar: 'https://i.pravatar.cc/150?u=4',
      verified: true,
      rating: 5,
    },
    bookingDate: 'Jan 09 2025',
    days: 5,
    price: 15000.00,
    withDriver: true,
    status: 'Active',
  },
];

export default function ListingItemScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScreenHeader title="My Listings" />

      <ScrollView className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)}`} showsVerticalScrollIndicator={false}>
        
        {/* Product Card */}
        <TouchableOpacity 
          className="flex-row p-3 bg-gray-50 rounded-[28px] mb-6"
          activeOpacity={0.8}
          onPress={() => router.push(`/item/1`)} // Using mock ID 1 for now
        >
          <View className="w-24 h-20 bg-white rounded-xl overflow-hidden mr-3">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=400&auto=format&fit=crop' }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          </View>
          <View className="flex-1 justify-center">
            <Text className="font-bold text-base text-black mb-1">Tesla Model S</Text>
            <Text className="text-xs text-gray-400 leading-4 mb-1" numberOfLines={2}>
              A car with high specs that are rented. A car with high specs that are rented at an affordable price.
            </Text>
            <Text className="text-xs text-gray-400">Used (like new)</Text>
          </View>
        </TouchableOpacity>

        {/* Rentals Count Header */}
        <Text className="font-bold text-base text-black mb-4">5 Rentals Available</Text>

        {/* Calendar / Date Picker Area */}
        <View className="bg-white rounded-[32px] border border-gray-100 p-4 mb-6 shadow-sm shadow-black/5" style={{ elevation: 2 }}>
          <Text className="font-bold text-base text-black mb-4">Time</Text>
          
          {/* Time Inputs Row */}
          <View className="flex-row gap-4 mb-6">
             <View className={`flex-1 flex-row items-center justify-between h-12 px-3 rounded-lg`} style={{ backgroundColor: Colors.primary }}>
                 <Ionicons name="time-outline" size={20} color="white" />
                 <Text className="text-white font-bold text-lg mx-2">10 : 30</Text>
                 <Text className="text-white font-bold text-sm">am</Text>
             </View>
             <View className="flex-1 flex-row items-center justify-between h-12 px-3 rounded-lg border border-gray-200 bg-white">
                 <Ionicons name="time-outline" size={20} color="#9CA3AF" />
                 <Text className="text-black font-bold text-lg mx-2">05 : 30</Text>
                 <Text className="text-black font-bold text-sm">pm</Text>
             </View>
          </View>

          {/* Calendar Header */}
          <View className="flex-row items-center justify-between mb-4">
             <TouchableOpacity hitSlop={10}>
                <Ionicons name="chevron-back" size={20} color="black" />
             </TouchableOpacity>
             <Text className="font-bold text-lg text-black">January 2022</Text>
             <TouchableOpacity hitSlop={10}>
                <Ionicons name="chevron-forward" size={20} color="black" />
             </TouchableOpacity>
          </View>

          {/* Days Grid (Mock) */}
          <View className="flex-row justify-between mb-2">
             {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                 <Text key={day} className="text-black font-semibold w-8 text-center">{day}</Text>
             ))}
          </View>
          {/* Dates (Mock Rows) */}
          <View className="gap-2">
              <View className="flex-row justify-between opacity-30">
                 {[26, 27, 28, 29, 30, 31, '01'].map((d, i) => (
                     <Text key={i} className="text-gray-800 w-8 text-center py-1">{d}</Text>
                 ))}
              </View>
              <View className="flex-row justify-between">
                 {[2, 3, 4, 5].map((d, i) => (
                     <Text key={i} className="text-black font-medium w-8 text-center py-1">{d}</Text>
                 ))}
                 <View className="w-8 h-8 rounded-full bg-gray-700 items-center justify-center">
                    <Text className="text-white font-bold">6</Text>
                 </View>
                 <Text className="text-black font-medium w-8 text-center py-1">7</Text>
                 <Text className="text-black font-medium w-8 text-center py-1">8</Text>
              </View>
              <View className="flex-row justify-between items-center">
                 <View className="w-8 h-8 rounded-full bg-red-500 items-center justify-center">
                    <Text className="text-white font-bold">9</Text>
                 </View>
                 <Text className="text-black font-medium w-8 text-center py-1">10</Text>
                 <Text className="text-black font-medium w-8 text-center py-1">11</Text>
                 <Text className="text-black font-medium w-8 text-center py-1">12</Text>
                 <Text className="text-black font-medium w-8 text-center py-1">13</Text>
                 <Text className="text-black font-medium w-8 text-center py-1">14</Text>
                 <Text className="text-black font-medium w-8 text-center py-1">15</Text>
              </View>
              <View className="flex-row justify-between items-center">
                 <Text className="text-black font-medium w-8 text-center py-1">16</Text>
                  <View className="w-8 h-8 rounded-full bg-red-500 items-center justify-center">
                   <Text className="text-white font-bold">17</Text>
                </View>
                 <Text className="text-black font-medium w-8 text-center py-1">18</Text>
                 
                 {/* Range selection mock */}
                 <View className="absolute left-[110px] w-32 h-8 bg-red-100 rounded-full -z-10" />

                  <View className="w-8 h-8 rounded-full bg-red-500 items-center justify-center">
                   <Text className="text-white font-bold">19</Text>
                </View>
                 <Text className="text-red-500 font-medium w-8 text-center py-1">20</Text>
                 <Text className="text-red-500 font-medium w-8 text-center py-1">21</Text>
                  <View className="w-8 h-8 rounded-full bg-red-500 items-center justify-center">
                   <Text className="text-white font-bold">22</Text>
                </View>
              </View>
                <View className="flex-row justify-between mt-1">
                 {[23, 24, 25, 26, 27, 28, 29].map((d, i) => (
                     <Text key={i} className="text-black font-medium w-8 text-center py-1">{d}</Text>
                 ))}
              </View>
               <View className="flex-row justify-between opacity-30 mt-1">
                 {[30, 1, 2, 3, 4, 5, 6].map((d, i) => (
                     <Text key={i} className="text-gray-800 w-8 text-center py-1">{d}</Text>
                 ))}
              </View>
          </View>
        </View>

        {/* Rental List */}
        {RENTAL_REQUESTS.map((item) => (
          <View 
            key={item.id}
            className="bg-white border border-gray-100 rounded-[32px] p-4 mb-4 shadow-sm shadow-black/5"
            style={{ elevation: 2 }}
          >
             <View className="flex-row items-center justify-between mb-2">
                 <View className="flex-row items-center gap-2">
                     <Image 
                       source={{ uri: item.user.avatar }} 
                       style={{ width: 32, height: 32, borderRadius: 16 }}
                       contentFit="cover"
                     />
                     <Text className="font-bold text-sm text-black">{item.user.name}</Text>
                     {item.user.verified && <Ionicons name="checkmark-circle" size={14} color="#3B82F6" />}
                 </View>
                 <View className="bg-green-50 px-2 py-1 rounded-md">
                   <Text className="text-green-600 text-xs font-semibold">{item.status}</Text>
                 </View>
             </View>

             <View className="mb-2">
               <RatingStars rating={item.user.rating} size={14} activeColor="#F59E0B" inactiveColor="#E5E7EB" />
             </View>

             <View className="mb-1">
               <Text className="text-xs text-gray-400 font-medium">Booking: <Text className="text-gray-500">{item.bookingDate}</Text></Text>
             </View>

             <View className="flex-row justify-between items-end">
               <View>
                 <Text className="text-xs text-gray-600 font-semibold">{item.days} days | <Text className="text-[#2FA2B9]">Rs:{item.price.toFixed(2)}</Text></Text>
               </View>
               <Text className="text-xs text-gray-400">With Driver</Text>
             </View>
          </View>
        ))}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
