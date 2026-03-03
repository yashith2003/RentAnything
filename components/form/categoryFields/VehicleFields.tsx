//RentAnything/components/form/categoryFields/VehicleFields/jsx

import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { LabelledInput } from '@/components/form/LabelledInput';
import { ChipGroup } from '@/components/form/ChipGroup';
import { DocumentUploadBox } from '@/components/form/DocumentUploadBox';
import { Ionicons } from '@expo/vector-icons';

interface VehicleFieldsProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
}

export const VehicleFields: React.FC<VehicleFieldsProps> = ({ formData, onFieldChange }) => {
  return (
    <View>
      {/* Vehicle Type */}
      <ChipGroup 
        label="Vehicle Type" 
        options={['Car', 'SUV', 'Van', 'Bike', 'Scooter', 'Truck', 'Other']} 
        selected={formData.vehicleType || 'Car'} 
        onSelect={(value) => onFieldChange('vehicleType', value)} 
      />

      <ChipGroup 
        label="Seating Capacity" 
        options={[2, 4, 6, 8, 10]} 
        selected={formData.seatingCapacity || 4} 
        onSelect={(value) => onFieldChange('seatingCapacity', value)} 
      />

      <ChipGroup 
        label="Fuel Type" 
        options={['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Other']} 
        selected={formData.fuelType || 'Petrol'} 
        onSelect={(value) => onFieldChange('fuelType', value)} 
      />

      <ChipGroup 
        label="Color" 
        options={['White', 'Gray', 'Blue', 'Black', 'Red', 'Silver']} 
        selected={formData.color || 'Blue'} 
        onSelect={(value) => onFieldChange('color', value)} 
      />

      <LabelledInput 
        label="Vehicle Number" 
        placeholder="Type here..." 
        value={formData.vehicleNumber || ''}
        onChangeText={(value) => onFieldChange('vehicleNumber', value)}
      />

      {/* Verification Documents */}
      <View className="mb-6">
        <Text className="text-sm font-bold text-black mb-1">Verify Your Vehicle</Text>
        <Text className="text-xs text-gray-400 mb-4 leading-4">
          Upload valid documents or files to verify as part of the identification process.
        </Text>
        
        <View className="mb-4">
          <Text className="text-xs font-semibold text-gray-600 mb-2">Vehicle Registration Documents</Text>
          <DocumentUploadBox 
            height={100} 
            fileUri={formData.registrationDocument}
            fileName={formData.registrationDocumentName}
            mimeType={formData.registrationDocumentType}
            onFileSelect={(uri, name, type) => {
                onFieldChange('registrationDocument', uri);
                onFieldChange('registrationDocumentName', name);
                onFieldChange('registrationDocumentType', type);
            }}
          />
        </View>

        <View className="mb-4">
          <Text className="text-xs font-semibold text-gray-600 mb-2">Proof of Insurance</Text>
          <DocumentUploadBox 
            height={100} 
            fileUri={formData.insuranceDocument}
            fileName={formData.insuranceDocumentName}
            mimeType={formData.insuranceDocumentType}
            onFileSelect={(uri, name, type) => {
                onFieldChange('insuranceDocument', uri);
                onFieldChange('insuranceDocumentName', name);
                onFieldChange('insuranceDocumentType', type);
            }}
          />
        </View>

        <View className="mb-4">
          <Text className="text-xs font-semibold text-gray-600 mb-2">Vehicle Revenue License</Text>
          <DocumentUploadBox 
            height={100} 
            fileUri={formData.revenueLicense}
            fileName={formData.revenueLicenseName}
            mimeType={formData.revenueLicenseType}
            onFileSelect={(uri, name, type) => {
                onFieldChange('revenueLicense', uri);
                onFieldChange('revenueLicenseName', name);
                onFieldChange('revenueLicenseType', type);
            }}
          />
        </View>
      </View>

      <LabelledInput 
        label="Delivery Fee" 
        placeholder="Type here..." 
        value={formData.deliveryFee || ''}
        onChangeText={(value) => onFieldChange('deliveryFee', value)}
        keyboardType="numeric"
      />

      {/* Driver Toggle */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-bold text-black">Book with driver</Text>
        <Switch 
          value={formData.driverAvailable || false} 
          onValueChange={(value) => onFieldChange('driverAvailable', value)} 
          trackColor={{ false: '#E5E7EB', true: '#2FA2B9' }}
        />
      </View>
      <Text className="text-xs text-gray-400 mb-6 leading-4">
        Don't have a driver? You can book with them also.
      </Text>

      {formData.driverAvailable && (
        <View>
          <LabelledInput 
            label="Driver Name" 
            placeholder="Type here..." 
            value={formData.driverName || ''}
            onChangeText={(value) => onFieldChange('driverName', value)}
          />
          <ChipGroup 
            label="Driver Gender" 
            options={['Male', 'Female', 'Other']} 
            selected={formData.driverGender || 'Male'} 
            onSelect={(value) => onFieldChange('driverGender', value)} 
          />
          <View className="mb-6">
            <Text className="text-sm font-bold text-black mb-2">Driving License</Text>
            <DocumentUploadBox 
              height={120} 
              fileUri={formData.driverLicense}
              fileName={formData.driverLicenseName}
              mimeType={formData.driverLicenseType}
              onFileSelect={(uri, name, type) => {
                  onFieldChange('driverLicense', uri);
                  onFieldChange('driverLicenseName', name);
                  onFieldChange('driverLicenseType', type);
              }}
            />
          </View>
          <LabelledInput 
            label="Driver Fee" 
            placeholder="Type here..." 
            value={formData.driverFee || ''}
            onChangeText={(value) => onFieldChange('driverFee', value)}
            keyboardType="numeric"
          />
        </View>
      )}
    </View>
  );
};
