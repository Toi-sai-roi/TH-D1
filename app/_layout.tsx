import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { CartProvider, useCart } from '../context/CartContext';
import { loadCurrentUser } from '../services/StorageService';

function AppNavigator() {
  const router = useRouter();
  const { setRole, loadUserData } = useCart();
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    (async () => {
      try {
        const user = await loadCurrentUser();
        if (user) {
          setRole(user.role);
          await loadUserData(user.email, user.role);
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/splash');
        }
      } catch {
        router.replace('/(auth)/splash');
      }
    })();
  }, [router, setRole, loadUserData]);

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
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
  );
}

export default function RootLayout() {
  return (
    <CartProvider>
      <AppNavigator />
    </CartProvider>
  );
}