//RentAnything/app/rentalsPage/extendRental.tsx

import IncidentReportPopup from '@/components/modal/IncidentReportPopup';
import { PaddingStyles } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExtendRentalScreen() {
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isIncidentPopupVisible, setIncidentPopupVisible] = useState(false);

  const itemImages = [
    'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop',
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between py-4 border-b border-gray-100" style={PaddingStyles.page}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full border border-gray-100 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black">Receipt</Text>
        <TouchableOpacity className="w-10 h-10 rounded-full border border-gray-100 items-center justify-center">
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Main Image */}
        <View className="w-full h-64 bg-gray-100">
          <Image 
            source={{ uri: itemImages[activeImageIndex] }} 
            style={{ width: '100%', height: '100%' }} 
            contentFit="contain" 
          />
        </View>

        {/* Image Pagination Dots */}
        <View className="flex-row justify-center items-center py-3 gap-x-2">
          {itemImages.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full ${index === activeImageIndex ? 'bg-gray-800' : 'bg-gray-300'}`}
            />
          ))}
        </View>

        {/* Thumbnail Images */}
        <View className="flex-row px-6 gap-x-3 mb-4">
          {itemImages.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveImageIndex(index)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${
                index === activeImageIndex ? 'border-[#2FA2B9]' : 'border-gray-200'
              }`}
            >
              <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={PaddingStyles.page}>
          {/* Item Title */}
          <View className="flex-row items-center mb-2">
            <Text className="text-xl font-bold text-black mr-2">Tesla Model S</Text>
            <View className="w-5 h-5 bg-[#2D8CFF] rounded-full items-center justify-center">
              <Ionicons name="checkmark" size={12} color="white" />
            </View>
            <TouchableOpacity 
              onPress={() => setIncidentPopupVisible(true)}
              className="ml-auto w-8 h-8 rounded-full border border-gray-200 items-center justify-center"
            >
              <Ionicons name="information-circle-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Rating and Location */}
          <View className="flex-row items-center mb-3">
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text className="text-xs text-gray-600 ml-1 mr-3">5.0 (5 Reviews)</Text>
            <Ionicons name="location-sharp" size={14} color="#2FA2B9" />
            <Text className="text-xs text-[#2FA2B9] ml-1">5.6 km - Nugegoda</Text>
          </View>

          {/* Description */}
          <Text className="text-xs text-gray-500 leading-5 mb-4">
            A car with high specs that are rented. A car with high specs that are rented at an affordable price.
          </Text>

          {/* Insurance Info */}
          <View className="mb-2">
            <Text className="text-xs text-gray-600">
              <Text className="font-bold">Vehicle Number:</Text> JCS456
            </Text>
          </View>
          <View className="mb-2">
            <Text className="text-xs text-gray-600">
              <Text className="font-bold">Insurance ID:</Text> 123456
            </Text>
          </View>
          <View className="mb-6">
            <Text className="text-xs text-gray-600">
              <Text className="font-bold">Insurance Expiry Date:</Text> 3, May, 2026
            </Text>
          </View>

          {/* Owner Information */}
          <Text className="text-base font-bold text-black mb-3">Owner information</Text>
          <View className="flex-row items-start mb-4 pb-4 border-b border-gray-100">
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?u=malith' }}
              style={{ width: 48, height: 48, borderRadius: 24 }}
              className="mr-3"
            />
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-sm font-bold text-black mr-1">Malith Perera</Text>
                <View className="w-4 h-4 bg-[#2D8CFF] rounded-full items-center justify-center">
                  <Ionicons name="checkmark" size={10} color="white" />
                </View>
              </View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text className="text-xs text-gray-600 ml-1 mr-3">5.0 (8 Reviews)</Text>
                <Text className="text-xs text-gray-600">10 Listings</Text>
              </View>
              <Text className="text-xs text-gray-500 leading-4 mb-3">
                I'm a rental car owner who's been in the business for over 5 years. With more than 8 years of experience, I ensure a smooth rental process and well-maintained vehicles. I'm here to help before, during, and after your rental. Let's make your trip easy and stress-free!
              </Text>
              <Text className="text-xs text-gray-600 mb-1">
                <Text className="font-bold">Phone Number:</Text> 076 9546790
              </Text>
              <Text className="text-xs text-gray-600">
                <Text className="font-bold">Address:</Text> No 481, Maharagama, Colombo
              </Text>
            </View>
            <View className="flex-row gap-x-2 ml-2">
              <TouchableOpacity className="w-8 h-8 rounded-full border border-gray-200 items-center justify-center">
                <Ionicons name="call" size={16} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity className="w-8 h-8 rounded-full border border-gray-200 items-center justify-center">
                <Ionicons name="chatbubble-ellipses" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Booking Details */}
          <Text className="text-base font-bold text-black mb-3">Booking Details</Text>
          <View className="mb-4">
            <DetailRow label="Location" value="Maharagama, Colombo" />
            <DetailRow label="Rental Rate" value="5 days" />
            <DetailRow label="Rental fee per day" value="Rs: 3000.00" />
            <DetailRow label="Return Date" value="22 Jan 24" />
            <DetailRow label="Pickup Date" value="17 Jan 24" />
            <DetailRow label="Rental Fee" value="Rs: 15000.00" />
            <DetailRow label="Security Deposit" value="Rs: 3000.00" />
            <DetailRow label="Total Amount" value="Rs: 18000.00" isTotal />
          </View>

          {/* Payment Details */}
          <Text className="text-base font-bold text-black mb-3">Payment Details</Text>
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xs text-gray-600">Payment Method</Text>
              <View className="flex-row items-center">
                <View className="w-6 h-4 bg-orange-500 rounded-sm mr-1" />
                <Text className="text-xs text-gray-800 font-medium">123 *** *** ***225</Text>
              </View>
            </View>
            <DetailRow label="Transaction Date" value="01 Jan 2024" />
            <DetailRow label="Transaction Time" value="10:30 am" />
            <DetailRow label="Rental Fee" value="Rs: 15000.00" />
            <DetailRow label="Security Deposit" value="Rs: 3000.00" />
            <DetailRow label="Total Amount" value="Rs: 18000.00" isTotal />
          </View>

          {/* Action Buttons */}
          <View className="gap-y-3 mb-8">
            <TouchableOpacity className="h-14 rounded-full bg-[#2FA2B9] items-center justify-center">
              <Text className="text-white font-bold text-base">Extend Rental</Text>
            </TouchableOpacity>
            <TouchableOpacity className="h-14 rounded-full border-2 border-[#2FA2B9] items-center justify-center">
              <Text className="text-[#2FA2B9] font-bold text-base">Cancel Rental</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <IncidentReportPopup 
        visible={isIncidentPopupVisible}
        onClose={() => setIncidentPopupVisible(false)}
        onSubmit={(data) => {
          console.log('Incident submitted:', data);
          setIncidentPopupVisible(false);
          router.push({
            pathname: '/profile/incident',
            params: { activeTab: 'My Incidents' }
          });
        }}
      />
    </SafeAreaView>
  );
}

function DetailRow({ label, value, isTotal = false }: { label: string; value: string; isTotal?: boolean }) {
  return (
    <View className={`flex-row justify-between items-center ${isTotal ? 'py-2 border-t border-gray-200 mt-2' : 'py-1.5'}`}>
      <Text className={`text-xs ${isTotal ? 'font-bold text-black' : 'text-gray-600'}`}>{label}</Text>
      <Text className={`text-xs ${isTotal ? 'font-bold text-black' : 'text-gray-800'}`}>{value}</Text>
    </View>
  );
}
