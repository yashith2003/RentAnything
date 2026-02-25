import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, ScrollView, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQSection[] = [
  {
    title: 'General',
    items: [
      {
        id: '1',
        question: 'How do I rent an item?',
        answer: 'To rent an item, browse our catalog, select the item you want, choose your rental dates, and proceed to checkout. You\'ll need to create an account or log in to complete the rental.',
      },
      {
        id: '2',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit/debit cards, as well as digital wallets like Apple Pay and Google Pay. Cash on delivery is also available for select items.',
      },
      {
        id: '3',
        question: 'How does the return process work?',
        answer: 'Simply return the item to the designated drop-off location or arrange for a pickup before the rental period ends. Ensure the item is in the same condition as when you received it.',
      },
    ],
  },
  {
    title: 'Listings & Earnings',
    items: [
      {
        id: '4',
        question: 'How do I list my items for rent?',
        answer: 'Go to the "Add Listing" tab, upload high-quality photos of your item, set a price (daily, weekly, or monthly), and provide a detailed description. Once approved, your listing will be live for others to rent.',
      },
      {
        id: '5',
        question: 'How and when do I get paid?',
        answer: 'Earnings are automatically credited to your linked bank account after a successful rental completion. Processing usually takes 3-5 business days depending on your bank.',
      },
      {
        id: '6',
        question: 'Is there a fee for listing items?',
        answer: 'Listing items is free! We only take a small commission from successful rentals to help maintain the platform and provide insurance coverage.',
      },
    ],
  },
  {
    title: 'Safety & Trust',
    items: [
      {
        id: '7',
        question: 'Is my equipment insured?',
        answer: 'Yes, we provide basic insurance coverage for items listed on our platform. In case of damage or theft, please report an incident immediately through the app.',
      },
      {
        id: '8',
        question: 'What is KYC and why do I need it?',
        answer: 'KYC (Know Your Customer) is a verification process that ensures the safety of our community. Both owners and renters must verify their identity using a valid government ID to participate.',
      },
      {
        id: '9',
        question: 'What should I do if an item is damaged?',
        answer: 'If an item is damaged during a rental, take photos immediately and report it via the "Incident Report" section in your profile. Our support team will mediate and resolve the issue.',
      },
    ],
  },
];

export default function FAQPage() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>('1'); // Default first item open

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <ScreenHeader title="FAQs" rightIcon="ellipsis-horizontal" />

      <ScrollView className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)}`} showsVerticalScrollIndicator={false}>
        {FAQ_DATA.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mb-6">
            <Text className="text-xl font-bold text-black mb-4">{section.title}</Text>
            
            {section.items.map((item, index) => {
               const isExpanded = expandedId === item.id;
               const isLast = index === section.items.length - 1;

               return (
                  <View key={item.id}>
                    <TouchableOpacity 
                        onPress={() => toggleExpand(item.id)}
                        activeOpacity={0.7}
                        className="py-4 flex-row justify-between items-start"
                    >
                        <Text className="text-base font-medium text-black flex-1 pr-4">{item.question}</Text>
                        <Ionicons 
                            name="chevron-down" 
                            size={20} 
                            color="#000" 
                            style={{ 
                                transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] 
                            }} 
                        />
                    </TouchableOpacity>
                    
                    {isExpanded && (
                        <Text className="text-sm text-gray-500 leading-5 pb-4">
                            {item.answer}
                        </Text>
                    )}

                    {/* Divider - show if not last item */}
                    {!isLast && <View className="h-[1px] bg-gray-100" />}
                  </View>
               );
            })}
          </View>
        ))}
         
         <View className="h-10" /> 
      </ScrollView>
    </SafeAreaView>
  );
}
