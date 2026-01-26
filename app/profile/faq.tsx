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
    title: 'Payments',
    items: [
      {
        id: '4',
        question: 'When will I be charged?',
        answer: 'You will be charged at the time of booking. This ensures that the item is reserved for your rental period. If there are any issues with the rental, please contact our support team.',
      },
      {
        id: '5',
        question: 'Can I cancel my rental?',
        answer: 'Yes, you can cancel your rental up to 24 hours before the rental start time for a full refund. Cancellations made within 24 hours may be subject to a cancellation fee.',
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
