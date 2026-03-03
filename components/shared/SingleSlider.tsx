//RentAnything/components/shared/SingleSlider.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, LayoutChangeEvent, TextInput } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, useDerivedValue, runOnJS, useAnimatedProps } from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface SingleSliderProps {
  min: number;
  max: number;
  step?: number;
  value?: number;
  onValueChange?: (val: number) => void;
  onSlidingComplete?: (val: number) => void;
  labelPrefix?: string;
  labelSuffix?: string;
}

const THUMB_SIZE = 20;

export default function SingleSlider({
  min,
  max,
  step = 0.1,
  value,
  onValueChange,
  onSlidingComplete,
  labelPrefix = '',
  labelSuffix = '',
}: SingleSliderProps) {
  const [width, setWidth] = useState(0);
  
  const val = useSharedValue(value ?? min);
  const isDragging = useSharedValue(false);

  useEffect(() => {
    if (!isDragging.value && value !== undefined) {
      val.value = value;
    }
  }, [value]);
  
  const trackWidth = width - THUMB_SIZE;
  
  const getX = (v: number) => {
    'worklet';
    if (trackWidth <= 0) return 0;
    return ((v - min) / (max - min)) * trackWidth;
  };
  
  const getVal = (x: number) => {
    'worklet';
    if (trackWidth <= 0) return min;
    const percent = Math.max(0, Math.min(1, x / trackWidth));
    const rawValue = min + percent * (max - min);
    return Math.round(rawValue / step) * step;
  };

  const thumbX = useDerivedValue(() => getX(val.value));

  const labelProps = useAnimatedProps(() => ({
    text: `${labelPrefix}${val.value.toFixed(1)}${labelSuffix}`,
  } as any));

  const gesture = Gesture.Pan()
    .activeOffsetX([-5, 5])
    .onStart(() => {
      isDragging.value = true;
    })
    .onChange((e) => {
      const newVal = getVal(thumbX.value + e.changeX);
      if (newVal >= min && newVal <= max) {
        if (val.value !== newVal) {
          val.value = newVal;
        }
      }
    })
    .onEnd(() => {
      isDragging.value = false;
      if (onValueChange) runOnJS(onValueChange)(val.value);
      if (onSlidingComplete) runOnJS(onSlidingComplete)(val.value);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
  }));

  const lineStyle = useAnimatedStyle(() => ({
    width: thumbX.value + THUMB_SIZE / 2,
  }));

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  return (
    <View className="w-full">
      <GestureHandlerRootView className="w-full h-10 justify-center">
        <View className="h-1 w-full relative justify-center" onLayout={onLayout}>
          <View className="h-1 bg-[#F0F0F0] rounded-full w-full absolute" />
          <Animated.View className="h-1 bg-[#2FA2B9] rounded-full absolute" style={lineStyle} />
          
          <GestureDetector gesture={gesture}>
            <Animated.View 
              className="w-5 h-5 bg-[#2FA2B9] rounded-full absolute border-2 border-white shadow-sm shadow-black/10 z-10" 
              style={[thumbStyle, { elevation: 3 }]} 
            />
          </GestureDetector>
        </View>
      </GestureHandlerRootView>

      <View className="flex-row justify-between mt-2 px-1 items-center">
         <Text className="text-xs text-gray-400">{min.toFixed(1)}</Text>
         <AnimatedTextInput 
            animatedProps={labelProps}
            editable={false}
            className="p-0 m-0 font-bold text-xs text-[#2FA2B9]"
            defaultValue={`${labelPrefix}${(value ?? min).toFixed(1)}${labelSuffix}`}
         />
         <Text className="text-xs text-gray-400">{max.toFixed(1)}</Text>
      </View>
    </View>
  );
}
