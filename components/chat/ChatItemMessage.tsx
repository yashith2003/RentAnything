import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { formatPrice } from '@/utils/formatPrice';
import { useGetItemQuery } from '@/api/item.service';

interface ChatItemMessageProps {
  itemId: number;
  isSender: boolean;
}

export const ChatItemMessage: React.FC<ChatItemMessageProps> = ({ itemId, isSender }) => {
  const router = useRouter();
  const { data: item, isLoading } = useGetItemQuery(itemId);

  if (isLoading) {
    return (
      <View style={[styles.container, isSender ? styles.sender : styles.receiver, styles.loading]}>
        <Text style={styles.loadingText}>Loading item...</Text>
      </View>
    );
  }

  if (!item) return null;

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      style={[styles.container, isSender ? styles.sender : styles.receiver]}
      onPress={() => router.push(`/item/${itemId}`)}
    >
      <View style={styles.content}>
        <Image
          source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.owner} numberOfLines={1}>Owner: {item.owner?.individualUser?.fullName || item.owner?.company?.companyName || 'Malith Perera'}</Text>
          <Text style={styles.price}>{formatPrice(Number(item.price), item.pricings?.[0]?.rateType || 'day')}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={12} color="#2FA2B9" />
            <Text style={styles.location}>
               5.6 km - {item.address?.address?.split(',')[0] || 'Nugegoda'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '85%',
    borderRadius: 12,
    padding: 2,
    marginVertical: 4,
    backgroundColor: '#E0F4F7', // Light blue tint as in design
    borderWidth: 1,
    borderColor: '#2FA2B9',
  },
  sender: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 2,
  },
  receiver: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2,
  },
  loading: {
    padding: 12,
    minWidth: 150,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 12,
  },
  content: {
    flexDirection: 'row',
    padding: 8,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  info: {
    paddingLeft: 12,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  owner: {
    fontSize: 11,
    color: '#444',
    marginTop: 2,
  },
  price: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginTop: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    fontSize: 10,
    color: '#2FA2B9',
    marginLeft: 4,
  },
});
