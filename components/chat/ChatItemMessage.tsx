import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
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
  const { data: item, isLoading, error } = useGetItemQuery(itemId);

  useEffect(() => {
    console.log(`[ChatItemMessage DEBUG] itemId: ${itemId}, isLoading: ${isLoading}, hasItem: ${!!item}`);
    if (error) console.error(`[ChatItemMessage DEBUG] Error fetching item ${itemId}:`, error);
    if (item) {
        console.log(`[ChatItemMessage DEBUG] Data:`, JSON.stringify(item, null, 2));
    }
  }, [itemId, item, isLoading, error]);

  if (isLoading) {
    return (
      <View style={[styles.container, isSender ? styles.sender : styles.receiver, styles.loading]}>
        <ActivityIndicator size="small" color="#2FA2B9" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!item) {
    return (
        <View style={[styles.container, isSender ? styles.sender : styles.receiver, styles.loading]}>
            <Text style={styles.loadingText}>Item Not Found (${itemId})</Text>
        </View>
    );
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      style={[styles.container, isSender ? styles.sender : styles.receiver]}
      onPress={() => router.push(`/item/${itemId}`)}
    >
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item?.imageUrl || 'https://via.placeholder.com/150' }}
            style={styles.image}
            contentFit="cover"
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{item?.title || 'No Title'}</Text>
          <Text style={styles.owner} numberOfLines={1}>By: {item?.owner?.individualUser?.fullName || item?.owner?.company?.companyName || 'Unknown'}</Text>
          <Text style={styles.price}>Rs: {item?.price || item?.pricings?.[0]?.price || '0'}/{item?.pricings?.[0]?.rateType || 'day'}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={14} color="#2FA2B9" />
            <Text style={styles.location} numberOfLines={1}>
               {item?.address?.address?.split(',')[0] || 'Malabe'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 90,
    borderRadius: 16,
    marginVertical: 4,
    backgroundColor: '#E6F7FA',
    borderWidth: 1.5,
    borderColor: '#2FA2B9',
    justifyContent: 'center',
    elevation: 2,
    zIndex: 100,
  },
  sender: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  receiver: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  loading: {
    width: 250,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6F7FA',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#36bcd7ff',
  },
  loadingText: {
    color: '#2FA2B9',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  content: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1, // Keep inner containers subtle
    borderColor: '#BEE7EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  info: {
    paddingLeft: 12,
    flex: 1,
    height: 70,
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  owner: {
    fontSize: 11,
    color: '#444',
  },
  price: {
    fontSize: 13,
    color: '#333',
    fontWeight: '700',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 10,
    color: '#2FA2B9',
    fontWeight: '600',
    marginLeft: 3,
  },
});
