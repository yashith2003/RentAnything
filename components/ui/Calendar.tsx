import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CalendarProps {
  days: { 
    day: number; 
    isCurrentMonth: boolean; 
    isSelected?: boolean; 
    selectionType?: 'start' | 'end';
  }[];
}

export default function Calendar({ days }: CalendarProps) {
  return (
    <View>
      {/* Month Header */}
      <View className="flex-row justify-between items-center mb-6 px-2">
        <TouchableOpacity><Ionicons name="chevron-back" size={20} color="black" /></TouchableOpacity>
        <Text className="text-base font-bold text-black">January 2022</Text>
        <TouchableOpacity><Ionicons name="chevron-forward" size={20} color="black" /></TouchableOpacity>
      </View>

      {/* Weekday Headers */}
      <View className="flex-row justify-between mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <Text key={d} className="text-[11px] font-bold text-gray-800 w-9 text-center">{d}</Text>
        ))}
      </View>

      {/* Days Grid */}
      <View className="flex-row flex-wrap justify-start">
        {days.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            className={`w-[14.28%] h-10 items-center justify-center`}
          >
            <View 
                className={`w-9 h-9 items-center justify-center rounded-full 
                    ${item.isSelected && item.selectionType === 'start' ? 'bg-[#4B5563]' : ''}
                    ${item.isSelected && item.selectionType === 'end' ? 'bg-[#2FA2B9]' : ''}
                `}
            >
                <Text className={`text-xs font-medium 
                    ${!item.isCurrentMonth ? 'text-gray-200' : 'text-gray-800'}
                    ${item.isSelected ? 'text-white font-bold' : ''}
                `}>
                    {item.day < 10 ? `0${item.day}` : item.day}
                </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
