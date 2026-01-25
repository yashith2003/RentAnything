// app/profile/payments/completedPayments.tsx

import PaymentCard from '@/components/paymentCard';
import React from 'react';
import { ScrollView, View } from 'react-native';

const COMPLETED_PAYMENTS = [
  {
    id: '1',
    userName: 'Malith Perera',
    userAvatar: 'https://i.pravatar.cc/150?u=malith',
    isVerified: true,
    rating: 5,
    itemName: 'Tesla Model S',
    itemDescription: 'A car with high specs that are rented. A car with high specs that are rented at an affordable price. Used (like new)',
    itemImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80',
    amount: 1400,
    serviceFee: 100,
    tax: 0,
    totalAmount: 1500.00,
    transactionId: 'T000123B0J1',
    transactionDate: '23 Jan 2026, 10:30 AM',
    paymentMethod: '**** 1234',
  },
  {
    id: '2',
    userName: 'Malith Perera',
    userAvatar: 'https://i.pravatar.cc/150?u=malith',
    isVerified: true,
    rating: 5,
    itemName: 'Tesla Model S',
    itemDescription: 'A car with high specs that are rented. A car with high specs that are rented at an affordable price. Used (like new)',
    itemImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80',
    amount: 1400,
    serviceFee: 100,
    tax: 0,
    totalAmount: 1500.00,
    transactionId: 'T000123B0J2',
    transactionDate: '23 Jan 2026, 09:15 AM',
    paymentMethod: '**** 5678',
  },
];

export default function CompletedPayments() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {COMPLETED_PAYMENTS.map((payment) => (
        <PaymentCard key={payment.id} payment={payment} />
      ))}
      <View className="h-20" />
    </ScrollView>
  );
}
