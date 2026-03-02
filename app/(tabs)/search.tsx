//app/(tabs)/search.tsx

import SearchBar from '@/components/form/searchbar';
import PopularCategories from '@/components/shared/popularCategories';
import { PaddingStyles, Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchList from '../search/searchList';
import SearchMap from '../search/searchMap';
import { useSearch } from '@/hooks/useSearch';


export default function SearchScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { categoryId: paramCatId, searchQuery: paramQuery, ...filtersAsParams } = params;

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(paramCatId ? Number(paramCatId) : undefined);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  const { query, setQuery, debouncedQuery, triggerSearch, results } = useSearch(selectedCategoryId, 20, filtersAsParams);

  useEffect(() => {
    if (paramQuery) {
      const qValue = paramQuery as string;
      setQuery(qValue);
      triggerSearch(qValue);
    }
  }, [paramQuery]);

  // Build active filters array from params
  const activeFilters: Array<{ key: string; label: string; value: any }> = [];
  
  if (filtersAsParams.access) {
    activeFilters.push({ key: 'access', label: filtersAsParams.access as string, value: filtersAsParams.access });
  }
  if (filtersAsParams.condition) {
    activeFilters.push({ key: 'condition', label: filtersAsParams.condition as string, value: filtersAsParams.condition });
  }
  if (filtersAsParams.distance) {
    activeFilters.push({ key: 'distance', label: filtersAsParams.distance as string, value: filtersAsParams.distance });
  }
  if (filtersAsParams.brand) {
    activeFilters.push({ key: 'brand', label: `Brand: ${filtersAsParams.brand}`, value: filtersAsParams.brand });
  }
  if (filtersAsParams.accessibility) {
    activeFilters.push({ key: 'accessibility', label: `Access: ${filtersAsParams.accessibility}`, value: filtersAsParams.accessibility });
  }
  if (filtersAsParams.warrantyOnly === 'true') {
    activeFilters.push({ key: 'warrantyOnly', label: 'With Warranty', value: true });
  }
  
  // Add dynamic category-specific filters
  Object.keys(filtersAsParams).forEach(key => {
    if (!['access', 'condition', 'distance', 'brand', 'accessibility', 'warrantyOnly', 'priceMin', 'priceMax', 'ratingMin', 'ratingMax', 'lat', 'lng', 'location'].includes(key)) {
      activeFilters.push({ key, label: `${key}: ${filtersAsParams[key]}`, value: filtersAsParams[key] });
    }
  });

  const removeFilter = (filterKey: string) => {
    const newParams: any = { ...params };
    delete newParams[filterKey];
    router.push({
      pathname: '/(tabs)/search',
      params: newParams
    });
  };

  const clearAllFilters = () => {
    router.push({
      pathname: '/(tabs)/search',
      params: { 
        categoryId: selectedCategoryId || '',
        searchQuery: query || ''
      }
    });
  };

  useEffect(() => {
    if (paramCatId) setSelectedCategoryId(Number(paramCatId));
  }, [paramCatId]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between py-4" style={PaddingStyles.page}>
        <TouchableOpacity 
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/(tabs)/home');
            }
          }} 
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">{t('search.title')}</Text>
        <TouchableOpacity 
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        {/* Top Part */}
        <View>
          {/* Category Chips */}
          <View style={PaddingStyles.page}>
            <PopularCategories 
              showTitle={false} 
              selectedCategoryId={selectedCategoryId} 
              onSelectCategory={(cat) => {
                if (selectedCategoryId === cat.id) {
                  setSelectedCategoryId(undefined);
                  router.setParams({ categoryId: '' });
                } else {
                  setSelectedCategoryId(cat.id);
                  router.setParams({ categoryId: cat.id.toString() });
                }
              }} 
            />
          </View>

          {/* Search Bar */}
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onSearch={triggerSearch}
            placeholder={t('common.search')}
            showFilter={true}
            onFilterPress={() => router.push({
              pathname: '/search/filter',
              params: { categoryId: selectedCategoryId || '' }
            })}
            containerStyle={{ paddingHorizontal: Spacing.pageHorizontal, marginBottom: Spacing.lg }}
          />

          {/* Filter Tags */}
          {activeFilters.length > 0 && (
            <View className="flex-row items-center justify-between mb-4" style={PaddingStyles.page}>
              <View className="flex-row gap-x-3 flex-wrap flex-1">
                {activeFilters.map((filter, index) => (
                  <View key={`${filter.key}-${index}`} className={`flex-row items-center bg-gray-50 px-${getTailwindSpacing(Spacing.lg)} py-2 rounded-xl border border-gray-100 mb-2`}>
                    <Text className="text-gray-600 text-sm mr-2">{filter.label}</Text>
                    <TouchableOpacity onPress={() => removeFilter(filter.key)}>
                      <Ionicons name="close" size={14} color="#666" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <TouchableOpacity onPress={clearAllFilters}>
                <Text className="text-[#2FA2B9] text-sm font-medium">{t('search.clearFilters')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* List/Map Toggle */}
          <View className="flex-row items-center mb-4 gap-x-4" style={PaddingStyles.page}>
            <TouchableOpacity
                onPress={() => setViewMode('list')}
                className={`flex-1 py-3.5 rounded-full items-center border ${
                viewMode === 'list' ? 'bg-white border-[#2FA2B9]' : 'bg-white border-gray-100'
                }`}
            >
                <Text
                className={`font-bold text-lg ${viewMode === 'list' ? 'text-[#2FA2B9]' : 'text-gray-400'}`}
                >
                {t('search.list')}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => setViewMode('map')}
                className={`flex-1 py-3.5 rounded-full items-center ${
                viewMode === 'map' ? 'bg-[#2FA2B9]' : 'bg-white border border-gray-100'
                }`}
            >
                <Text
                className={`font-bold text-lg ${viewMode === 'map' ? 'text-white' : 'text-[#2FA2B9]'}`}
                >
                {t('search.map')}
                </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dynamic Content */}
        <View className="flex-1">
          {viewMode === 'list' ? 
            <SearchList categoryId={selectedCategoryId} searchQuery={debouncedQuery} filters={filtersAsParams} /> : 
            <SearchMap categoryId={selectedCategoryId} filters={filtersAsParams} />
          }
        </View>
      </View>
    </SafeAreaView>
  );
}
