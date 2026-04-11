import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { loadAccounts, authKeys } from '../../services/StorageService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = email && newPass && confirmPass;

  const handleReset = async () => {
    setError('');
    if (newPass !== confirmPass) {
        setError('Mật khẩu xác nhận không khớp!');
        return;
    }
    if (newPass.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }

    setLoading(true);
    try {
        const all = await loadAccounts();
        const found = all.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
        if (!found) {
        setError('Email không tồn tại trong hệ thống!');
        return;
        }

        const raw = await AsyncStorage.getItem(authKeys.accounts);
        const registered = raw ? JSON.parse(raw) : [];
        const idx = registered.findIndex(
        (a: any) => a.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (idx < 0) {
        setError('Tài khoản mặc định không thể đổi mật khẩu!');
        return;
        }

        registered[idx].password = newPass;
        await AsyncStorage.setItem(authKeys.accounts, JSON.stringify(registered));
        setSuccess(true);
    } catch {
        setError('Có lỗi xảy ra, thử lại!');
    } finally {
        setLoading(false);
    }
    };

  if (success) {
    return (
      <View style={s.container}>
        <Text style={s.icon}>✅</Text>
        <Text style={s.title}>Đổi mật khẩu thành công!</Text>
        <Text style={s.sub}>Bạn có thể đăng nhập với mật khẩu mới.</Text>
        <TouchableOpacity style={s.btn} onPress={() => router.replace('/(auth)/login')}>
          <Text style={s.btnText}>Về đăng nhập</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <TouchableOpacity onPress={() => router.back()} style={s.back}>
        <Text style={s.backText}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={s.title}>Forgot Password</Text>
      <Text style={s.sub}>Nhập email và mật khẩu mới</Text>

      <TextInput
        style={s.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(t) => { setEmail(t); setError(''); }}
      />
      <TextInput
        style={s.input}
        placeholder="Mật khẩu mới"
        secureTextEntry
        value={newPass}
        onChangeText={(t) => { setNewPass(t); setError(''); }}
      />
      <TextInput
        style={s.input}
        placeholder="Xác nhận mật khẩu mới"
        secureTextEntry
        value={confirmPass}
        onChangeText={(t) => { setConfirmPass(t); setError(''); }}
      />

      {error ? <Text style={s.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[s.btn, (!canSubmit || loading) && s.btnDisabled]}
        disabled={!canSubmit || loading}
        onPress={handleReset}
      >
        <Text style={s.btnText}>{loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 80 },
  back: { marginBottom: 24 },
  backText: { color: '#4CAF6F', fontSize: 14 },
  icon: { fontSize: 60, textAlign: 'center', marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  sub: { fontSize: 14, color: '#888', marginBottom: 32 },
  input: {
    borderWidth: 1, borderColor: '#eee', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, marginBottom: 16,
  },
  error: { color: '#f44336', fontSize: 13, marginBottom: 8 },
  btn: {
    backgroundColor: '#4CAF6F', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center', marginBottom: 16,
  },
  btnDisabled: { backgroundColor: '#ccc' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});