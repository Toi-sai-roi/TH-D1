import { Stack } from 'expo-router';
import { CartProvider } from '../context/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[id]" />
        <Stack.Screen name="category/[name]" />
        <Stack.Screen name="search" />
        <Stack.Screen name="filters" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="order-success" />
        <Stack.Screen name="order-failed" />
      </Stack>
    </CartProvider>
  );
}