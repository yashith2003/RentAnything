import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface ImageSliderProps {
  images: string[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const scrollToImage = (index: number) => {
    setActiveImageIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  return (
    <View>
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveImageIndex(index);
        }}
      >
        {images.map((img, index) => (
          <Image 
            key={index}
            source={{ uri: img }}
            style={{ width: width, height: 250 }}
            contentFit="contain"
          />
        ))}
      </ScrollView>
      
      {/* Pagination Dots */}
      <View className="flex-row justify-center gap-x-2 mt-4">
        {images.map((_, index) => (
          <View 
            key={index}
            className={`w-2 h-2 rounded-full ${activeImageIndex === index ? 'bg-gray-800' : 'bg-gray-300'}`}
          />
        ))}
      </View>

      {/* Thumbnails */}
      <View className="flex-row justify-center gap-x-4 mt-6 px-6">
        {images.map((img, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => scrollToImage(index)}
            className={`rounded-xl border-2 ${activeImageIndex === index ? 'border-[#2FA2B9]' : 'border-transparent'}`}
          >
            <Image 
              source={{ uri: img }}
              style={{ width: 60, height: 45, borderRadius: 10 }}
              contentFit="cover"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
