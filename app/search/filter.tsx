import { PaddingStyles, Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import filterService, { FilterConfig } from '@/api/filter.service';
import DynamicFilterRenderer from '@/components/shared/DynamicFilterRenderer';
import { Colors } from '@/constants/theme';

export default function FilterScreen() {
  const router = useRouter();
  const { categoryId, returnTo } = useLocalSearchParams<{ categoryId?: string, returnTo?: string }>();
  
  // Common Filters
  const [priceRange, setPriceRange] = useState<{ min: number, max: number }>({ min: 0, max: 10000 });
  const [selectedLocation, setSelectedLocation] = useState('Current Location');
  const [distance, setDistance] = useState<string | null>('All');
  const [minRating, setMinRating] = useState<number>(0);
  
  const [dynamicConfigs, setDynamicConfigs] = useState<FilterConfig[]>([]);
  const [dynamicValues, setDynamicValues] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (categoryId) {
      fetchDynamicFilters();
    } else {
      setDynamicConfigs([]);
    }
  }, [categoryId]);

  const fetchDynamicFilters = async () => {
    setIsLoading(true);
    try {
      const configs = await filterService.getFiltersByCategory(Number(categoryId));
      setDynamicConfigs(configs);
    } catch (error) {
      console.error('Failed to load dynamic filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDynamicChange = (key: string, value: any) => {
    setDynamicValues(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setPriceRange({ min: 0, max: 10000 });
    setSelectedLocation('Current Location');
    setDistance('All');
    setMinRating(0);
    setDynamicValues({});
  };

  const Chip = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`px-${getTailwindSpacing(Spacing.lg)} py-2 rounded-xl mr-3 mb-3 border ${
        selected ? 'bg-[#2FA2B9] border-[#2FA2B9]' : 'bg-white border-gray-100'
      }`}
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
           <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={50000}
            step={500}
            value={priceRange.max}
            onSlidingComplete={(val) => setPriceRange(prev => ({ ...prev, max: val }))}
            minimumTrackTintColor="#2FA2B9"
            maximumTrackTintColor="#F0F0F0"
            thumbTintColor="#2FA2B9"
          />
          <View className="flex-row justify-between mt-2">
             <View className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <Text className="text-[10px] text-gray-400 mb-1">Minimum</Text>
                <Text className="font-bold text-sm">Rs: {priceRange.min.toLocaleString()}</Text>
             </View>
             <View className="w-4" />
             <View className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <Text className="text-[10px] text-gray-400 mb-1">Maximum</Text>
                <Text className="font-bold text-sm">Rs: {priceRange.max.toLocaleString()}</Text>
             </View>
          </View>
        </Section>

        <Section title="Location">
          <TouchableOpacity 
            className="flex-row items-center bg-gray-50 rounded-xl p-4 border border-gray-100"
          >
            <Ionicons name="location-outline" size={20} color="#2FA2B9" />
            <Text className="flex-1 ml-3 text-gray-700 font-medium">{selectedLocation}</Text>
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
                onPress={() => setDistance(label)}
              />
            ))}
          </View>
        </Section>

        <Section title="Minimum Rating">
           <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={5}
            step={0.5}
            value={minRating}
            onSlidingComplete={setMinRating}
            minimumTrackTintColor="#2FA2B9"
            maximumTrackTintColor="#F0F0F0"
            thumbTintColor="#2FA2B9"
          />
          <View className="flex-row justify-between mt-2 px-1">
             <Text className="text-xs text-gray-400">0.0</Text>
             <Text className="text-[#2FA2B9] font-bold text-xs">Rating: {minRating.toFixed(1)} +</Text>
             <Text className="text-xs text-gray-400">5.0</Text>
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
              const appliedFilters = { 
                categoryId: categoryId || '', 
                priceMin: priceRange.min,
                priceMax: priceRange.max,
                distance,
                minRating,
                location: selectedLocation,
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
    </SafeAreaView>
  );
}

