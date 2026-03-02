//RentAnything/app/search/filter.tsx

import { PaddingStyles, Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetCategoryFiltersQuery } from '@/api/category.service';
import DynamicFilterRenderer from '@/components/shared/DynamicFilterRenderer';
import LocationDropdown from '@/components/form/LocationDropdown';
import RangeSlider from '@/components/shared/RangeSlider';
import SingleSlider from '@/components/shared/SingleSlider';

export default function FilterScreen() {
  const router = useRouter();
  const { categoryId, returnTo } = useLocalSearchParams<{ categoryId?: string, returnTo?: string }>();
  
  // Common Filters
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [ratingRange, setRatingRange] = useState({ min: 0, max: 5 });
  const [selectedLocation, setSelectedLocation] = useState<{address: string, lat?: number, lng?: number} | null>({ address: 'Select location' });
  const [distance, setDistance] = useState<string | null>('All');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  
  const [brand, setBrand] = useState('');
  const [accessibility, setAccessibility] = useState('');
  const [warrantyOnly, setWarrantyOnly] = useState(false);

  const [dynamicValues, setDynamicValues] = useState<Record<string, any>>({});
  
  const { data: dynamicConfigs = [], isLoading } = useGetCategoryFiltersQuery(Number(categoryId), { skip: !categoryId });

  const handleDynamicChange = (key: string, value: any) => {
    setDynamicValues(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setPriceRange({ min: 0, max: 50000 });
    setRatingRange({ min: 0, max: 5 });
    setSelectedLocation({ address: 'Select location' });
    setDistance('All');
    setBrand('');
    setAccessibility('');
    setWarrantyOnly(false);
    setDynamicValues({});
  };

  const Chip = ({ label, selected, onPress, disabled }: { label: string; selected: boolean; onPress: () => void; disabled?: boolean }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`px-${getTailwindSpacing(Spacing.lg)} py-2 rounded-xl mr-3 mb-3 border ${
        selected ? 'bg-[#2FA2B9] border-[#2FA2B9]' : 'bg-white border-gray-100'
      } ${disabled ? 'opacity-40' : ''}`}
    >
      <Text className={`text-sm font-medium ${selected ? 'text-white' : 'text-gray-500'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const Section = ({ title, children, subtitle }: { title: string; children: React.ReactNode; subtitle?: string }) => (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-base font-bold text-[#1A1A1A]">{title}</Text>
        {subtitle && <Text className="text-xs text-gray-400 font-medium">{subtitle}</Text>}
      </View>
      {children}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center justify-between py-4 border-b border-gray-50" style={PaddingStyles.page}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black">Filters</Text>
        <TouchableOpacity onPress={resetFilters}>
            <Text className="text-[#2FA2B9] text-sm font-medium">Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 pt-4" style={PaddingStyles.page}>
        {/* COMMON FILTERS FIRST */}
        <Section title="Price Range">
           <RangeSlider
            min={0}
            max={50000}
            step={500}
            initialMin={priceRange.min}
            initialMax={priceRange.max}
            onSlidingComplete={(min, max) => setPriceRange({ min, max })}
          />
        </Section>

        <Section title="Location">
          <TouchableOpacity 
            className={`flex-row items-center bg-gray-50 rounded-xl p-4 border ${
              (distance !== 'All' && !selectedLocation?.lat) ? 'border-red-500 bg-red-50/10' : 'border-gray-100'
            }`}
            onPress={() => setShowLocationDropdown(true)}
          >
            <Ionicons name="location-outline" size={20} color={(distance !== 'All' && !selectedLocation?.lat) ? '#EF4444' : '#2FA2B9'} />
            <View className="flex-1 ml-3">
              <Text className={`text-gray-700 font-medium ${(!selectedLocation?.lat && distance !== 'All') ? 'text-red-500' : ''}`} numberOfLines={2}>
                {selectedLocation?.address || 'Select location'}
              </Text>
              {(distance !== 'All' && !selectedLocation?.lat) && (
                <Text className="text-red-500 text-[10px] font-bold mt-1">Select your location to calculate distance</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={16} color="#A0A0A0" />
          </TouchableOpacity>
        </Section>

        <Section title="Distance">
          <View className="flex-row flex-wrap">
            {['2 km', '5 km', '10 km', '20 km', 'All'].map((label) => (
              <Chip
                key={label}
                label={label}
                selected={distance === label}
                disabled={!selectedLocation?.lat && label !== 'All'}
                onPress={() => setDistance(label)}
              />
            ))}
          </View>
        </Section>

        <Section title="Rating Range">
           <RangeSlider
             min={0}
             max={5}
             step={0.5}
             initialMin={ratingRange.min}
             initialMax={ratingRange.max}
             onSlidingComplete={(min, max) => setRatingRange({ min, max })}
             showTicks={true}
             tickStep={0.5}
             labelPrefix="Rating: "
             isRating={true}
           />
        </Section>

        <Section title="Brand">
           <TextInput
             placeholder="Search by brand..."
             placeholderTextColor="#9CA3AF"
             value={brand}
             onChangeText={setBrand}
             className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-gray-900"
           />
        </Section>

        <Section title="Rental Access">
           <TextInput
             placeholder="e.g. Ground floor, Wide doors..."
             placeholderTextColor="#9CA3AF"
             value={accessibility}
             onChangeText={setAccessibility}
             className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-gray-900"
           />
        </Section>

        <Section title="Additional Options">
           <View className="flex-row items-center justify-between py-2">
             <View className="flex-1">
               <Text className="text-gray-900 font-medium">Only with Warranty</Text>
               <Text className="text-xs text-gray-400">Strictly items with valid warranty</Text>
             </View>
             <Switch
               value={warrantyOnly}
               onValueChange={setWarrantyOnly}
               trackColor={{ false: '#E5E7EB', true: '#2FA2B9' }}
             />
           </View>
        </Section>

        <View className="h-[1px] bg-gray-100 mb-6" />

        {/* CATEGORY SPECIFIC ATTRIBUTES */}
        {isLoading ? (
          <View className="py-10 items-center">
            <ActivityIndicator color="#2FA2B9" />
            <Text className="text-gray-400 mt-2 text-xs">Loading attribute filters...</Text>
          </View>
        ) : dynamicConfigs.length > 0 ? (
          <View>
            
             {dynamicConfigs.map(config => (
               <DynamicFilterRenderer
                 key={config.id}
                 filter={config}
                 value={dynamicValues[config.key]}
                 onChange={(val) => handleDynamicChange(config.key, val)}
               />
             ))}
          </View>
        ) : categoryId ? (
          <Text className="text-gray-400 text-center py-6 text-xs italic">
            No specific attributes for this category
          </Text>
        ) : (
          <Text className="text-gray-400 text-center py-6 text-xs italic">
            Select a category for more specific filters
          </Text>
        )}

        <View className="h-20" />
      </ScrollView>

      <View className="flex-row items-center py-4 border-t border-gray-50 bg-white" style={PaddingStyles.page}>
        <TouchableOpacity 
          className="flex-1 h-14 rounded-full border border-[#2FA2B9] items-center justify-center mr-4"
          onPress={resetFilters}
        >
          <Text className="text-[#2FA2B9] font-bold">Clear all</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {
              if (distance !== 'All' && !selectedLocation?.lat) {
                return; // Error shown above, just stop
              }
              const appliedFilters = { 
                categoryId: categoryId || '', 
                priceMin: priceRange.min,
                priceMax: priceRange.max,
                ratingMin: ratingRange.min,
                ratingMax: ratingRange.max,
                distance: distance === 'All' ? undefined : distance,
                location: selectedLocation?.address === 'Select location' ? undefined : selectedLocation?.address,
                lat: selectedLocation?.lat,
                lng: selectedLocation?.lng,
                brand: brand || undefined,
                accessibility: accessibility || undefined,
                warrantyOnly: warrantyOnly ? 'true' : undefined,
                ...dynamicValues 
              };

              if (returnTo) {
                router.push({
                   pathname: returnTo as any,
                   params: appliedFilters
                });
              } else {
                router.push({
                  pathname: '/(tabs)/search',
                  params: appliedFilters
                });
              }
          }}
          className="flex-[1.5] h-14 rounded-full bg-[#2FA2B9] items-center justify-center shadow-lg shadow-[#2FA2B9]/20"
        >
          <Text className="text-white font-bold">Show Results</Text>
        </TouchableOpacity>
      </View>

      <LocationDropdown
        visible={showLocationDropdown}
        onClose={() => setShowLocationDropdown(false)}
        onSelectLocation={setSelectedLocation}
      />
    </SafeAreaView>
  );
}

