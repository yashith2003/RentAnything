//RentAnything/components/shared/RangeSlider.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, LayoutChangeEvent, TextInput } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, useDerivedValue, runOnJS, useAnimatedProps } from 'react-native-reanimated';

// Create an animated text component for smooth, zero-latency updates
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  initialMin?: number;
  initialMax?: number;
  onValueChange?: (min: number, max: number) => void;
  onSlidingComplete?: (min: number, max: number) => void;
  showTicks?: boolean;
  tickStep?: number;
  labelPrefix?: string;
  labelSuffix?: string;
  isRating?: boolean;
}

const THUMB_SIZE = 20;

export default function RangeSlider({
  min,
  max,
  step = 1,
  initialMin,
  initialMax,
  onValueChange,
  onSlidingComplete,
  showTicks = false,
  tickStep = 1,
  labelPrefix = 'Rs: ',
  labelSuffix = '',
  isRating = false,
}: RangeSliderProps) {
  const [width, setWidth] = useState(0);
  const [minInput, setMinInput] = useState<string | null>(null);
  const [maxInput, setMaxInput] = useState<string | null>(null);
  
  const minVal = useSharedValue(initialMin ?? min);
  const maxVal = useSharedValue(initialMax ?? max);
  const isDragging = useSharedValue(false);

  useEffect(() => {
    if (!isDragging.value) {
      if (initialMin !== undefined) minVal.value = initialMin;
      if (initialMax !== undefined) maxVal.value = initialMax;
    }
  }, [initialMin, initialMax]);
  
  const trackWidth = width - THUMB_SIZE;
  
  const getX = (val: number) => {
    'worklet';
    if (trackWidth <= 0) return 0;
    return ((val - min) / (max - min)) * trackWidth;
  };
  
  const getVal = (x: number) => {
    'worklet';
    if (trackWidth <= 0) return min;
    const percent = Math.max(0, Math.min(1, x / trackWidth));
    const rawValue = min + percent * (max - min);
    return Math.round(rawValue / step) * step;
  };

  const minX = useDerivedValue(() => getX(minVal.value));
  const maxX = useDerivedValue(() => getX(maxVal.value));

  const minProps = useAnimatedProps(() => {
    const value = Math.round(minVal.value * 10) / 10;
    const displayValue = isRating ? value.toFixed(1) : value.toLocaleString();
    return {
      text: minInput !== null ? minInput : `${labelPrefix}${displayValue}${labelSuffix}`,
    } as any;
  }, [minInput, isRating, labelPrefix, labelSuffix]);

  const maxProps = useAnimatedProps(() => {
    const value = Math.round(maxVal.value * 10) / 10;
    const displayValue = isRating ? value.toFixed(1) : value.toLocaleString();
    return {
      text: maxInput !== null ? maxInput : `${labelPrefix}${displayValue}${labelSuffix}`,
    } as any;
  }, [maxInput, isRating, labelPrefix, labelSuffix]);

  const minGesture = Gesture.Pan()
    .activeOffsetX([-5, 5])
    .onStart(() => {
      isDragging.value = true;
    })
    .onChange((e) => {
      const newVal = getVal(minX.value + e.changeX);
      if (newVal >= min && newVal <= maxVal.value - step) {
        if (minVal.value !== newVal) {
          minVal.value = newVal;
        }
      }
    })
    .onEnd(() => {
      isDragging.value = false;
      if (onValueChange) runOnJS(onValueChange)(minVal.value, maxVal.value);
      if (onSlidingComplete) runOnJS(onSlidingComplete)(minVal.value, maxVal.value);
    });

  const maxGesture = Gesture.Pan()
    .activeOffsetX([-5, 5])
    .onStart(() => {
      isDragging.value = true;
    })
    .onChange((e) => {
      const newVal = getVal(maxX.value + e.changeX);
      if (newVal <= max && newVal >= minVal.value + step) {
        if (maxVal.value !== newVal) {
          maxVal.value = newVal;
        }
      }
    })
    .onEnd(() => {
      isDragging.value = false;
      if (onValueChange) runOnJS(onValueChange)(minVal.value, maxVal.value);
      if (onSlidingComplete) runOnJS(onSlidingComplete)(minVal.value, maxVal.value);
    });

  const minThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: minX.value }],
  }));

  const maxThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: maxX.value }],
  }));

  const lineStyle = useAnimatedStyle(() => ({
    left: minX.value + THUMB_SIZE / 2,
    width: Math.max(0, maxX.value - minX.value),
  }));

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const handleMinInputChange = (text: string) => {
    const rawValue = text.replace(/Rs: /g, '').replace(/,/g, '');
    setMinInput(rawValue);
    
    const parsed = parseInt(rawValue, 10);
    if (!isNaN(parsed) && parsed >= min && parsed <= maxVal.value - step) {
      minVal.value = parsed;
    }
  };

  const handleMaxInputChange = (text: string) => {
    const rawValue = text.replace(/Rs: /g, '').replace(/,/g, '');
    setMaxInput(rawValue);
    
    const parsed = parseInt(rawValue, 10);
    if (!isNaN(parsed) && parsed <= max && parsed >= minVal.value + step) {
      maxVal.value = parsed;
    }
  };

  const finalizeMinInput = () => {
    setMinInput(null);
    if (onValueChange) onValueChange(minVal.value, maxVal.value);
    if (onSlidingComplete) onSlidingComplete(minVal.value, maxVal.value);
  };

  const finalizeMaxInput = () => {
    setMaxInput(null);
    if (onValueChange) onValueChange(minVal.value, maxVal.value);
    if (onSlidingComplete) onSlidingComplete(maxVal.value, maxVal.value);
  };

  return (
    <View className="w-full">
      <GestureHandlerRootView className="w-full h-10 justify-center">
        <View className="h-1 w-full relative justify-center" onLayout={onLayout}>
          <View className="h-1 bg-[#F0F0F0] rounded-full w-full absolute" />
          <Animated.View className="h-1 bg-[#2FA2B9] rounded-full absolute" style={lineStyle} />
          
          {showTicks && width > 0 && (
            <View className="absolute w-full h-[10px] flex-row items-center">
              {Array.from({ length: Math.floor((max - min) / tickStep) + 1 }).map((_, i) => {
                const tickVal = min + i * tickStep;
                const left = getX(tickVal);
                return <View key={i} className="absolute w-[2px] h-[6px] bg-[#E0E0E0] rounded-full" style={{ left: left + THUMB_SIZE / 2 }} />;
              })}
            </View>
          )}

          <GestureDetector gesture={minGesture}>
            <Animated.View 
              className="w-5 h-5 bg-[#2FA2B9] rounded-full absolute border-2 border-white shadow-sm shadow-black/10 z-10" 
              style={[minThumbStyle, { elevation: 3 }]} 
            />
          </GestureDetector>
          
          <GestureDetector gesture={maxGesture}>
            <Animated.View 
              className="w-5 h-5 bg-[#2FA2B9] rounded-full absolute border-2 border-white shadow-sm shadow-black/10 z-10" 
              style={[maxThumbStyle, { elevation: 3 }]} 
            />
          </GestureDetector>
        </View>
      </GestureHandlerRootView>

      <View className="flex-row justify-between mt-2">
         <View className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
            <Text className="text-[10px] text-gray-400 mb-1">Minimum</Text>
            <AnimatedTextInput 
              animatedProps={minProps}
              editable={true}
              keyboardType={isRating ? "decimal-pad" : "number-pad"}
              onChangeText={handleMinInputChange}
              onFocus={() => setMinInput(Math.round(minVal.value).toString())}
              onBlur={finalizeMinInput}
              className="p-0 m-0 font-bold text-sm text-black"
              defaultValue={`${labelPrefix}${initialMin ?? min}${labelSuffix}`}
            />
         </View>
         <View className="w-4" />
         <View className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
            <Text className="text-[10px] text-gray-400 mb-1">Maximum</Text>
            <AnimatedTextInput 
              animatedProps={maxProps}
              editable={true}
              keyboardType={isRating ? "decimal-pad" : "number-pad"}
              onChangeText={handleMaxInputChange}
              onFocus={() => setMaxInput(Math.round(maxVal.value).toString())}
              onBlur={finalizeMaxInput}
              className="p-0 m-0 font-bold text-sm text-black"
              defaultValue={`${labelPrefix}${initialMax ?? max}${labelSuffix}`}
            />
         </View>
      </View>
    </View>
  );
}
