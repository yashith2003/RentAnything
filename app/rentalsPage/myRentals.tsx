//RentAnything/app/rentalsPage/myRentals.tsx

import SearchBar from '@/components/form/searchbar';
import CancelRentalPopup from '@/components/modal/CancelRentalPopup';
import ConditionConfirmationPopup from '@/components/modal/ConditionConfirmationPopup';
import RentalCancelledPopup from '@/components/modal/RentalCancelledPopup';
import SuccessPopup from '@/components/AlertPopup/SuccessPopup';
import StatusTabGroup from '@/components/shared/StatusTabGroup';
import SummaryBanner from '@/components/shared/SummaryBanner';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

type StatusType = 'upcoming' | 'inprogress' | 'completed' | 'cancelled';

const rentalItems = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?q=80&w=400&auto=format&fit=crop',
    title: 'Tesla Model S',
    owner: 'Malith Perera',
    duration: '5 days',
    price: 'Rs: 15000.00',
    distance: '5.6 km',
    location: 'Nugegoda',
    daysRemaining: '2 Days Remaining',
    startDate: 'Starts on Sep 10, 2024',
    status: 'upcoming' as StatusType,
    collected: false,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop',
    title: 'Tesla Model S',
    owner: 'Malith Perera',
    duration: '5 days',
    price: 'Rs: 15000.00',
    distance: '5.6 km',
    location: 'Nugegoda',
    daysRemaining: '2 Days left',
    startDate: 'Sep 10, 2024 - 9:30 AM',
    status: 'inprogress' as StatusType,
    collected: true,
  },
];

export default function MyRentals() {
  const router = useRouter();
  const [activeStatus, setActiveStatus] = useState<StatusType>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const statusTabs = [
    { key: 'upcoming' as StatusType, label: 'Upcoming' },
    { key: 'inprogress' as StatusType, label: 'InProgress' },
    { key: 'completed' as StatusType, label: 'Completed' },
    { key: 'cancelled' as StatusType, label: 'Cancelled' },
  ];

  const [isCancelModalVisible, setCancelModalVisible] = useState(false);
  const [isConditionModalVisible, setConditionModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isRentalCancelledModalVisible, setRentalCancelledModalVisible] = useState(false);
  const [selectedRentalId, setSelectedRentalId] = useState<number | null>(null);

  const filteredRentals = rentalItems.filter((item) => item.status === activeStatus);

  const handleCancelPress = (id: number) => {
    setSelectedRentalId(id);
    setCancelModalVisible(true);
  };

  const handleCollectPress = (id: number, status: StatusType) => {
    setSelectedRentalId(id);
    if (status === 'inprogress') {
      router.push('/rentalsPage/extendRental');
    } else {
      setConditionModalVisible(true);
    }
  };

  const handleConfirmCancel = () => {
    // Logic to cancel rental would go here
    console.log(`Cancelling rental ${selectedRentalId}`);
    setCancelModalVisible(false);
    setRentalCancelledModalVisible(true);
  };

  const handleRentalCancelledNext = () => {
    setRentalCancelledModalVisible(false);
    setSelectedRentalId(null);
  };

  const handleConditionSubmit = (data: any) => {
      console.log('Condition Submitted:', data);
      setConditionModalVisible(false);
      setSuccessModalVisible(true);
      // Update item status logic would go here
  };

  const handleSuccessNext = () => {
    setSuccessModalVisible(false);
    setSelectedRentalId(null);
  };

  return (
    <View className="flex-1 bg-white">
      {/* My Rental Requests Banner */}
      <SummaryBanner 
        title="My Rental Requests" 
        count="03" 
        onPress={() => console.log('My Rental Requests')}
      />

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        containerStyle={{ paddingHorizontal: Spacing.pageHorizontal, marginBottom: Spacing.lg }}
      />

      {/* Status Tabs */}
      <StatusTabGroup
        tabs={statusTabs}
        activeTab={activeStatus}
        onTabPress={setActiveStatus}
        containerStyle={`px-${getTailwindSpacing(Spacing.pageHorizontal)}`}
      />

      {/* Rental Items */}
      <ScrollView showsVerticalScrollIndicator={false} className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)} pb-10`}>
        {filteredRentals.map((item) => (
          <RentalCard 
            key={item.id} 
            item={item} 
            onCancelRental={() => handleCancelPress(item.id)}
            onCollect={() => handleCollectPress(item.id, item.status)}
          />
        ))}
        <View className="h-10" />
      </ScrollView>

      <CancelRentalPopup
        visible={isCancelModalVisible}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelModalVisible(false)}
      />

      <ConditionConfirmationPopup
        visible={isConditionModalVisible}
        onClose={() => setConditionModalVisible(false)}
        onSubmit={handleConditionSubmit}
      />

      <SuccessPopup
        visible={isSuccessModalVisible}
        onNext={handleSuccessNext}
        title="Success!"
        message="Your item condition has been successfully recorded."
      />

      <RentalCancelledPopup
        visible={isRentalCancelledModalVisible}
        onNext={handleRentalCancelledNext}
      />
    </View>
  );
}

function RentalCard({ item, onCancelRental, onCollect }: { item: any, onCancelRental: () => void, onCollect: () => void }) {
  return (
    <View className="bg-white border border-gray-100 rounded-[32px] p-5 mb-5 shadow-sm shadow-black/5" style={{ elevation: 2 }}>
      {/* Header with badges */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="bg-green-50 px-3 py-1.5 rounded-full">
          <Text className="text-[#2DB07E] text-xs font-semibold">{item.daysRemaining}</Text>
        </View>
        <Text className="text-[#F5C451] text-xs font-medium">{item.startDate}</Text>
      </View>

      {/* Content */}
      <View className="flex-row">
        {/* Product Image */}
        <View className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-50 mr-4">
          <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        </View>

        {/* Product Details */}
        <View className="flex-1">
          <Text className="text-lg font-bold text-black mb-1">{item.title}</Text>
          <Text className="text-xs text-gray-500 mb-1">Owner: {item.owner}</Text>
          <Text className="text-xs text-gray-400 font-bold mb-2">
            {item.duration} | <Text className="text-[#2FA2B9]">{item.price}</Text>
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="location-sharp" size={14} color="#2FA2B9" />
            <Text className="text-[#2FA2B9] text-xs font-medium ml-1">
              {item.distance} - {item.location}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row items-center mt-6 gap-x-3">
        <TouchableOpacity 
            className="flex-1 border-2 border-[#2FA2B9] rounded-full h-12 items-center justify-center"
            onPress={onCancelRental}
        >
          <Text className="text-[#2FA2B9] text-sm font-bold">Cancel Rental</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 rounded-full h-12 items-center justify-center ${
            item.status === 'inprogress' ? 'bg-[#2FA2B9]' : item.collected ? 'bg-[#A8A8A8]' : 'bg-[#2FA2B9]'
          }`}
          disabled={item.status !== 'inprogress' && item.collected}
          onPress={onCollect}
        >
          <Text className="text-white text-sm font-bold">
            {item.status === 'inprogress' ? 'Extend Rental' : item.collected ? 'Collected' : 'Collect'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
