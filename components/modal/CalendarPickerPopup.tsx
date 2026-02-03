import Calendar from '@/components/ui/Calendar';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

interface CalendarPickerPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onDone: (data: { startDate: string; endDate: string; startTime: string; endTime: string }) => void;
}

export default function CalendarPickerPopup({ isVisible, onClose, onDone }: CalendarPickerPopupProps) {
  const [activeTime, setActiveTime] = useState<'start' | 'end'>('start');
  
  // Dummy data for the calendar grid to match the image exactly
  const days: { day: number; isCurrentMonth: boolean; isSelected?: boolean; selectionType?: 'start' | 'end' }[] = [
    { day: 26, isCurrentMonth: false }, { day: 27, isCurrentMonth: false }, { day: 28, isCurrentMonth: false }, 
    { day: 29, isCurrentMonth: false }, { day: 30, isCurrentMonth: false }, { day: 31, isCurrentMonth: false }, { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true }, { day: 3, isCurrentMonth: true }, { day: 4, isCurrentMonth: true }, 
    { day: 5, isCurrentMonth: true }, { day: 6, isCurrentMonth: true, isSelected: true, selectionType: 'start' }, { day: 7, isCurrentMonth: true }, { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true }, { day: 10, isCurrentMonth: true }, { day: 11, isCurrentMonth: true }, 
    { day: 12, isCurrentMonth: true }, { day: 13, isCurrentMonth: true }, { day: 14, isCurrentMonth: true }, { day: 15, isCurrentMonth: true },
    { day: 16, isCurrentMonth: true }, { day: 17, isCurrentMonth: true }, { day: 18, isCurrentMonth: true }, 
    { day: 19, isCurrentMonth: true, isSelected: true, selectionType: 'end' }, { day: 20, isCurrentMonth: true }, { day: 21, isCurrentMonth: true }, { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true }, { day: 24, isCurrentMonth: true }, { day: 25, isCurrentMonth: true }, 
    { day: 26, isCurrentMonth: true }, { day: 27, isCurrentMonth: true }, { day: 28, isCurrentMonth: true }, { day: 29, isCurrentMonth: true },
    { day: 31, isCurrentMonth: true }, { day: 1, isCurrentMonth: false }, { day: 2, isCurrentMonth: false }, 
    { day: 3, isCurrentMonth: false }, { day: 4, isCurrentMonth: false }, { day: 5, isCurrentMonth: false }, { day: 6, isCurrentMonth: false },
  ];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 bg-black/60 justify-center items-center px-6"
        onPress={onClose}
      >
        <Pressable 
          className="bg-white rounded-[32px] p-6 w-full shadow-2xl"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-base font-bold text-black mb-4">Time</Text>
          
          {/* Time Picker Row */}
          <View className="flex-row gap-x-4 mb-6">
            <TouchableOpacity 
                onPress={() => setActiveTime('start')}
                className={`flex-1 h-12 rounded-xl flex-row items-center px-4 border ${activeTime === 'start' ? 'bg-[#2FA2B9] border-[#2FA2B9]' : 'bg-white border-gray-100'}`}
            >
                <Ionicons name="time-outline" size={20} color={activeTime === 'start' ? 'white' : '#9CA3AF'} />
                <View className="mx-2 w-[1px] h-4 bg-gray-200" style={{ backgroundColor: activeTime === 'start' ? 'rgba(255,255,255,0.3)' : '#E5E7EB' }} />
                <Text className={`text-xs font-bold ${activeTime === 'start' ? 'text-white' : 'text-[#2FA2B9]'}`}>10 : 30  am</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => setActiveTime('end')}
                className={`flex-1 h-12 rounded-xl flex-row items-center px-4 border ${activeTime === 'end' ? 'bg-[#2FA2B9] border-[#2FA2B9]' : 'bg-white border-gray-100'}`}
            >
                <Ionicons name="time-outline" size={20} color={activeTime === 'end' ? 'white' : '#9CA3AF'} />
                <View className="mx-2 w-[1px] h-4 bg-gray-200" style={{ backgroundColor: activeTime === 'end' ? 'rgba(255,255,255,0.3)' : '#E5E7EB' }} />
                <Text className={`text-xs font-bold ${activeTime === 'end' ? 'text-white' : 'text-gray-800'}`}>05 : 30  pm</Text>
            </TouchableOpacity>
          </View>


          {/* Calendar Component */}
          <Calendar days={days} />

          {/* Footer Buttons */}
          <View className="flex-row gap-x-4 mt-8">
            <TouchableOpacity 
              onPress={onClose}
              className="flex-1 h-12 rounded-full border border-cyan-500 items-center justify-center"
            >
              <Text className="text-cyan-500 font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                  onDone({ startDate: '2022-01-06', endDate: '2022-01-19', startTime: '10:30 am', endTime: '05:30 pm' });
                  onClose();
              }}
              className="flex-1 h-12 rounded-full bg-cyan-500 items-center justify-center"
            >
              <Text className="text-white font-bold">Done</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
