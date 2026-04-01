import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';

type Notif = {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const FAKE_NOTIFS: Notif[] = [
  { id: '1', icon: '🛵', title: 'Order on the way!', body: 'Your order #a1b2c is out for delivery.', time: '2 min ago', read: false },
  { id: '2', icon: '✅', title: 'Order delivered', body: 'Order #9f3e1 has been delivered. Enjoy!', time: '1 hr ago', read: false },
  { id: '3', icon: '🎉', title: 'New promo available', body: 'Get 20% off on all fruits this weekend!', time: '3 hr ago', read: false },
  { id: '4', icon: '💳', title: 'Payment confirmed', body: 'Payment of $24.50 was successful.', time: 'Yesterday', read: true },
  { id: '5', icon: '🔔', title: 'Flash sale starts now', body: 'Beverages up to 30% off — today only!', time: 'Yesterday', read: true },
  { id: '6', icon: '📦', title: 'Order processing', body: 'Your order #7c4d2 is being prepared.', time: '2 days ago', read: true },
  { id: '7', icon: '❤️', title: 'Item back in stock', body: 'Natural Red Apple is available again!', time: '3 days ago', read: true },
];

export default function NotificationsScreen() {
  const [notifs, setNotifs] = useState(FAKE_NOTIFS);

  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Notifications</Text>
        {unread > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={s.markAll}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {unread > 0 && (
        <View style={s.badge}>
          <Text style={s.badgeText}>{unread} unread</Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {notifs.map(n => (
          <TouchableOpacity
            key={n.id}
            style={[s.item, !n.read && s.itemUnread]}
            onPress={() => markRead(n.id)}
            activeOpacity={0.7}
          >
            <Text style={s.notifIcon}>{n.icon}</Text>
            <View style={s.content}>
              <View style={s.row}>
                <Text style={[s.notifTitle, !n.read && s.boldTitle]}>{n.title}</Text>
                {!n.read && <View style={s.dot} />}
              </View>
              <Text style={s.body}>{n.body}</Text>
              <Text style={s.time}>{n.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 52 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  markAll: { fontSize: 13, color: '#4CAF6F', fontWeight: '600' },
  badge: { alignSelf: 'flex-start', backgroundColor: '#e8f5e9', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 16 },
  badgeText: { fontSize: 12, color: '#4CAF6F', fontWeight: '600' },
  item: { flexDirection: 'row', paddingVertical: 14, borderBottomWidth: 1, borderColor: '#f5f5f5', alignItems: 'flex-start' },
  itemUnread: { backgroundColor: '#f9fffe' },
  notifIcon: { fontSize: 32, marginRight: 12, marginTop: 2 },
  content: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  notifTitle: { fontSize: 14, color: '#1a1a1a' },
  boldTitle: { fontWeight: '700' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF6F' },
  body: { fontSize: 13, color: '#777', lineHeight: 18, marginBottom: 4 },
  time: { fontSize: 11, color: '#bbb' },
});