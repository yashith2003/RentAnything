//app/(tabs)/rentals.tsx


import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function RentalsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Rentals</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
