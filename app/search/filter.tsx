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
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import PrimaryButton from '@/components/ui/PrimaryButton';

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
      <Text 
        style={[
          Typography.bodySmall, 
          { fontWeight: '500', color: selected ? Colors.background : Colors.textSecondary }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const Section = ({ title, children, subtitle }: { title: string; children: React.ReactNode; subtitle?: string }) => (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text style={[Typography.bodyLarge, { fontWeight: '700', color: Colors.textPrimary }]}>{title}</Text>
        {subtitle && <Text style={[Typography.caption, { color: Colors.textMuted, fontWeight: '500' }]}>{subtitle}</Text>}
      </View>
      {children}
    </View>
  );

  return (
    <SafeAreaView 
      style={{ backgroundColor: Colors.background }} 
      className="flex-1" 
      edges={['top']}
    >
      <ScreenHeader 
        title="Filters" 
        showBack={true}
        onBackPress={() => router.back()}
        rightIcon="refresh"
        onRightIconPress={resetFilters}
      />

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
            className="flex-row items-center rounded-xl p-4 border"
            style={{
              backgroundColor: Colors.surface,
              borderColor: (distance !== 'All' && !selectedLocation?.lat) ? Colors.error : Colors.border,
            }}
            onPress={() => setShowLocationDropdown(true)}
          >
            <Ionicons 
              name="location-outline" 
              size={20} 
              color={(distance !== 'All' && !selectedLocation?.lat) ? Colors.error : Colors.primary} 
            />
            <View className="flex-1 ml-3">
              <Text 
                style={[
                  Typography.bodyMedium, 
                  { fontWeight: '500', color: (distance !== 'All' && !selectedLocation?.lat) ? Colors.error : Colors.textPrimary }
                ]}
                numberOfLines={2}
              >
                {selectedLocation?.address || 'Select location'}
              </Text>
              {(distance !== 'All' && !selectedLocation?.lat) && (
                <Text style={[Typography.caption, { color: Colors.error, fontWeight: '700', marginTop: 4 }]}>Select your location to calculate distance</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
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
             placeholderTextColor={Colors.textMuted}
             value={brand}
             onChangeText={setBrand}
             className="w-full h-12 border rounded-xl px-4"
             style={{
               backgroundColor: Colors.surface,
               borderColor: Colors.border,
               color: Colors.textPrimary,
             }}
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

      <View 
        className="flex-row items-center py-4 border-t bg-white" 
        style={[PaddingStyles.page, { borderTopColor: Colors.border }]}
      >
        <PrimaryButton 
          title="Clear all" 
          variant="outlined" 
          onPress={resetFilters}
          style={{ flex: 1, marginRight: 16 }}
        />
        <PrimaryButton 
          title="Show Results" 
          onPress={() => {
              if (distance !== 'All' && !selectedLocation?.lat) {
                return;
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
          style={{ flex: 1.5 }}
        />
      </View>

      <LocationDropdown
        visible={showLocationDropdown}
        onClose={() => setShowLocationDropdown(false)}
        onSelectLocation={setSelectedLocation}
      />
    </SafeAreaView>
  );
}

