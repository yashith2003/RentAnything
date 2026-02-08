import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ReviewPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => void;
  title?: string;
}

export default function ReviewPopup({ 
  isVisible, 
  onClose, 
  onSubmit, 
  title = "How would you rate the Renter?" 
}: ReviewPopupProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleRating = (index: number) => {
    setRating(index + 1);
  };

  const resetAndClose = () => {
    setRating(0);
    setFeedback('');
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(rating, feedback);
    resetAndClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={resetAndClose}
    >
      <Pressable 
        className="flex-1 bg-black/50 justify-center items-center px-6"
        onPress={resetAndClose}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="w-full"
        >
          <Pressable 
            className="bg-white rounded-[32px] p-8 items-center w-full"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Gauge and Stars Illustration Placeholder */}
            {/* Rating Meter Image */}
            <View className="items-center mb-6">
                 <Image 
                    source={require('@/assets/images/ratingMeter.png')} 
                    style={{ width: 120, height: 80 }} 
                    contentFit="contain" 
                 />
            </View>

            <Text className="text-xl font-bold text-center text-gray-900 mb-2">{title}</Text>
            <Text className="text-sm text-gray-500 text-center mb-6">Share Your Experience with Us.</Text>

            {/* Star Rating Selector */}
            <View className="flex-row gap-x-2 mb-8">
              {[0, 1, 2, 3, 4].map((index) => (
                <TouchableOpacity key={index} onPress={() => handleRating(index)}>
                  <Ionicons 
                    name={index < rating ? "star" : "star-outline"} 
                    size={40} 
                    color={index < rating ? "#FFD700" : "#D1D5DB"} 
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View className="w-full mb-6">
                <Text className="text-sm font-bold text-gray-700 mb-2">Can you tell us more?</Text>
                <TextInput
                    placeholder="Add feedback"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={4}
                    value={feedback}
                    onChangeText={setFeedback}
                    className="w-full h-32 bg-white border border-gray-100 rounded-2xl p-4 text-gray-800 text-sm"
                    textAlignVertical="top"
                />
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-x-4 w-full">
                <TouchableOpacity 
                    onPress={resetAndClose}
                    className="flex-1 h-12 rounded-full border border-cyan-500 items-center justify-center"
                >
                    <Text className="text-cyan-500 font-bold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={handleSubmit}
                    className="flex-1 h-12 rounded-full bg-cyan-500 items-center justify-center"
                >
                    <Text className="text-white font-bold">Submit</Text>
                </TouchableOpacity>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
