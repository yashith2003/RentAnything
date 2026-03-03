// components/itemDetails/AvailabilityCalendarView.tsx

import { useGetAvailabilityQuery, AvailabilityRecord } from '@/api/availability.service';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatTime(time?: string | null): string {
  if (!time) return '--';
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'pm' : 'am';
  const displayHour = hour % 12 || 12;
  return `${String(displayHour).padStart(2, '0')} : ${m} ${ampm}`;
}

interface Props {
  itemId: number | string;
}

export default function AvailabilityCalendarView({ itemId }: Props) {
  const { data: records, isLoading } = useGetAvailabilityQuery(Number(itemId), {
    skip: !itemId,
  });

  // Track displayed month
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed

  // Multi-select: store selected dates in a Set
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  // Build lookup map: "YYYY-MM-DD" -> AvailabilityRecord
  const availabilityMap = useMemo(() => {
    const map = new Map<string, AvailabilityRecord>();
    (records || []).forEach((r) => {
      map.set(r.availableDate.slice(0, 10), r);
    });
    return map;
  }, [records]);

  // Toggle a date in/out of the selection
  const toggleDate = (dateStr: string) => {
    setSelectedDates(prev => {
      const next = new Set(prev);
      if (next.has(dateStr)) next.delete(dateStr);
      else next.add(dateStr);
      return next;
    });
  };

  // For time slot display – show the first selected date with a record
  const firstSelectedRecord = useMemo(() => {
    for (const d of selectedDates) {
      const rec = availabilityMap.get(d);
      if (rec) return rec;
    }
    return null;
  }, [selectedDates, availabilityMap]);

  // Calendar grid calculations
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month, 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const goToPrev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const goToNext = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  if (isLoading) {
    return (
      <View className="items-center justify-center py-10">
        <ActivityIndicator size="large" color="#2FA2B9" />
      </View>
    );
  }

  return (
    <View className="mt-8">
      <Text className="mb-4 text-base font-bold">Availability</Text>

      {/* Legend */}
      <View className="flex-row gap-x-4 mb-4">
        <View className="flex-row items-center gap-x-1">
          <View className="w-3 h-3 rounded-full bg-[#2FA2B9]" />
          <Text className="text-xs text-gray-500">Available</Text>
        </View>
        <View className="flex-row items-center gap-x-1">
          <View className="w-3 h-3 rounded-full bg-[#FF3B30]" />
          <Text className="text-xs text-gray-500">Unavailable</Text>
        </View>
        {selectedDates.size > 0 && (
          <View className="flex-row items-center gap-x-1">
            <View className="w-3 h-3 rounded-full bg-gray-800" />
            <Text className="text-xs text-gray-500">{selectedDates.size} selected</Text>
          </View>
        )}
      </View>

      <View className="p-4 bg-white border border-gray-100 shadow-sm rounded-3xl" style={{ elevation: 2 }}>
        {/* Time Slots Row */}
        {firstSelectedRecord ? (
          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-row items-center px-3 py-2 gap-x-2 bg-cyan-500 rounded-xl">
              <Ionicons name="time-outline" size={16} color="white" />
              <Text className="text-xs font-bold text-white">
                {formatTime(firstSelectedRecord.startTime)}
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color="#9CA3AF" />
            <View className="flex-row items-center px-3 py-2 border border-gray-100 gap-x-2 rounded-xl">
              <Ionicons name="time-outline" size={16} color="#9CA3AF" />
              <Text className="text-xs text-gray-400">
                {formatTime(firstSelectedRecord.endTime)}
              </Text>
            </View>
          </View>
        ) : (
          <View className="flex-row items-center justify-center mb-5 py-2">
            <Text className="text-xs text-gray-400">Tap any date to view time slot</Text>
          </View>
        )}

        {/* Month Navigation */}
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={goToPrev}
            className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={16} color="#374151" />
          </TouchableOpacity>
          <Text className="text-sm font-bold text-gray-900">{monthName}</Text>
          <TouchableOpacity
            onPress={goToNext}
            className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center"
          >
            <Ionicons name="chevron-forward" size={16} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Day Labels */}
        <View className="flex-row justify-between mb-2">
          {DAYS.map((d) => (
            <Text key={d} className="text-[10px] text-gray-400 w-8 text-center font-medium">
              {d}
            </Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View className="flex-row flex-wrap">
          {/* Empty offset cells */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <View key={`empty-${i}`} className="w-8 h-8 m-[2px]" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const record = availabilityMap.get(dateStr);
            const isSelected = selectedDates.has(dateStr);
            const isAvailable = record?.isAvailable === true;
            const isUnavailable = record?.isAvailable === false;

            let bgColor = "transparent";
            let textColor = "text-gray-700";

            if (isSelected) {
              bgColor = "bg-gray-800";
              textColor = "text-white";
            } else if (isAvailable) {
              bgColor = "bg-[#2FA2B9]/10";
              textColor = "text-[#2FA2B9]";
            } else if (isUnavailable) {
              bgColor = "bg-[#FF3B30]/10";
              textColor = "text-[#FF3B30]";
            }

            return (
              <TouchableOpacity
                key={dateStr}
                onPress={() => toggleDate(dateStr)}
                className={`w-8 h-8 rounded-full items-center justify-center m-[2px] ${bgColor}`}
              >
                <Text className={`text-[11px] font-bold ${textColor}`}>
                  {day}
                </Text>
                {/* Dot indicator */}
                {(isAvailable || isUnavailable) && !isSelected && (
                  <View
                    style={{ backgroundColor: isAvailable ? '#2FA2B9' : '#FF3B30' }}
                    className="absolute bottom-1 w-1 h-1 rounded-full"
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* No data message */}
        {records && records.length === 0 && (
          <Text className="text-center text-gray-400 text-xs mt-4">
            No availability data set for this item.
          </Text>
        )}
      </View>
    </View>
  );
}
