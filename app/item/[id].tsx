//app/item/[id].tsx

import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ItemDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Item ID: {id}</Text>
    </View>
  );
}

