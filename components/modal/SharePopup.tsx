import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, Share, Platform } from 'react-native';
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

const { width } = Dimensions.get('window');

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
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Share As Options</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            {!isGuest && (
              <TouchableOpacity style={styles.option} onPress={handleInternalShare}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.primary }]}>
                  <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
                </View>
                <Text style={styles.optionText}>Rent Anything</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.option} onPress={handleSystemShare}>
              <View style={[styles.iconContainer, { backgroundColor: '#25D366' }]}>
                <FontAwesome5 name="whatsapp" size={24} color="#fff" />
              </View>
              <Text style={styles.optionText}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={handleSystemShare}>
              <View style={[styles.iconContainer, { backgroundColor: '#0084FF' }]}>
                <MaterialCommunityIcons name="facebook-messenger" size={24} color="#fff" />
              </View>
              <Text style={styles.optionText}>Messenger</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={handleCopyLink}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFD700' }]}>
                <Ionicons name="link" size={24} color="#000" />
              </View>
              <Text style={styles.optionText}>Copy Link</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={handleSystemShare}>
              <View style={[styles.iconContainer, { backgroundColor: '#666' }]}>
                <Ionicons name="share-social" size={24} color="#fff" />
              </View>
              <Text style={styles.optionText}>More...</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  option: {
    width: (width - 48) / 4 - 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});
