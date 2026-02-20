import { filterPhoneInput } from '@/utils/phoneUtils';
import addressService, { Address } from '@/api/address.service';
import itemService from '@/api/item.service';
import fileService from '@/api/file.service';
import { ChipGroup } from '@/components/form/ChipGroup';
import { CreateItemSchema } from '@/types/schemas';
import { LabelledInput } from '@/components/form/LabelledInput';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { UploadBox } from '@/components/form/UploadBox';
import { AvailabilityCalendar } from '@/components/form/AvailabilityCalendar';
import { CategoryFieldRenderer } from '@/components/form/CategoryFieldRenderer';
import SuccessPopup from '@/components/AlertPopup/successPopup';
import ErrorPopup from '@/components/AlertPopup/ErrorPopup';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { useCreateItemMutation } from '@/api/item.service';
import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

export default function ListAnItemScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryId = params.categoryId ? parseInt(params.categoryId as string) : 1;
  const categoryName = (params.categoryName as string) || 'Vehicle';

  // Base Form State
  const [itemName, setItemName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [location, setLocation] = useState('Union St, Chicago 2002 Usa');
  const [itemDescription, setItemDescription] = useState('');
  const [rentalTerms, setRentalTerms] = useState('');
  const [instructions, setInstructions] = useState('');
  const [rentalRate, setRentalRate] = useState('Day');
  const [rentalFee, setRentalFee] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [condition, setCondition] = useState('New (like new)');
  const [availability, setAvailability] = useState<{ dates: string[], startTime: string, endTime: string }>({
    dates: [],
    startTime: '10:30:00',
    endTime: '17:30:00'
  });

  // Category-specific Form State
  const [categoryFormData, setCategoryFormData] = useState<any>({});

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Real-time suggestions state
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Partial<Address> | null>(null);

  // UI State
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [newLocationInput, setNewLocationInput] = useState('');
  const [recentLocations, setRecentLocations] = useState<Address[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [bumpEnabled, setBumpEnabled] = useState(true);
  const [bumpPlan, setBumpPlan] = useState('Standard');

  useEffect(() => {
    loadRecentLocations();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (newLocationInput.length > 2) {
        setIsSearching(true);
        try {
          const results = await addressService.search(newLocationInput);
          setSuggestions(results);
        } catch (error) {
          console.error('Failed to search locations', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [newLocationInput]);

  const loadRecentLocations = async () => {
    try {
        const data = await addressService.getAll();
        setRecentLocations(data);
    } catch (error) {
        console.error('Failed to load locations', error);
    }
  };

  const handleLocationSelect = (loc: Address | string) => {
      if (typeof loc === 'string') {
        setLocation(loc);
        setSelectedAddress({ address: loc });
      } else {
        setLocation(loc.address);
        setSelectedAddress(loc);
      }
      setShowLocationPicker(false);
      setSuggestions([]);
  };

  const handleAddNewLocation = async () => {
    if (!newLocationInput.trim()) return;
    try {
        const saved = await addressService.create(newLocationInput);
        setLocation(saved.address);
        setNewLocationInput('');
        setShowLocationPicker(false);
        loadRecentLocations();
    } catch (error) {
        // Fallback: Still use the address even if saving to backend fails
        setLocation(newLocationInput);
        setNewLocationInput('');
        setShowLocationPicker(false);
        console.warn('Failed to save location to backend, using raw input', error);
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      // 1. Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMessage('Location permission denied. Please enable location access in your device settings.');
        setShowError(true);
        setIsLoadingLocation(false);
        return;
      }

      // 2. Get current position
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;

      // 3. Reverse geocode to get human-readable address
      const geocodedAddress = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (geocodedAddress && geocodedAddress.length > 0) {
        const addr = geocodedAddress[0];
        
        // Format address string
        const addressParts = [
          addr.name,
          addr.street,
          addr.city,
          addr.region,
          addr.postalCode,
          addr.country,
        ].filter(Boolean);
        
        const formattedAddress = addressParts.join(', ');

        // 4. Update state with address and coordinates
        const locationData: Partial<Address> = {
          address: formattedAddress,
          lat: latitude,
          lng: longitude
        };
        setLocation(formattedAddress);
        setSelectedAddress(locationData);
        setShowLocationPicker(false);
        loadRecentLocations();
      } else {
        setErrorMessage('Unable to determine address from your location. Please enter manually.');
        setShowError(true);
      }
    } catch (error: any) {
      console.warn('Location error:', error);
      
      const errorMessage = error.message || '';
      
      if (error.code === 'E_LOCATION_SERVICES_DISABLED' || errorMessage.includes('location services are enabled')) {
        setErrorMessage('Location services are disabled. Please enable them in your device settings.');
      } else if (error.code === 'E_LOCATION_UNAVAILABLE' || errorMessage.includes('Current location is unavailable')) {
        setErrorMessage('Unable to get your location. If using an emulator, please set a mock location. On a physical device, ensure GPS is enabled and you are not indoors.');
      } else if (errorMessage.includes('permission')) {
        setErrorMessage('Location permission denied. Please enable location access in your device settings.');
      } else {
        setErrorMessage('Failed to get your location. Please try again or enter your address manually.');
      }
      
      setShowError(true);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleCategoryFieldChange = (field: string, value: any) => {
    setCategoryFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const buildCategoryDetails = () => {
    const normalizedCategory = categoryName.toLowerCase();
    
    if (normalizedCategory.includes('vehicle') || normalizedCategory.includes('car') || normalizedCategory.includes('bike') || normalizedCategory.includes('scooter') || normalizedCategory.includes('truck') || normalizedCategory.includes('cycle')) {
      return {
        vehicleDetails: {
          vehicleType: categoryFormData.vehicleType || 'Car',
          vehicleNumber: categoryFormData.vehicleNumber || '',
          seatingCapacity: categoryFormData.seatingCapacity || 4,
          fuelType: categoryFormData.fuelType || 'Petrol',
          color: categoryFormData.color,
          registrationDocument: categoryFormData.registrationDocument,
          insuranceDocument: categoryFormData.insuranceDocument,
          revenueLicense: categoryFormData.revenueLicense,
          deliveryFee: categoryFormData.deliveryFee ? parseFloat(categoryFormData.deliveryFee) : undefined,
          driverAvailable: categoryFormData.driverAvailable || false,
          driverName: categoryFormData.driverName,
          driverGender: categoryFormData.driverGender,
          driverLicense: categoryFormData.driverLicense,
          driverFee: categoryFormData.driverFee ? parseFloat(categoryFormData.driverFee) : undefined,
        }
      };
    } else if (normalizedCategory.includes('electronic') || normalizedCategory.includes('phone') || normalizedCategory.includes('computer') || normalizedCategory.includes('tablet') || normalizedCategory.includes('camera') || normalizedCategory.includes('headphone')) {
      return {
        electronicsDetails: {
          brand: categoryFormData.brand || '',
          model: categoryFormData.model || '',
          warranty: categoryFormData.warranty,
          specifications: categoryFormData.specifications,
        }
      };
    } else if (normalizedCategory.includes('home') || normalizedCategory.includes('furniture') || normalizedCategory.includes('appliance') || normalizedCategory.includes('decoration') || normalizedCategory.includes('kitchen') || normalizedCategory.includes('bedding')) {
      return {
        homeDetails: {
          propertyType: categoryFormData.propertyType || 'Apartment',
          numberOfRooms: categoryFormData.numberOfRooms || 1,
          numberOfBathrooms: categoryFormData.numberOfBathrooms || 1,
          area: categoryFormData.area || '',
          isFurnished: categoryFormData.isFurnished || false,
          amenities: categoryFormData.amenities,
        }
      };
    } else if (normalizedCategory.includes('fashion') || normalizedCategory.includes('cloth') || normalizedCategory.includes('shoe') || normalizedCategory.includes('men') || normalizedCategory.includes('women') || normalizedCategory.includes('kid') || normalizedCategory.includes('accessor')) {
      return {
        fashionDetails: {
          size: categoryFormData.size || 'M',
          gender: categoryFormData.gender || 'Unisex',
          brand: categoryFormData.brand,
          material: categoryFormData.material,
        }
      };
    } else if (normalizedCategory.includes('sport') || normalizedCategory.includes('gym') || normalizedCategory.includes('cricket') || normalizedCategory.includes('football') || normalizedCategory.includes('tennis') || normalizedCategory.includes('badminton')) {
      return {
        sportsDetails: {
          sportType: categoryFormData.sportType || 'Cricket',
          equipmentType: categoryFormData.equipmentType,
          suitableFor: categoryFormData.suitableFor,
        }
      };
    }
    
    return {};
  };

  const uploadIfNeeded = async (uri?: string) => {
    if (!uri) return undefined;
    // Check if it's a local URI (not starting with http)
    if (uri.startsWith('file://') || uri.startsWith('content://') || !uri.startsWith('http')) {
      try {
        const uploadResult = await fileService.uploadImage(uri);
        return uploadResult.url;
      } catch (uploadError) {
        console.error('Failed to upload image', uri, uploadError);
        throw new Error('Failed to upload image. Please try again.');
      }
    }
    return uri;
  };

  const [createItem] = useCreateItemMutation();

  const handleAddItem = async () => {
    setErrors({});
    setIsSubmitting(true);
    
    try {
      // 1. Create Address and prepare initial data
      let addressId = 1;
      try {
        const addrPayload = selectedAddress || { address: location };
        const addr = await addressService.create(addrPayload);
        addressId = addr.id;
      } catch (e) {
        console.warn('Using default addressId due to error', e);
      }

      // 2. Prepare payload for validation
      const payload = {
        title: itemName,
        description: itemDescription,
        phone: phoneNumber,
        categoryId: categoryId,
        addressId: addressId,
        price: rentalFee ? parseFloat(rentalFee) : 0,
        condition: condition,
        rentalTerms: rentalTerms,
        instructions: instructions,
        securityDeposit: securityDeposit ? parseFloat(securityDeposit) : 0,
        rateType: rentalRate === 'Hour' ? 'hourly' : rentalRate === 'Day' ? 'daily' : rentalRate === 'Weekly' ? 'weekly' : 'monthly',
        availabilities: availability.dates.map(date => ({
          availableDate: date,
          startTime: availability.startTime,
          endTime: availability.endTime,
          isAvailable: true
        })),
        ...buildCategoryDetails(),
      };

      // 3. Validate with Zod
      const validation = CreateItemSchema.safeParse(payload);
      
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.issues.forEach((issue) => {
          if (issue.path && issue.path.length > 0) {
            fieldErrors[issue.path[0].toString()] = issue.message;
          }
        });
        
        // Map common field names back to form fields if they differ
        if (fieldErrors.title) fieldErrors.itemName = fieldErrors.title;
        if (fieldErrors.description) fieldErrors.itemDescription = fieldErrors.description;
        if (fieldErrors.phone) fieldErrors.phoneNumber = fieldErrors.phone;
        if (fieldErrors.price) fieldErrors.rentalFee = fieldErrors.price;

        setErrors(fieldErrors);
        setErrorMessage('Please fix the errors in the form');
        setShowError(true);
        setIsSubmitting(false);
        return;
      }

      // 4. Upload Documents & Image
      const uploadedImageUrl = await uploadIfNeeded(selectedImage);
      
      // Update category details with uploaded document URLs
      const finalPayload: any = { ...validation.data, imageUrl: uploadedImageUrl };
      
      // Ensure null values are converted to undefined for backend compatibility if needed
      if (finalPayload.condition === null) finalPayload.condition = undefined;

      if (finalPayload.vehicleDetails) {
        const vd = finalPayload.vehicleDetails;
        vd.registrationDocument = await uploadIfNeeded(vd.registrationDocument);
        vd.insuranceDocument = await uploadIfNeeded(vd.insuranceDocument);
        vd.revenueLicense = await uploadIfNeeded(vd.revenueLicense);
        vd.driverLicense = await uploadIfNeeded(vd.driverLicense);
      }


      // 5. Create Item
      await createItem(finalPayload).unwrap();


      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.back();
      }, 2000);

    } catch (error: any) {
      console.error('Failed to add item', error);
      setErrorMessage(error.message || error.response?.data?.message || 'Failed to save item listing');
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <View className="absolute z-50 w-full h-full bg-black/50 justify-center items-center px-4">
             <TouchableOpacity className="absolute w-full h-full" onPress={() => setShowLocationPicker(false)} />
             <View className="bg-white w-full rounded-2xl overflow-hidden p-4">
                <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
                     <Ionicons name="location-outline" size={20} color="#9CA3AF" />
                     <TextInput 
                        className="flex-1 ml-2 text-gray-700 h-10"
                        placeholder="Enter your location"
                        placeholderTextColor="#9CA3AF"
                        value={newLocationInput}
                        onChangeText={setNewLocationInput}
                        onSubmitEditing={handleAddNewLocation}
                        returnKeyType="done"
                        autoFocus={true}
                     />
                     {isSearching ? (
                        <ActivityIndicator size="small" color="#2FA2B9" className="mr-2" />
                      ) : (
                        newLocationInput.length > 0 && (
                            <TouchableOpacity onPress={handleAddNewLocation}>
                                <Ionicons name="arrow-forward-circle" size={24} color="#2FA2B9" />
                            </TouchableOpacity>
                        )
                      )}
                </View>

                {/* Suggestions List */}
                {suggestions.length > 0 && (
                  <View className="mb-4">
                    <Text className="text-[10px] text-gray-400 font-bold mb-2 uppercase">Suggestions</Text>
                    {suggestions.map((suggestion, index) => (
                      <TouchableOpacity 
                        key={`suggestion-${index}`}
                        className="flex-row items-center py-3 border-b border-gray-50 px-2"
                        onPress={() => handleLocationSelect(suggestion)}
                      >
                        <Text className="text-gray-900 font-bold text-sm" numberOfLines={1}>
                          {suggestion.mainText || suggestion.address.split(',')[0]}
                        </Text>
                        <Text className="text-gray-400 text-[11px]" numberOfLines={1}>
                          {suggestion.secondaryText || suggestion.address}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <TouchableOpacity 
                    className="flex-row items-center py-3 border-b border-gray-100"
                    onPress={handleUseCurrentLocation}
                    disabled={isLoadingLocation}
                >
                    <View className="mr-3 ml-2">
                         {isLoadingLocation ? (
                           <ActivityIndicator size="small" color="#2FA2B9" />
                         ) : (
                           <Ionicons name="location" size={18} color="#2FA2B9" />
                         )}
                    </View>
                    <Text className="text-[#2FA2B9] font-medium text-sm">
                      {isLoadingLocation ? 'Getting location...' : 'Use current location'}
                    </Text>
                </TouchableOpacity>

                {recentLocations.length > 0 && (
                    <Text className="text-[10px] text-gray-400 font-bold mt-4 mb-2 uppercase">Previously Viewed Location</Text>
                )}
                
                {Array.isArray(recentLocations) && recentLocations.slice(0, 2).map((loc) => (
                    <TouchableOpacity 
                        key={loc.id} 
                        className="py-3 border-b border-gray-50 bg-gray-50/50 rounded-xl mb-2 px-3"
                        onPress={() => handleLocationSelect(loc)}
                    >
                        <Text className="text-gray-900 font-bold text-sm" numberOfLines={1}>
                          {loc.mainText || loc.address.split(',')[0]}
                        </Text>
                        <Text className="text-gray-400 text-[11px]" numberOfLines={1}>
                          {loc.secondaryText || loc.address}
                        </Text>
                    </TouchableOpacity>
                ))}
             </View>
        </View>
      )}

      <ScreenHeader title="List an item" />

      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        {/* Base Form Fields */}
        <LabelledInput 
          label="Item Name" 
          placeholder="Type here..." 
          value={itemName}
          onChangeText={(text) => {
            setItemName(text);
            if (errors.itemName) setErrors(prev => ({ ...prev, itemName: '' }));
          }}
          error={errors.itemName}
        />
        <LabelledInput 
          label="Phone Number" 
          placeholder="Type here..." 
          value={phoneNumber}
          onChangeText={(text) => {
            setPhoneNumber(filterPhoneInput(text));
            if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: '' }));
          }}
          keyboardType="phone-pad"
          error={errors.phoneNumber}
        />

        {/* Image Upload */}
        <View className="mb-6">
          <Text className="text-sm font-bold text-black mb-2">Image</Text>
          <UploadBox 
            height={160} 
            imageUri={selectedImage}
            onImageSelect={setSelectedImage}
          />
        </View>

        {/* Location */}
        <View className="mb-6">
          <Text className="text-sm font-bold text-black mb-2">Location</Text>
          <TouchableOpacity 
            onPress={() => {
                setShowLocationPicker(true);
                if (errors.location) setErrors(prev => ({ ...prev, location: '' }));
            }}
            className={`w-full h-12 bg-white border ${errors.location ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 flex-row items-center`}
          >
            <Text className={`flex-1 ${location ? 'text-gray-900 font-medium' : 'text-gray-400'}`} numberOfLines={1}>
                {location || 'Select Location'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          {errors.location && <Text className="text-red-500 text-[10px] mt-1 ml-1 font-medium">{errors.location}</Text>}
        </View>

        <LabelledInput 
          label="Item Description" 
          placeholder="Type here..." 
          multiline 
          value={itemDescription}
          onChangeText={(text) => {
            setItemDescription(text);
            if (errors.itemDescription) setErrors(prev => ({ ...prev, itemDescription: '' }));
          }}
          error={errors.itemDescription}
        />
        <LabelledInput 
          label="Rental Terms" 
          placeholder="Type here..." 
          multiline 
          value={rentalTerms}
          onChangeText={setRentalTerms}
        />
        <LabelledInput 
          label="Instructions to use" 
          placeholder="Type here..." 
          multiline 
          value={instructions}
          onChangeText={setInstructions}
        />

        {/* Rental Rate */}
        <ChipGroup 
          label="Rental Rate" 
          options={['Hour', 'Day', 'Weekly', 'Monthly']} 
          selected={rentalRate} 
          onSelect={setRentalRate} 
        />

        <LabelledInput 
          label={`Rental fee per ${rentalRate.toLowerCase()}`} 
          placeholder="Type here..." 
          value={rentalFee}
          onChangeText={setRentalFee}
          keyboardType="numeric"
        />

        {/* Availability */}
        <View className="mb-6">
          <Text className="text-sm font-bold text-black mb-3">Availability</Text>
          <AvailabilityCalendar 
            onAvailabilityChange={(data) => {
              setAvailability(data);
            }} 
          />
        </View>

        <LabelledInput 
          label="Security Deposit" 
          placeholder="Type here..." 
          value={securityDeposit}
          onChangeText={setSecurityDeposit}
          keyboardType="numeric"
        />

        <ChipGroup 
          label="Condition of the item" 
          options={['Brand New', 'New (like new)', 'Used (Good)', 'Used (Fair)', 'As a service']} 
          selected={condition} 
          onSelect={setCondition} 
        />

        {/* Category-Specific Fields */}
        <CategoryFieldRenderer 
          categoryName={categoryName}
          categoryData={categoryFormData}
          onFieldChange={handleCategoryFieldChange}
        />

        {/* Bump Item 
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
          */}

        <TouchableOpacity
          onPress={handleAddItem}
          disabled={isSubmitting}
          className="w-full h-14 rounded-full items-center justify-center mb-10"
          style={{ backgroundColor: isSubmitting ? '#9CA3AF' : '#2FA2B9' }}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Add</Text>
          )}
        </TouchableOpacity>

      </ScrollView>

      <SuccessPopup 
        visible={showSuccess}
        message="Item listing saved successfully!"
        onNext={() => {
          setShowSuccess(false);
          router.back();
        }}
      />

      <ErrorPopup 
        visible={showError}
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
    </SafeAreaView>
  );
}
