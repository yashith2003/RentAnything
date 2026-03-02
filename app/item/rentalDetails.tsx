//RentAnything/app/item/rentalDetails.tsx

import { ScreenHeader } from '@/components/layout/ScreenHeader';
import CalendarPickerPopup from '@/components/modal/CalendarPickerPopup';
import { PaddingStyles } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RentalDetailsScreen() {
  const router = useRouter();
  
  // State for form fields
  const [selectedRate, setSelectedRate] = useState('Day');
  const [withDriver, setWithDriver] = useState(false);
  const [gender, setGender] = useState('Male');
  const [capacity, setCapacity] = useState('4');
  const [fuelType, setFuelType] = useState('Electric');
  const [condition, setCondition] = useState('Used (Like New)');
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const [dates, setDates] = useState({
    start: '2025-07-31',
    end: '2025-07-31',
    startTime: '10:30 am',
    endTime: '05:30 pm'
  });

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />
      
      <ScreenHeader title="Rental details" rightIcon="ellipsis-horizontal" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={PaddingStyles.page} className="pt-4">
          
          {/* Personal Details */}
          <View className="mb-8">
            <Text className="text-base font-bold text-black mb-4">Personal Details</Text>
            
            <View className="mb-4">
               <View className="flex-row items-center border border-gray-100 rounded-2xl h-14 px-4 bg-white shadow-sm shadow-black/5">
                 <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                 <TextInput className="flex-1 ml-3 text-sm" placeholder="Full Name*" placeholderTextColor="#9CA3AF" />
               </View>
            </View>

            <View className="mb-4">
               <View className="flex-row items-center border border-gray-100 rounded-2xl h-14 px-4 bg-white shadow-sm shadow-black/5">
                 <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                 <TextInput className="flex-1 ml-3 text-sm" placeholder="Email Address*" placeholderTextColor="#9CA3AF" />
               </View>
            </View>

            <View className="mb-4">
               <View className="flex-row items-center border border-gray-100 rounded-2xl h-14 px-4 bg-white shadow-sm shadow-black/5">
                 <Ionicons name="call-outline" size={20} color="#9CA3AF" />
                 <TextInput className="flex-1 ml-3 text-sm" placeholder="Contact*" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" />
               </View>
            </View>
          </View>

          {/* Rental Rate */}
          <View className="mb-8">
            <Text className="text-sm font-bold text-black mb-4">Rental Rate</Text>
            <View className="flex-row gap-x-3">
               {['Hour', 'Day', 'Weekly', 'Monthly'].map(rate => (
                 <TouchableOpacity 
                   key={rate}
                   onPress={() => setSelectedRate(rate)}
                   className={`flex-1 h-10 rounded-xl items-center justify-center border ${selectedRate === rate ? 'bg-[#2FA2B9] border-[#2FA2B9]' : 'bg-white border-gray-100'}`}
                 >
                   <Text className={`text-xs font-medium ${selectedRate === rate ? 'text-white' : 'text-gray-400'}`}>{rate}</Text>
                 </TouchableOpacity>
               ))}
            </View>
          </View>

          {/* Duration */}
          <View className="mb-8">
            <Text className="text-sm font-bold text-black mb-4">Duration</Text>
            <View className="flex-row gap-x-4">
                <View className="flex-1">
                    <Text className="text-[10px] font-bold text-gray-800 mb-2">Pick-up Date</Text>
                    <TouchableOpacity 
                        onPress={() => setIsCalendarVisible(true)}
                        className="flex-row justify-between items-center h-12 px-4 border border-gray-100 rounded-xl bg-white"
                    >
                        <Text className="text-gray-400 text-xs">{dates.start}</Text>
                        <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
                <View className="flex-1">
                    <Text className="text-[10px] font-bold text-gray-800 mb-2">Return Date</Text>
                    <TouchableOpacity 
                        onPress={() => setIsCalendarVisible(true)}
                        className="flex-row justify-between items-center h-12 px-4 border border-gray-100 rounded-xl bg-white"
                    >
                        <Text className="text-gray-400 text-xs">{dates.end}</Text>
                        <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </View>
          </View>

          {/* Location */}
          <View className="mb-8">
            <Text className="text-sm font-bold text-black mb-4">Location</Text>
            <View className="flex-row items-center h-12 px-4 border border-gray-100 rounded-xl bg-white">
                <Ionicons name="location-outline" size={20} color="#9CA3AF" />
                <TextInput className="flex-1 ml-3 text-xs" placeholder="Shore Dr. Chicago 0062 Usa" placeholderTextColor="#9CA3AF" />
            </View>
          </View>

          {/* Book with driver */}
          <View className="mb-8 flex-row justify-between items-center">
             <View className="flex-1 mr-4">
                <Text className="text-sm font-bold text-black">Book with driver</Text>
                <Text className="text-[10px] text-gray-400 mt-1">Don't have a driver? Book with the driver.</Text>
                <Text className="text-[#2FA2B9] text-[9px] mt-0.5">[Rs:1000/hr Driver fee]</Text>
             </View>
             <Switch 
                value={withDriver} 
                onValueChange={setWithDriver} 
                trackColor={{ false: '#E5E7EB', true: '#2FA2B9' }}
                thumbColor="#FFFFFF"
             />
          </View>

          {/* Gender */}
          <View className="mb-8">
             <Text className="text-sm font-bold text-black mb-4">Gender</Text>
             <View className="flex-row gap-x-3">
                {[
                  { label: 'Male', icon: 'male-outline' },
                  { label: 'Female', icon: 'female-outline' },
                  { label: 'Others', icon: 'transgender-outline' }
                ].map((item) => (
                  <TouchableOpacity 
                    key={item.label}
                    onPress={() => setGender(item.label)}
                    className={`flex-1 h-12 rounded-xl flex-row items-center justify-center border ${gender === item.label ? 'bg-[#2FA2B9] border-[#2FA2B9]' : 'bg-white border-gray-100'}`}
                  >
                    <Ionicons name={item.icon as any} size={18} color={gender === item.label ? 'white' : '#9CA3AF'} />
                    <Text className={`text-xs font-medium ml-2 ${gender === item.label ? 'text-white' : 'text-gray-400'}`}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
             </View>
          </View>

          {/* Vehicle Type Placeholder */}
          <View className="mb-8">
            <Text className="text-sm font-bold text-black mb-4">Vehicle Type</Text>
            <TouchableOpacity className="flex-row justify-between items-center h-12 px-4 border border-gray-100 rounded-xl bg-white">
                <Text className="text-gray-400 text-xs">Select vehicle type</Text>
                <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Siting Capacity */}
          <View className="mb-8">
             <Text className="text-sm font-bold text-black mb-4">Siting Capacity</Text>
             <View className="flex-row gap-x-4">
                {['2', '4', '6', '8', '10'].map(val => (
                  <TouchableOpacity 
                    key={val}
                    onPress={() => setCapacity(val)}
                    className={`flex-1 h-12 rounded-xl items-center justify-center border ${capacity === val ? 'bg-[#2FA2B9] border-[#2FA2B9]' : 'bg-white border-gray-100'}`}
                  >
                    <Text className={`text-xs font-medium ${capacity === val ? 'text-white' : 'text-gray-400'}`}>{val}</Text>
                  </TouchableOpacity>
                ))}
             </View>
          </View>

          {/* Colors */}
          <View className="mb-8">
             <Text className="text-sm font-bold text-black mb-4">Colors</Text>
             <View className="flex-row gap-x-6">
                {[
                  { name: 'White', color: '#FFFFFF', border: true },
                  { name: 'Gray', color: '#D1D5DB' },
                  { name: 'Blue', color: '#1D4ED8' },
                  { name: 'Black', color: '#000000' }
                ].map(c => (
                  <View key={c.name} className="flex-row items-center gap-x-2">
                    <View 
                      style={{ backgroundColor: c.color }} 
                      className={`w-6 h-6 rounded-full ${c.border ? 'border border-gray-100' : ''}`} 
                    />
                    <Text className="text-[10px] text-gray-400">{c.name}</Text>
                  </View>
                ))}
             </View>
          </View>

          {/* Fuel Type */}
          <View className="mb-8">
             <Text className="text-sm font-bold text-black mb-4">Fuel Type</Text>
             <View className="flex-row gap-x-4">
                {['Electric', 'Petrol', 'Diesel', 'Hybrid'].map(val => (
                  <TouchableOpacity 
                    key={val}
                    onPress={() => setFuelType(val)}
                    className={`flex-1 h-12 rounded-xl items-center justify-center border ${fuelType === val ? 'bg-[#2FA2B9] border-[#2FA2B9]' : 'bg-white border-gray-100'}`}
                  >
                    <Text className={`text-xs font-medium ${fuelType === val ? 'text-white' : 'text-gray-400'}`}>{val}</Text>
                  </TouchableOpacity>
                ))}
             </View>
          </View>

          {/* Condition */}
          <View className="mb-8">
             <Text className="text-sm font-bold text-black mb-4">Condition of the item</Text>
             <View className="flex-row flex-wrap gap-4">
                {['Brand New', 'Used (Like New)', 'Used (Good)', 'Used (Fair)', "It's a service"].map(val => (
                  <TouchableOpacity 
                    key={val}
                    onPress={() => setCondition(val)}
                    className={`px-4 h-12 rounded-xl items-center justify-center border ${condition === val ? 'bg-[#2FA2B9] border-[#2FA2B9]' : 'bg-white border-gray-100'}`}
                  >
                    <Text className={`text-xs font-medium ${condition === val ? 'text-white' : 'text-gray-400'}`}>{val}</Text>
                  </TouchableOpacity>
                ))}
             </View>
          </View>

          {/* Rental Fee Section */}
          <View className="mb-8">
             <Text className="text-sm font-bold text-black mb-2">Rental Fee</Text>
             <Text className="text-[#2FA2B9] text-[10px] font-bold mb-4">Rs: 1500.00 <Text className="text-gray-400 font-normal">. Daily Rental</Text></Text>
             
             <View className="flex-row gap-x-4 mb-4">
                <View className="flex-1 bg-cyan-50 border border-cyan-100 p-4 rounded-2xl items-center">
                    <Text className="text-[#2FA2B9] text-sm font-bold">Rs: 12000.00</Text>
                    <Text className="text-[#2FA2B9] text-xs mt-1">15 days</Text>
                </View>
                <View className="flex-1 bg-gray-50 border border-gray-100 p-4 rounded-2xl items-center">
                    <Text className="text-gray-800 text-sm font-bold">Rs: 2000.00</Text>
                    <Text className="text-gray-400 text-xs mt-1">2 days</Text>
                </View>
                <View className="flex-1 bg-gray-50 border border-gray-100 p-4 rounded-2xl items-center">
                    <Text className="text-gray-800 text-sm font-bold">Rs: 2000.00</Text>
                    <Text className="text-gray-400 text-xs mt-1">2 days</Text>
                </View>
             </View>

             <View className="flex-row items-center bg-white border border-gray-50 p-3 rounded-2xl gap-x-3">
                <Ionicons name="shield-checkmark-outline" size={18} color="#2FA2B9" />
                <Text className="text-[9px] text-gray-400 leading-4 flex-1">
                  To enhance security, we will implement a refundable security deposit of Rs: 3000, ensuring a safe and protected experience for all users.
                </Text>
             </View>
          </View>

          {/* Delivery Method */}
          <View className="mb-8">
             <Text className="text-sm font-bold text-black mb-4">Delivery Method</Text>
             <View className="space-y-4">
                {[
                  { label: 'Delivery by Owner', price: 'Rs: 500.00' },
                  { label: 'Pickup by Owner', price: 'Rs: 500.00' },
                  { label: 'Self Pickup', price: 'Rs: 0.00', sub: 'I will pick up at the owner\'s location' },
                  { label: 'Self Return', price: 'Rs: 0.00', sub: 'I will return at the owner\'s location' }
                ].map((item, i) => (
                  <TouchableOpacity key={i} className="flex-row items-center justify-between border-b border-gray-50 pb-4">
                    <View className="flex-row items-center flex-1 pr-4">
                       <View className="w-5 h-5 border border-gray-200 rounded flex items-center justify-center mr-3">
                           {i === 0 && <Ionicons name="checkmark" size={12} color="#2FA2B9" />}
                       </View>
                       <View className="flex-1">
                          <Text className="text-[11px] font-bold text-gray-800">{item.label}</Text>
                          {item.sub && <Text className="text-[9px] text-gray-400 mt-0.5">{item.sub}</Text>}
                       </View>
                    </View>
                    <Text className="text-[11px] font-bold text-gray-800">{item.price}</Text>
                  </TouchableOpacity>
                ))}
             </View>
             
             <View className="mt-6 space-y-2">
                <View className="flex-row items-center gap-x-2">
                    <Ionicons name="refresh-circle-outline" size={16} color="#2FA2B9" />
                    <Text className="text-[10px] text-gray-400 font-medium">50% refund with 72+ hours notice.</Text>
                </View>
                <View className="flex-row items-center gap-x-2">
                    <Ionicons name="shield-outline" size={16} color="#2FA2B9" />
                    <Text className="text-[10px] text-gray-400 font-medium">Verification - Valid driving license or passport.</Text>
                </View>
             </View>
          </View>

          {/* Footer Button */}
          <TouchableOpacity className="bg-[#2FA2B9] h-14 rounded-full items-center justify-center mt-8 shadow-lg shadow-black/10">
              <Text className="text-white text-base font-bold">Send Request</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      <CalendarPickerPopup 
        isVisible={isCalendarVisible}
        onClose={() => setIsCalendarVisible(false)}
        onDone={(data) => {
            setDates({
                start: data.startDate,
                end: data.endDate,
                startTime: data.startTime,
                endTime: data.endTime
            });
            setIsCalendarVisible(false);
        }}
      />
    </SafeAreaView>
  );
}
