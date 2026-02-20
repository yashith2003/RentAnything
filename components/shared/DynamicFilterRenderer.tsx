import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { FilterConfig } from '@/api/filter.service';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';

interface DynamicFilterRendererProps {
  filter: FilterConfig;
  value: any;
  onChange: (value: any) => void;
}

export default function DynamicFilterRenderer({ filter, value, onChange }: DynamicFilterRendererProps) {
  const labelStyle = "text-base font-bold text-[#1A1A1A] mb-4";
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  
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

  const ColorChip = ({ color, label, selected, onPress }: { color: string; label: string; selected: boolean; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      className="items-center mr-6 mb-3"
    >
      <View 
        className={`w-10 h-10 rounded-full border-2 items-center justify-center mb-1 ${
          selected ? 'border-[#2FA2B9]' : 'border-gray-100'
        }`}
        style={{ backgroundColor: color === 'White' ? '#FFF' : color === 'Gray' ? '#D1D5DB' : color === 'Blue' ? '#1D4ED8' : color === 'Black' ? '#000' : color }}
      >
        {selected && <Ionicons name="checkmark" size={16} color={color === 'White' ? '#2FA2B9' : 'white'} />}
      </View>
      <Text className={`text-[10px] ${selected ? 'text-[#2FA2B9] font-bold' : 'text-gray-400'}`}>{label}</Text>
    </TouchableOpacity>
  );

  switch (filter.type) {
    case 'select':
    case 'multi-select':
      return (
        <View className="mb-6">
          <Text className={labelStyle}>{filter.label}</Text>
          <View className="flex-row flex-wrap">
            {filter.options.map((opt: string) => (
              <Chip
                key={opt}
                label={opt}
                selected={filter.type === 'multi-select' ? (value || []).includes(opt) : value === opt}
                onPress={() => {
                  if (filter.type === 'multi-select') {
                    const newValue = (value || []).includes(opt)
                      ? (value || []).filter((v: string) => v !== opt)
                      : [...(value || []), opt];
                    onChange(newValue);
                  } else {
                    onChange(opt);
                  }
                }}
              />
            ))}
          </View>
        </View>
      );

    case 'slider':
      const min = filter.options[0] || 0;
      const max = filter.options[1] || 1000;
      const step = filter.options[2] || 1;
      return (
        <View className="mb-6">
          <Text className={labelStyle}>{filter.label}</Text>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={Number(min)}
            maximumValue={Number(max)}
            step={Number(step)}
            value={Number(value || min)}
            onSlidingComplete={onChange}
            minimumTrackTintColor="#2FA2B9"
            maximumTrackTintColor="#F0F0F0"
            thumbTintColor="#2FA2B9"
          />
          <View className="flex-row justify-between mt-2 px-1">
            <View className="flex-1">
               <Text className="text-[10px] text-gray-400 font-bold mb-1">Minimum</Text>
               <View className="bg-white border border-gray-100 rounded-xl px-4 py-2">
                 <Text className="text-center font-bold text-xs">{min}</Text>
               </View>
            </View>
            <View className="w-10" />
            <View className="flex-1">
               <Text className="text-[10px] text-gray-400 font-bold mb-1">Maximum</Text>
               <View className="bg-white border border-gray-100 rounded-xl px-4 py-2">
                 <Text className="text-center font-bold text-xs">{value || max}</Text>
               </View>
            </View>
          </View>
        </View>
      );

    case 'color-select':
      return (
        <View className="mb-6">
          <Text className={labelStyle}>{filter.label}</Text>
          <View className="flex-row flex-wrap">
            {filter.options.map((opt: string) => (
              <ColorChip
                key={opt}
                label={opt}
                color={opt}
                selected={value === opt}
                onPress={() => onChange(opt)}
              />
            ))}
          </View>
        </View>
      );

    case 'date':
      return (
        <View className="mb-6">
          <Text className={labelStyle}>{filter.label}</Text>
          <View className="flex-row justify-between gap-x-4">
            <TouchableOpacity 
              onPress={() => setDatePickerVisibility(true)}
              className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-3 flex-row items-center justify-between"
            >
              <Text className="text-sm font-medium text-black">
                {value ? new Date(value).toLocaleDateString() : 'Select Date'}
              </Text>
              <Ionicons name="calendar-outline" size={18} color="#A0A0A0" />
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={(date) => {
              onChange(date.toISOString());
              setDatePickerVisibility(false);
            }}
            onCancel={() => setDatePickerVisibility(false)}
          />
        </View>
      );

    case 'range':
      return (
        <View className="mb-6">
          <Text className={labelStyle}>{filter.label}</Text>
          <View className="flex-row justify-between gap-x-4">
            <View className="flex-1">
              <Text className="text-xs text-gray-500 font-bold mb-2">Minimum</Text>
              <TextInput
                value={value?.min?.toString() || ''}
                onChangeText={(v) => onChange({ ...value, min: v })}
                placeholder={filter.options[0]?.toString()}
                className={`bg-white border border-gray-100 rounded-xl px-4 py-3 text-center font-bold`}
                keyboardType="numeric"
                placeholderTextColor="#A0A0A0"
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 font-bold mb-2">Maximum</Text>
              <TextInput
                value={value?.max?.toString() || ''}
                onChangeText={(v) => onChange({ ...value, max: v })}
                placeholder={filter.options[1]?.toString()}
                className={`bg-white border border-gray-100 rounded-xl px-4 py-3 text-center font-bold`}
                keyboardType="numeric"
                placeholderTextColor="#A0A0A0"
              />
            </View>
          </View>
        </View>
      );

    case 'toggle':
      return (
        <View className="mb-6 flex-row items-center justify-between">
          <Text className="text-base font-bold text-[#1A1A1A]">{filter.label}</Text>
          <Switch
            value={!!value}
            onValueChange={onChange}
            trackColor={{ false: '#F0F0F0', true: '#2FA2B9' }}
            thumbColor="#FFF"
          />
        </View>
      );

    case 'text':
      return (
        <View className="mb-6">
          <Text className={labelStyle}>{filter.label}</Text>
          <View className="flex-row items-center bg-white border border-gray-100 rounded-xl px-4 h-12">
             <TextInput
               value={value || ''}
               onChangeText={onChange}
               placeholder={`Enter ${filter.label.toLowerCase()}`}
               className="flex-1 text-sm text-black"
               placeholderTextColor="#A0A0A0"
             />
          </View>
        </View>
      );

    default:
      return null;
  }
}

