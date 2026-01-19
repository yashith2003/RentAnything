
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

const LABELS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
// Mock data points normalized for a simple SVG-like path or view representation
const DATA_POINTS = [20, 40, 35, 70, 50, 30, 60]; 

export default function EarningsPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('Day');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black">Earnings</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Balance Section */}
        <View className="items-center mt-4 mb-8">
          <Text className="text-3xl font-bold text-black mb-1">Rs: 1500.00</Text>
          <Text className="text-sm text-gray-400">Pending Balance</Text>
        </View>

        {/* Statistics Header */}
        <View className="px-6 mb-6">
          <Text className="text-base font-bold text-black mb-4">Statistics</Text>
          
          {/* Time Tabs */}
          <View className="flex-row justify-between items-center bg-transparent">
            {['Day', 'Week', 'Month', 'Year'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedTab(tab)}
                className="px-6 py-2 rounded-full"
                style={{
                  backgroundColor: selectedTab === tab ? Colors.primary : 'transparent',
                }}
              >
                <Text
                  className={`text-sm ${
                    selectedTab === tab ? 'text-white font-medium' : 'text-gray-400'
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Chart Area (Mock Visual) */}
        <View className="px-6 mb-8 relative h-64 justify-end">
             {/* Selected Point Tooltip Mock */}
             <View className="absolute top-10 left-[32%] items-center z-10">
                <View className="bg-white border px-3 py-2 rounded-xl mb-1 shadow-sm" style={{ borderColor: Colors.primary }}>
                    <Text className="font-bold text-xs" style={{ color: Colors.primary }}>Rs: 2000</Text>
                </View>
                {/* Dot */}
                 <View className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: Colors.primary }} />
                 {/* Dotted Line */}
                 <View className="w-[1px] h-32 border-l border-dashed border-gray-400 mt-1" />
            </View>

            {/* Simple SVG-like Curve Representation using Views is very hard without SVG.
                We will use a simplified Bar/Line approximation or just a placeholder image if we had one.
                For now, let's create a visual approximation using absolute positioned views to mimic a specific curve 
                similar to the design if possible, or just a placeholder 'Graph' area. 
            */}
            <View className="h-40 w-full flex-row items-end justify-between px-2">
                {/* This is a very rough visual approximation of a graph since we don't have a chart lib */}
                <View className="w-full h-full bg-[#E0F2F1] absolute bottom-0 rounded-3xl opacity-50" style={{transform: [{scaleY: 0.8}]}} />
                
                {/* Drawing a Bezier curve manually with Views is impossible. 
                    We will simulate the axis and labels. */}
                 {/* Current mocked curve is static image in user mind, we will leave space or make a simple bar chart as fallback if this was real code without libs. 
                     For this task, I will leave the tooltip and 'labels' which give the structure.
                 */}
                 
            </View>

             {/* X-Axis Labels */}
            <View className="flex-row justify-between mt-4 px-2">
                {LABELS.map((label, index) => (
                    <Text key={index} className={`text-xs ${label === 'May' ? 'font-bold' : 'text-gray-400'}`} style={label === 'May' ? { color: Colors.primary } : {}}>
                        {label}
                    </Text>
                ))}
            </View>
        </View>

        {/* Income Report Section */}
        <View className="px-6 mb-10 flex-row items-center justify-between">
            <Text className="text-base font-bold text-black">July 2025 Income Report</Text>
            
            <TouchableOpacity className="px-6 py-3 rounded-full" style={{ backgroundColor: Colors.primary }}>
                <Text className="text-white font-semibold">Download</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
