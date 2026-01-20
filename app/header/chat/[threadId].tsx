//app/chat/[threasId].tsx

import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ChatThreadScreen() {
  const { threadId } = useLocalSearchParams();

  return (
    <View>
      <Text>Chat Thread: {threadId}</Text>
    </View>
  );
}
