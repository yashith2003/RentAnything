import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent, TextInput } from 'react-native';
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
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.sliderTrack} onLayout={onLayout}>
          <View style={styles.inactiveLine} />
          <Animated.View style={[styles.activeLine, lineStyle]} />
          
          <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.thumb, thumbStyle]} />
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 4,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  inactiveLine: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    width: '100%',
    position: 'absolute',
  },
  activeLine: {
    height: 4,
    backgroundColor: '#2FA2B9',
    borderRadius: 2,
    position: 'absolute',
  },
  thumb: {
    height: THUMB_SIZE,
    width: THUMB_SIZE,
    backgroundColor: '#2FA2B9',
    borderRadius: THUMB_SIZE / 2,
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
});
