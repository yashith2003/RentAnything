//RentAnything/components/paymentCard.tsx

import RatingStars from '@/components/ui/ratingStars';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';

interface PaymentCardProps {
  payment: {
    id: string;
    userName: string;
    userAvatar: string;
    isVerified: boolean;
    rating: number;
    itemName: string;
    itemDescription: string;
    itemImage: string;
    amount: number;
    serviceFee: number;
    tax: number;
    totalAmount: number;
    // Optional fields for completed payments
    transactionId?: string;
    transactionDate?: string;
    paymentMethod?: string;
  };
}

export default function PaymentCard({ payment }: PaymentCardProps) {
  return (
    <View className="bg-white rounded-[28px] p-5 mb-4 border border-gray-100 shadow-sm">
      {/* User Info */}
      <View className="flex-row items-center mb-4">
        <Image
          source={{ uri: payment.userAvatar }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
          contentFit="cover"
        />
        <View className="ml-3 flex-1">
          <View className="flex-row items-center">
            <Text className="text-base font-bold text-black mr-1">
              {payment.userName}
            </Text>
            {payment.isVerified && (
              <Ionicons name="checkmark-circle" size={18} color="#2196F3" />
            )}
          </View>
        </View>
      </View>

      {/* Rating */}
      <RatingStars rating={payment.rating} style={{ marginBottom: 16 }} />

      {/* Item Image */}
      <View className="mb-4 rounded-[20px] overflow-hidden">
        <Image
          source={{ uri: payment.itemImage }}
          style={{ width: '100%', height: 200 }}
          contentFit="cover"
        />
      </View>

      {/* Item Details */}
      <Text className="text-lg font-bold text-black mb-2">
        {payment.itemName}
      </Text>
      <Text className="text-sm text-gray-500 leading-5 mb-4">
        {payment.itemDescription}
      </Text>

      {/* Transaction Details */}
      <View className="border-t border-gray-100 pt-4">
        <Text className="text-base font-bold text-black mb-3">
          Transaction detail
        </Text>
        
        {/* Transaction ID - Only for completed payments */}
        {payment.transactionId && (
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-500">Transaction ID</Text>
            <Text className="text-sm font-semibold text-black">
              #{payment.transactionId}
            </Text>
          </View>
        )}

        {/* Transaction Date - Only for completed payments */}
        {payment.transactionDate && (
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-500">Transaction Date</Text>
            <Text className="text-sm font-semibold text-black">
              {payment.transactionDate}
            </Text>
          </View>
        )}

        {/* Payment Method - Only for completed payments */}
        {payment.paymentMethod && (
          <View className="flex-row justify-between mb-3">
            <Text className="text-sm text-gray-500">Payment Method</Text>
            <View className="flex-row items-center">
              <View className="bg-orange-100 rounded px-1.5 py-0.5 mr-2">
                <Ionicons name="card" size={12} color="#FF6B35" />
              </View>
              <Text className="text-sm font-semibold text-black">
                {payment.paymentMethod}
              </Text>
            </View>
          </View>
        )}
        
        {/* Amount */}
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm text-gray-500">Amount</Text>
          <Text className="text-sm font-semibold text-black">
            Rs.{payment.amount}
          </Text>
        </View>

        {/* Service Fee */}
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm text-gray-500">Service fee</Text>
          <Text className="text-sm font-semibold text-black">
            Rs.{payment.serviceFee}
          </Text>
        </View>

        {/* Tax */}
        <View className="flex-row justify-between mb-3">
          <Text className="text-sm text-gray-500">Tax</Text>
          <Text className="text-sm font-semibold text-black">
            Rs.{payment.tax}
          </Text>
        </View>

        {/* Total Amount */}
        <View className="flex-row justify-between pt-3 border-t border-gray-100">
          <Text className="text-base font-bold text-black">Total amount</Text>
          <Text className="text-base font-bold text-black">
            Rs. {payment.totalAmount.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}
