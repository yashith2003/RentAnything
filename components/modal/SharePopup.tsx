import React from 'react';
import { Modal, View, Text, TouchableOpacity, Share, Platform } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/userContext';

interface SharePopupProps {
  visible: boolean;
  onClose: () => void;
  itemId: number;
  itemTitle: string;
}

export const SharePopup: React.FC<SharePopupProps> = ({ visible, onClose, itemId, itemTitle }) => {
  const router = useRouter();
  const { role } = useUser();
  const isGuest = !role || role === 'GUEST' || role === 'guest';
  const universalLink = `https://rentanything.com/item/${itemId}`;

  const handleSystemShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${itemTitle} on Rent Anything: ${universalLink}`,
        url: universalLink,
      });
      onClose();
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await Share.share({
        message: universalLink,
      });
      onClose();
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleInternalShare = () => {
    onClose();
    router.push({
      pathname: '/share/inbox',
      params: { itemId, itemTitle }
    } as any);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        className="flex-1 bg-black/50 justify-end"
        activeOpacity={1} 
        onPress={onClose}
      >
        <View 
          className="bg-white rounded-t-[24px] p-6"
          style={{ paddingBottom: Platform.OS === 'ios' ? 40 : 24 }}
        >
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-black">Share As Options</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {!isGuest && (
              <TouchableOpacity className="w-[22%] items-center mb-6" onPress={handleInternalShare}>
                <View className="w-14 h-14 rounded-full justify-center items-center mb-2 shadow-sm shadow-black/10" style={{ backgroundColor: Colors.primary, elevation: 2 }}>
                  <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
                </View>
                <Text className="text-[12px] text-[#333] text-center">Rent Anything</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity className="w-[22%] items-center mb-6" onPress={handleSystemShare}>
              <View className="w-14 h-14 rounded-full justify-center items-center mb-2 shadow-sm shadow-black/10" style={{ backgroundColor: '#25D366', elevation: 2 }}>
                <FontAwesome5 name="whatsapp" size={24} color="#fff" />
              </View>
              <Text className="text-[12px] text-[#333] text-center">WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-[22%] items-center mb-6" onPress={handleSystemShare}>
              <View className="w-14 h-14 rounded-full justify-center items-center mb-2 shadow-sm shadow-black/10" style={{ backgroundColor: '#0084FF', elevation: 2 }}>
                <MaterialCommunityIcons name="facebook-messenger" size={24} color="#fff" />
              </View>
              <Text className="text-[12px] text-[#333] text-center">Messenger</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-[22%] items-center mb-6" onPress={handleCopyLink}>
              <View className="w-14 h-14 rounded-full justify-center items-center mb-2 shadow-sm shadow-black/10" style={{ backgroundColor: '#FFD700', elevation: 2 }}>
                <Ionicons name="link" size={24} color="#000" />
              </View>
              <Text className="text-[12px] text-[#333] text-center">Copy Link</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-[22%] items-center mb-6" onPress={handleSystemShare}>
              <View className="w-14 h-14 rounded-full justify-center items-center mb-2 shadow-sm shadow-black/10" style={{ backgroundColor: '#666', elevation: 2 }}>
                <Ionicons name="share-social" size={24} color="#fff" />
              </View>
              <Text className="text-[12px] text-[#333] text-center">More...</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
