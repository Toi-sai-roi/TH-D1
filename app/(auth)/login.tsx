import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../context/CartContext";
import { loginAccount } from "../../services/StorageService";

export default function LoginScreen() {
  const router = useRouter();
  const { setRole, loadUserData } = useCart();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canLogin = email && password;

  const handleLogin = async () => {
  setLoading(true);
  setError("");
    try {
      const user = await loginAccount(email.trim(), password);
      if (!user) {
        setError("Email hoặc mật khẩu không đúng!");
        return;
      }
      setRole(user.role);
      await loadUserData(user.email, user.role); // ← thêm user.role
      router.replace("/(tabs)");
    } catch {
      setError("Đăng nhập thất bại, thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Login</Text>
      <Text style={s.sub}>Enter your email and password</Text>

      <TextInput
        style={s.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(t) => { setEmail(t); setError(""); }}
      />

      <View style={s.passRow}>
        <TextInput
          style={[s.input, { flex: 1 }]}
          placeholder="Password"
          secureTextEntry={!showPass}
          value={password}
          onChangeText={(t) => { setPassword(t); setError(""); }}
        />
        <TouchableOpacity onPress={() => setShowPass((p) => !p)} style={s.eyeBtn}>
          <Text style={s.eye}>{showPass ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={s.error}>{error}</Text> : null}

      <TouchableOpacity style={s.forgot}>
        <Text style={s.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.btn, (!canLogin || loading) && s.btnDisabled]}
        disabled={!canLogin || loading}
        onPress={handleLogin}
      >
        <Text style={s.btnText}>{loading ? "Đang đăng nhập..." : "Log In"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
        <Text style={s.signupLink}>
          Don`t have an account? <Text style={s.signupBold}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 24, paddingTop: 80 },
  title: { fontSize: 26, fontWeight: "700", color: "#1a1a1a", marginBottom: 8 },
  sub: { fontSize: 14, color: "#888", marginBottom: 32 },
  input: {
    borderWidth: 1, borderColor: "#eee", borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, marginBottom: 16,
  },
  passRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  eyeBtn: { position: "absolute", right: 16, top: 14 },
  eye: { fontSize: 18 },
  error: { color: "#f44336", fontSize: 13, marginBottom: 8 },
  forgot: { alignSelf: "flex-end", marginBottom: 32 },
  forgotText: { color: "#4CAF6F", fontSize: 13 },
  btn: {
    backgroundColor: "#4CAF6F", borderRadius: 16,
    paddingVertical: 16, alignItems: "center", marginBottom: 16,
  },
  btnDisabled: { backgroundColor: "#ccc" },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  signupLink: { textAlign: "center", color: "#888", fontSize: 14 },
  signupBold: { color: "#4CAF6F", fontWeight: "600" },
});