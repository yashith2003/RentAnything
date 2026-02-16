import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'expo-image';
import React from 'react';
import { DimensionValue, Text, TouchableOpacity, View } from 'react-native';

interface DocumentUploadBoxProps {
  label?: string;
  onFileSelect?: (uri: string, fileName?: string, mimeType?: string) => void;
  fileUri?: string;
  fileName?: string;
  mimeType?: string;
  allowedTypes?: string[];
  containerStyle?: string;
  height?: DimensionValue;
}

export const DocumentUploadBox: React.FC<DocumentUploadBoxProps> = ({
  label = 'Click here to upload Document',
  onFileSelect,
  fileUri,
  fileName,
  mimeType,
  allowedTypes = ['image/*', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], 
  containerStyle = '',
  height = 120,
}) => {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        onFileSelect?.(file.uri, file.name, file.mimeType);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const isImage = (uri: string, mime?: string) => {
    if (mime && mime.startsWith('image/')) return true;
    if (uri) {
        const lowerUri = uri.toLowerCase();
        return lowerUri.endsWith('.jpg') || lowerUri.endsWith('.jpeg') || lowerUri.endsWith('.png') || lowerUri.endsWith('.gif');
    }
    return false;
  };

  const renderContent = () => {
    if (!fileUri) {
      return (
        <>
          <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center mb-2">
            <Ionicons name="cloud-upload-outline" size={24} color="#9CA3AF" />
          </View>
          <Text className="text-gray-500 font-medium mb-1">{label}</Text>
          <Text className="text-gray-400 text-[10px] text-center px-4">Allowed: Images, PDF, DOCX</Text>
        </>
      );
    }

    if (isImage(fileUri, mimeType)) {
      return (
        <Image 
          source={{ uri: fileUri }} 
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
      );
    }

    // Default to document icon for non-images (PDF, DOCX)
    let iconName: any = "document-text-outline";
    if (mimeType === 'application/pdf' || (fileName && fileName.toLowerCase().endsWith('.pdf'))) {
        iconName = "document-text"; // Or a specific PDF icon if available
    }

    return (
      <View className="items-center justify-center p-4">
        <View className="w-12 h-12 bg-red-100 rounded-lg items-center justify-center mb-2">
            <Ionicons name={iconName} size={32} color="#EF4444" />
        </View>
        <Text className="text-gray-700 font-medium text-center" numberOfLines={2}>{fileName || 'Document Uploaded'}</Text>
        <Text className="text-gray-400 text-xs mt-1">Tap to change</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity 
      onPress={pickDocument}
      activeOpacity={0.7}
      style={{ height: height }}
      className={`w-full bg-[#F9FAFB] rounded-2xl border border-gray-200 border-dashed items-center justify-center overflow-hidden ${containerStyle}`}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};
