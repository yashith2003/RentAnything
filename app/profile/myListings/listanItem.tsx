import { ChipGroup } from '@/components/form/ChipGroup';
import { LabelledInput } from '@/components/form/LabelledInput';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { UploadBox } from '@/components/form/UploadBox';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ListAnItemScreen() {
  const router = useRouter();
  const [rentalRate, setRentalRate] = useState('Day');
  const [sittingCapacity, setSittingCapacity] = useState(4);
  const [fuelType, setFuelType] = useState('Petrol');
  const [color, setColor] = useState('Blue');
  const [condition, setCondition] = useState('New (like new)');
  const [access, setAccess] = useState('Delivery available');
  const [driverGender, setDriverGender] = useState('Male');
  const [bookWithDriver, setBookWithDriver] = useState(true);
  const [bumpEnabled, setBumpEnabled] = useState(true);
  const [bumpPlan, setBumpPlan] = useState('Standard');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScreenHeader title="List an item" />

      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        <LabelledInput label="Item Name" placeholder="Type here..." />
        <LabelledInput label="Phone Number" placeholder="Type here..." />

        {/* Image Upload */}
        <View className="mb-6">
          <Text className="text-sm font-bold text-black mb-2">Image</Text>
          <UploadBox height={160} />
        </View>

        {/* Location */}
        <View className="mb-6">
          <Text className="text-sm font-bold text-black mb-2">Location</Text>
          <View className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 flex-row items-center">
            <Ionicons name="navigate-outline" size={20} color="#D1D5DB" />
            <Text className="flex-1 ml-2 text-gray-400">Union St, Chicago 2002 Usa</Text>
          </View>
        </View>

        <LabelledInput label="Item Description" placeholder="Type here..." multiline />
        <LabelledInput label="Rental Terms" placeholder="Type here..." multiline />
        <LabelledInput label="Instructions to use" placeholder="Type here..." multiline />

        {/* Rental Rate */}
        <ChipGroup 
          label="Rental Rate" 
          options={['Hour', 'Day', 'Weekly', 'Monthly']} 
          selected={rentalRate} 
          onSelect={setRentalRate} 
        />

        <LabelledInput label={`Rental fee per ${rentalRate.toLowerCase()}`} placeholder="Type here..." />

        {/* Availability (Mock) */}
        <View className="mb-6">
          <Text className="text-sm font-bold text-black mb-3">Availability</Text>
          <View className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
             {/* Time Row */}
             <View className="flex-row gap-4 mb-4">
                <View className="flex-1 h-10 bg-[#2FA2B9] rounded-lg items-center justify-center flex-row">
                   <Ionicons name="time-outline" size={16} color="white" />
                   <Text className="text-white font-bold ml-2">10 : 30 am</Text>
                </View>
                <View className="flex-1 h-10 border border-gray-200 rounded-lg items-center justify-center flex-row">
                   <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                   <Text className="text-gray-500 font-bold ml-2">05 : 30 pm</Text>
                </View>
             </View>
             {/* Calendar Mock */}
             <View className="items-center py-2 border-t border-gray-50">
                <Text className="font-bold text-gray-800">January 2022</Text>
                {/* Simplified Grid */}
                <View className="flex-row justify-between w-full px-2 mt-4">
                  {[1, 9, 17, 19, 22].map((d) => (
                    <View key={d} className={`w-8 h-8 rounded-full items-center justify-center ${d === 1 || d === 9 ? '' : 'bg-[#2FA2B9]'}`}>
                      <Text className={d >= 17 && d <= 22 ? 'text-white font-bold' : 'text-gray-400'}>{d}</Text>
                    </View>
                  ))}
                </View>
             </View>
          </View>
        </View>

        <LabelledInput label="Security Deposit" placeholder="Type here..." />

        {/* Vehicle Selection */}
        <View className="mb-6">
          <Text className="text-sm font-bold text-black mb-2">Vehicle Type</Text>
          <TouchableOpacity className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 flex-row items-center justify-between">
            <Text className="text-gray-400">Select vehicle type</Text>
            <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <ChipGroup 
          label="Sitting Capacity" 
          options={[2, 4, 6, 8, 10]} 
          selected={sittingCapacity} 
          onSelect={setSittingCapacity} 
        />

        <ChipGroup 
          label="Fuel Type" 
          options={['Petrol', 'Diesel', 'Other', 'Hybrid']} 
          selected={fuelType} 
          onSelect={setFuelType} 
        />

        <ChipGroup 
          label="Colors" 
          options={['White', 'Gray', 'Blue', 'Black']} 
          selected={color} 
          onSelect={setColor} 
        />

        <ChipGroup 
          label="Condition of the item" 
          options={['Brand New', 'New (like new)', 'Used (Good)', 'Used (Fair)', 'As a service']} 
          selected={condition} 
          onSelect={setCondition} 
        />

        <LabelledInput label="Vehicle Number" placeholder="Type here..." />

        {/* Verification */}
        <View className="mb-6">
          <Text className="text-sm font-bold text-black mb-1">Verify Your Vehicle</Text>
          <Text className="text-xs text-gray-400 mb-4 leading-4">Upload valid documents or files to verify as part of the identification process.</Text>
          {['Vehicle Registration Documents', 'Proof of Insurance', 'Vehicle revenue license'].map((doc) => (
             <View key={doc} className="flex-row items-center justify-between py-3 border-b border-gray-50">
               <View className="flex-row items-center gap-2">
                  <Ionicons name="document-text-outline" size={20} color="#2FA2B9" />
                  <Text className="text-gray-700 text-sm">{doc}</Text>
               </View>
               <TouchableOpacity><Text className="text-[#2FA2B9] font-bold">Add</Text></TouchableOpacity>
             </View>
          ))}
        </View>

        <ChipGroup 
          label="Access to Rentals" 
          options={['Delivery available', 'Pickup at owner\'s location']} 
          selected={access} 
          onSelect={setAccess} 
        />

        <LabelledInput label="Delivery fee" placeholder="Type here..." />

        {/* Driver Toggle */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm font-bold text-black">Book with driver</Text>
          <Switch 
            value={bookWithDriver} 
            onValueChange={setBookWithDriver} 
            trackColor={{ false: '#E5E7EB', true: '#2FA2B9' }}
          />
        </View>
        <Text className="text-xs text-gray-400 mb-6 leading-4">Don't have a driver? You can book with them also.</Text>

        {bookWithDriver && (
          <View>
            <LabelledInput label="Driver fee" placeholder="Type here..." />
            <LabelledInput label="Driver Name" placeholder="Type here..." />
            <ChipGroup 
              label="Driver Gender" 
              options={['Male', 'Female', 'Other']} 
              selected={driverGender} 
              onSelect={setDriverGender} 
            />
            {/* License Upload */}
            <View className="mb-6">
              <Text className="text-sm font-bold text-black mb-2">Driving License</Text>
              <UploadBox height={120} />
            </View>
          </View>
        )}

        {/* Bump Item */}
        <View className="flex-row items-center justify-between mt-4">
          <Text className="text-sm font-bold text-black">Bump Item</Text>
          <Switch 
            value={bumpEnabled} 
            onValueChange={setBumpEnabled} 
            trackColor={{ false: '#E5E7EB', true: '#2FA2B9' }}
          />
        </View>
        <Text className="text-xs text-gray-400 mb-6 leading-4">Help your items sell faster by reaching more buyers.</Text>

        {bumpEnabled && (
          <View className="flex-row gap-4 mb-8">
            <TouchableOpacity 
              onPress={() => setBumpPlan('Standard')}
              className={`flex-1 p-4 rounded-xl border ${bumpPlan === 'Standard' ? 'bg-[#E6F3F5] border-[#2FA2B9]' : 'bg-white border-gray-100'}`}
            >
              <Text className="text-[#2FA2B9] font-bold text-sm mb-1">Standard Bump</Text>
              <Text className="text-gray-400 text-[10px] leading-3 mb-2">Keep your listings at the top of search results for a month.</Text>
              <Text className="text-gray-500 font-bold text-[10px]">Rs: LKR 1000</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setBumpPlan('Premium')}
              className={`flex-1 p-4 rounded-xl border ${bumpPlan === 'Premium' ? 'bg-[#E6F3F5] border-[#2FA2B9]' : 'bg-white border-gray-100'}`}
            >
              <Text className="text-[#2FA2B9] font-bold text-sm mb-1">Premium Bump</Text>
              <Text className="text-gray-400 text-[10px] leading-3 mb-2">Keep your listings at the top of search results for a month.</Text>
              <Text className="text-gray-500 font-bold text-[10px]">Rs: LKR 2200</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          onPress={() => router.push('/profile/myListings/payments' as any)}
          className="w-full h-14 rounded-full items-center justify-center mb-10"
          style={{ backgroundColor: '#2FA2B9' }}
        >
          <Text className="text-white font-bold text-lg">Add</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
