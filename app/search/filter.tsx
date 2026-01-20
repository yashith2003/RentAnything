import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FilterScreen() {
  const router = useRouter();
  const [access, setAccess] = useState('Delivery available');
  const [condition, setCondition] = useState('Used (Like New)');
  const [rate, setRate] = useState('Day');
  const [distance, setDistance] = useState('5 km');
  const [withDriver, setWithDriver] = useState(true);
  const [siting, setSiting] = useState(4);
  const [selectedColor, setSelectedColor] = useState('Blue');
  const [fuelType, setFuelType] = useState('Electric');
  const [verification, setVerification] = useState('Driving License');

  const Chip = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-xl mr-3 mb-3 border ${
        selected ? 'bg-[#2FA2B9] border-[#2FA2B9]' : 'bg-white border-gray-100'
      }`}
    >
      <Text className={`text-sm font-medium ${selected ? 'text-white' : 'text-gray-500'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mb-6">
      <Text className="text-base font-bold text-[#1A1A1A] mb-4">{title}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black">Filters</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6 pt-4">
        <Section title="Access to Rentals">
          <View className="flex-row flex-wrap">
            {['Delivery available', "Pickup at owner's location"].map((label) => (
              <Chip
                key={label}
                label={label}
                selected={access === label}
                onPress={() => setAccess(label)}
              />
            ))}
          </View>
        </Section>

        <Section title="Condition of the Item">
          <View className="flex-row flex-wrap">
            {['Brand New', 'Used (Like New)', 'Used (Good)', 'Used (Fair)', "It's a service"].map((label) => (
              <Chip
                key={label}
                label={label}
                selected={condition === label}
                onPress={() => setCondition(label)}
              />
            ))}
          </View>
        </Section>

        <Section title="Lender Ratings">
          <View className="relative h-12 justify-center mb-4">
            <View className="h-2 bg-gray-100 rounded-full w-full" />
            <View className="absolute h-2 bg-[#2FA2B9] rounded-full w-[60%]" />
            <View className="absolute left-[60%] w-6 h-6 bg-[#2FA2B9] border-4 border-white rounded-full shadow-sm" style={{ elevation: 2 }} />
          </View>
          <View className="flex-row justify-between">
            <View className="flex-1 mr-4">
              <Text className="text-xs text-gray-500 font-bold mb-2">Minimum</Text>
              <TextInput
                value="10"
                className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-center font-bold"
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 font-bold mb-2">Maximum</Text>
              <TextInput
                value="500"
                className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-center font-bold"
                keyboardType="numeric"
              />
            </View>
          </View>
        </Section>

        <Section title="Rental Rate">
          <View className="flex-row flex-wrap">
            {['Hour', 'Day', 'Weekly', 'Monthly'].map((label) => (
              <Chip
                key={label}
                label={label}
                selected={rate === label}
                onPress={() => setRate(label)}
              />
            ))}
          </View>
        </Section>

        <Section title="Location">
          <View className="bg-white border border-gray-100 rounded-2xl p-4">
            <View className="flex-row items-center mb-4">
              <Ionicons name="location-outline" size={20} color="#666" />
              <TextInput
                placeholder="Enter your location"
                className="flex-1 ml-3 text-sm"
                placeholderTextColor="#A0A0A0"
              />
              <Ionicons name="chevron-up" size={20} color="#666" />
            </View>
            <TouchableOpacity className="flex-row items-center mb-4">
              <Ionicons name="locate-outline" size={20} color="#2FA2B9" />
              <Text className="ml-3 text-[#2FA2B9] text-sm font-medium">Use current location</Text>
            </TouchableOpacity>
            <Text className="text-[10px] text-gray-400 mb-2">Previously visited location</Text>
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text className="ml-2 text-sm text-gray-600">Colombo, Sri Lanka</Text>
            </View>
          </View>
        </Section>

        <Section title="Distance">
          <View className="flex-row flex-wrap">
            {['2 km', '5 km', '10 km', '20 km', 'All'].map((label) => (
              <Chip
                key={label}
                label={label}
                selected={distance === label}
                onPress={() => setDistance(label)}
              />
            ))}
          </View>
        </Section>

        <Section title="Book with driver">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-1">Don't have a driver? Book with the driver.</Text>
              <Text className="text-[10px] text-[#2FA2B9]">[Rs:1000/hr Driver fee]</Text>
            </View>
            <Switch
              value={withDriver}
              onValueChange={setWithDriver}
              trackColor={{ false: '#F0F0F0', true: '#2FA2B9' }}
              thumbColor="#FFF"
            />
          </View>
        </Section>

        <Section title="Vehicle Type">
          <TouchableOpacity className="flex-row items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3">
            <Text className="text-gray-400 text-sm">Select vehicle type</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </Section>

        <Section title="Duration">
          <View className="flex-row justify-between">
            <View className="flex-1 mr-4">
              <Text className="text-xs text-gray-500 font-bold mb-2">Pick-up Date</Text>
              <View className="flex-row items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-2">
                <Text className="text-sm text-gray-400">2025-07-31</Text>
                <Ionicons name="calendar-outline" size={18} color="#666" />
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 font-bold mb-2">Return Date</Text>
              <View className="flex-row items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-2">
                <Text className="text-sm text-gray-400">2025-08-31</Text>
                <Ionicons name="calendar-outline" size={18} color="#666" />
              </View>
            </View>
          </View>
        </Section>

        <Section title="Siting Capacity">
          <View className="flex-row flex-wrap">
            {[2, 4, 6, 8, 10].map((num) => (
              <Chip
                key={num}
                label={num.toString()}
                selected={siting === num}
                onPress={() => setSiting(num)}
              />
            ))}
          </View>
        </Section>

        <Section title="Colors">
          <View className="flex-row items-center gap-x-6">
            {[
              { name: 'White', color: '#FFF', border: '#EEE' },
              { name: 'Gray', color: '#CCC', border: '#CCC' },
              { name: 'Blue', color: '#0047FF', border: '#0047FF' },
              { name: 'Black', color: '#000', border: '#000' },
            ].map((item) => (
              <TouchableOpacity
                key={item.name}
                onPress={() => setSelectedColor(item.name)}
                className="flex-row items-center"
              >
                <View
                  style={{ backgroundColor: item.color, borderColor: item.border }}
                  className={`w-6 h-6 rounded-full border ${selectedColor === item.name ? 'scale-110' : ''}`}
                />
                <Text className={`ml-2 text-xs font-medium ${selectedColor === item.name ? 'text-black' : 'text-gray-400'}`}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <Section title="Fuel Type">
          <View className="flex-row flex-wrap">
            {['Electric', 'Petrol', 'Diesel', 'Hybrid'].map((label) => (
              <Chip
                key={label}
                label={label}
                selected={fuelType === label}
                onPress={() => setFuelType(label)}
              />
            ))}
          </View>
        </Section>

        <Section title="Price Range">
          <View className="relative h-12 justify-center mb-2">
            <View className="h-2 bg-gray-100 rounded-full w-full" />
            <View className="absolute h-2 bg-[#2FA2B9] rounded-full w-[60%]" />
            <View className="absolute left-[60%] w-6 h-6 bg-[#2FA2B9] border-4 border-white rounded-full shadow-sm" style={{ elevation: 2 }} />
            <View className="absolute left-0 w-6 h-6 bg-white border-2 border-gray-200 rounded-full shadow-sm" style={{ elevation: 1 }} />
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-xs text-black font-bold">Minimum</Text>
            <Text className="text-xs text-black font-bold">Maximum</Text>
          </View>
          <TextInput
            value="Rs:1000.00"
            className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-center font-bold text-gray-400"
            editable={false}
          />
        </Section>

        <Section title="Trust & Verification">
          <View className="flex-row flex-wrap">
            {['NIC', 'Driving License', 'Passport', 'Minimum of 3 successful rents', 'Not Required'].map((label) => (
              <Chip
                key={label}
                label={label}
                selected={verification === label}
                onPress={() => setVerification(label)}
              />
            ))}
          </View>
        </Section>

        <View className="h-20" />
      </ScrollView>

      <View className="flex-row items-center px-6 py-4 border-t border-gray-50 bg-white">
        <TouchableOpacity className="flex-1 h-14 rounded-full border border-[#2FA2B9] items-center justify-center mr-4">
          <Text className="text-[#2FA2B9] font-bold">Clear all</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="flex-[1.5] h-14 rounded-full bg-[#2FA2B9] items-center justify-center shadow-lg shadow-[#2FA2B9]/20"
        >
          <Text className="text-white font-bold">Show Results</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
