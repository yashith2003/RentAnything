//RentAnything/components/form/AvailabilityCalendar.tsx

import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Text, Pressable, View, TextInput, ScrollView, NativeSyntheticEvent, NativeScrollEvent, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AvailabilityCalendarProps {
  onAvailabilityChange?: (availability: {
    dates: string[];
    startTime: string;
    endTime: string;
  }) => void;
}

const formatTimeToBackend = (timeStr: string, period: string) => {
  const cleanTime = timeStr.replace(/\s/g, '');
  const [hours, minutes] = cleanTime.split(':').map(Number);
  let h = hours || 0;
  if (period.toLowerCase() === 'pm' && h < 12) h += 12;
  if (period.toLowerCase() === 'am' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}:00`;
};

const PeriodPicker = ({ 
  initialValue, 
  onValueChange, 
  isPrimary = false 
}: { 
  initialValue: string, 
  onValueChange: (val: string) => void,
  isPrimary?: boolean
}) => {
  const periods = ['am', 'pm'];
  const scrollViewRef = useRef<ScrollView>(null);
  
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / 20);
    const newValue = periods[index] || periods[0];
    onValueChange(newValue);
  };

  useEffect(() => {
    const index = periods.indexOf(initialValue.toLowerCase());
    if (index !== -1) {
      scrollViewRef.current?.scrollTo({ y: index * 20, animated: false });
    }
  }, []);

  return (
    <View className="h-5 w-6 overflow-hidden ml-1">
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={20}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={{ paddingVertical: 0 }}
      >
        {periods.map((p) => (
          <View key={p} className="h-5 items-center justify-center">
            <Text className={`${isPrimary ? 'text-white' : 'text-gray-500'} text-[10px] uppercase font-bold`}>
              {p}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  onAvailabilityChange,
}) => {
  const [startTime, setStartTime] = useState('10 : 30');
  const [startPeriod, setStartPeriod] = useState('am');
  const [endTime, setEndTime] = useState('05 : 30');
  const [endPeriod, setEndPeriod] = useState('pm');
  const [activeTab, setActiveTab] = useState<'start' | 'end'>('start');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  const startInputRef = useRef<TextInput>(null);
  const endInputRef = useRef<TextInput>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    onAvailabilityChange?.({
      dates: Array.from(selectedDates),
      startTime: formatTimeToBackend(startTime, startPeriod),
      endTime: formatTimeToBackend(endTime, endPeriod),
    });
  }, [selectedDates, startTime, startPeriod, endTime, endPeriod]);

  const handleTabPress = (tab: 'start' | 'end') => {
    setActiveTab(tab);
    if (tab === 'start') {
      startInputRef.current?.focus();
    } else {
      endInputRef.current?.focus();
    }
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const toggleDate = (date: Date) => {
    if (date < today) return;
    
    const dateStr = formatDate(date);
    const newSelected = new Set(selectedDates);
    if (newSelected.has(dateStr)) {
      newSelected.delete(dateStr);
    } else {
      newSelected.add(dateStr);
    }
    setSelectedDates(newSelected);
  };

  const changeMonth = (offset: number) => {
    const direction = offset > 0 ? 1 : -1;
    
    // Animate out
    Animated.timing(slideAnim, {
      toValue: -direction * 50,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
      setViewDate(newDate);
      
      // Reset position and animate in
      slideAnim.setValue(direction * 50);
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    });
  };

  const jumpToToday = () => {
    const newDate = new Date(today.getFullYear(), today.getMonth(), 1);
    if (newDate.getTime() !== viewDate.getTime()) {
      setViewDate(newDate);
    }
  };

  const { gridDays, monthYearLabel } = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const label = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => {
      const day = prevMonthLastDate - firstDayOfMonth + i + 1;
      return { day, type: 'prev' as const, date: new Date(year, month - 1, day) };
    });

    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return { day, type: 'current' as const, date: new Date(year, month, day) };
    });

    const totalDaysSoFar = prevMonthDays.length + currentMonthDays.length;
    const remainingSlots = 42 - totalDaysSoFar; // Standard 6-row grid
    const nextMonthDays = Array.from({ length: remainingSlots }, (_, i) => {
      const day = i + 1;
      return { day, type: 'next' as const, date: new Date(year, month + 1, day) };
    });

    return {
      gridDays: [...prevMonthDays, ...currentMonthDays, ...nextMonthDays],
      monthYearLabel: label
    };
  }, [viewDate]);

  const daysLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
      {/* Time Selection Header */}
      <View className="mb-5">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-sm font-bold text-gray-400">Time</Text>
          <Pressable onPress={jumpToToday}>
             <Text className="text-xs font-bold text-[#2FA2B9]">Jump to Today</Text>
          </Pressable>
        </View>
        <View className="flex-row gap-4">
          <Pressable 
            onPress={() => handleTabPress('start')}
            style={{
              flex: 1, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
              flexDirection: 'row', paddingHorizontal: 8,
              backgroundColor: activeTab === 'start' ? '#2FA2B9' : '#FFFFFF',
              borderColor: activeTab === 'start' ? '#2FA2B9' : '#F3F4F6',
              borderWidth: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1, shadowRadius: 2, elevation: 2,
            }}
          >
            <Ionicons name="time-outline" size={18} color={activeTab === 'start' ? 'white' : '#D1D5DB'} />
            <View className={`w-[1px] h-4 mx-2 ${activeTab === 'start' ? 'bg-white/30' : 'bg-gray-200'}`} />
            <View className="flex-row items-center flex-1 justify-center">
                <TextInput
                  ref={startInputRef}
                  value={startTime}
                  onChangeText={setStartTime}
                  keyboardType="numbers-and-punctuation"
                  placeholderTextColor={activeTab === 'start' ? 'rgba(255,255,255,0.6)' : '#9CA3AF'}
                  style={{ color: activeTab === 'start' ? 'white' : 'black', fontWeight: 'bold', fontSize: 13, textAlign: 'center', width: 50 }}
                  selectionColor={activeTab === 'start' ? 'white' : '#2FA2B9'}
                />
                <PeriodPicker initialValue={startPeriod} onValueChange={setStartPeriod} isPrimary={activeTab === 'start'} />
            </View>
          </Pressable>
          <Pressable 
            onPress={() => handleTabPress('end')}
            style={{
              flex: 1, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
              flexDirection: 'row', paddingHorizontal: 8,
              backgroundColor: activeTab === 'end' ? '#2FA2B9' : '#FFFFFF',
              borderColor: activeTab === 'end' ? '#2FA2B9' : '#F3F4F6',
              borderWidth: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1, shadowRadius: 2, elevation: 2,
            }}
          >
            <Ionicons name="time-outline" size={18} color={activeTab === 'end' ? 'white' : '#D1D5DB'} />
            <View className={`w-[1px] h-4 mx-2 ${activeTab === 'end' ? 'bg-white/30' : 'bg-gray-200'}`} />
            <View className="flex-row items-center flex-1 justify-center">
                <TextInput
                  ref={endInputRef}
                  value={endTime}
                  onChangeText={setEndTime}
                  keyboardType="numbers-and-punctuation"
                  placeholderTextColor={activeTab === 'end' ? 'rgba(255,255,255,0.6)' : '#9CA3AF'}
                  style={{ color: activeTab === 'end' ? 'white' : 'black', fontWeight: 'bold', fontSize: 13, textAlign: 'center', width: 50 }}
                  selectionColor={activeTab === 'end' ? 'white' : '#2FA2B9'}
                />
                <PeriodPicker initialValue={endPeriod} onValueChange={setEndPeriod} isPrimary={activeTab === 'end'} />
            </View>
          </Pressable>
        </View>
      </View>

      {/* Month Navigation */}
      <View className="flex-row justify-between items-center mb-6">
        <Pressable onPress={() => changeMonth(-1)} hitSlop={15}>
          <Ionicons name="chevron-back" size={20} color="black" />
        </Pressable>
        <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
          <Text className="font-bold text-gray-800 text-base">{monthYearLabel}</Text>
        </Animated.View>
        <Pressable onPress={() => changeMonth(1)} hitSlop={15}>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </Pressable>
      </View>

      {/* Days Header */}
      <View className="flex-row justify-between mb-4 px-1">
        {daysLabels.map((day) => (
          <Text key={day} className="text-xs font-bold text-black w-8 text-center">{day}</Text>
        ))}
      </View>

      {/* Date Grid */}
      <Animated.View 
        className="flex-row flex-wrap justify-between"
        style={{ opacity: slideAnim.interpolate({ inputRange: [-50, 0, 50], outputRange: [0, 1, 0] }) }}
      >
        {gridDays.map((item, idx) => {
          const isSelected = selectedDates.has(formatDate(item.date));
          const isToday = formatDate(item.date) === formatDate(today);
          const isPast = item.date < today;
          const isCurrentMonth = item.type === 'current';
          
          let highlightStyle = "";
          let textStyle = "text-gray-700";
          
          if (isSelected) {
            highlightStyle = "bg-[#2FA2B9] rounded-full";
            textStyle = "text-white";
          } else if (isToday) {
            highlightStyle = "border-2 border-[#2FA2B9] rounded-full";
            textStyle = "text-[#2FA2B9]";
          }

          if (!isCurrentMonth) {
            textStyle = "text-gray-200";
          } else if (isPast && !isSelected) {
            textStyle = "text-gray-300";
          }

          return (
            <Pressable 
              key={`${item.type}-${idx}`} 
              onPress={() => toggleDate(item.date)}
              disabled={isPast && !isSelected} // Allow deselecting if it was somehow selected
              className="w-[14%] aspect-square items-center justify-center mb-1"
            >
              <View className={`w-9 h-9 items-center justify-center ${highlightStyle}`}>
                <Text className={`${textStyle} font-semibold text-sm`}>
                  {item.day.toString().padStart(2, '0')}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </Animated.View>
    </View>
  );
};
