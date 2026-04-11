import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from "react-native";
import { registerAccount } from "../../services/StorageService";

export default function SignUpScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSignup = username && email && password;

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await registerAccount({
        username: username.trim(),
        email: email.trim(),
        password,
        role: "user",
      });
      if (!result.ok) {
        setError(result.msg);
        return;
      }
      router.replace("/(auth)/login");
    } catch {
      setError("Đăng ký thất bại, thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.title}>Sign Up</Text>
      <Text style={s.sub}>Enter your credentials to continue</Text>

      <Text style={s.label}>Username</Text>
      <TextInput
        style={s.input} placeholder="e.g. Afsar Hossen"
        value={username} onChangeText={(t) => { setUsername(t); setError(""); }}
      />

      <Text style={s.label}>Email</Text>
      <TextInput
        style={s.input} placeholder="mshuvo97@gmail.com"
        keyboardType="email-address" autoCapitalize="none"
        value={email} onChangeText={(t) => { setEmail(t); setError(""); }}
      />

      <Text style={s.label}>Password</Text>
      <View style={s.passRow}>
        <TextInput
          style={[s.input, { flex: 1, marginBottom: 0 }]}
          placeholder="••••••••"
          secureTextEntry={!showPass}
          value={password}
          onChangeText={(t) => { setPassword(t); setError(""); }}
        />
        <TouchableOpacity onPress={() => setShowPass((p) => !p)} style={s.eyeBtn}>
          <Text style={s.eye}>{showPass ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={s.error}>{error}</Text> : null}

      <Text style={s.terms}>
        By continuing you agree to our{" "}
        <Text style={s.link}>Terms of Service</Text> and{" "}
        <Text style={s.link}>Privacy Policy</Text>
      </Text>

      <TouchableOpacity
        style={[s.btn, (!canSignup || loading) && s.btnDisabled]}
        disabled={!canSignup || loading}
        onPress={handleSignup}
      >
        <Text style={s.btnText}>{loading ? "Đang đăng ký..." : "Sign Up"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text style={s.loginLink}>
          Already have an account? <Text style={s.loginBold}>Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { backgroundColor: "#fff", paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "700", color: "#1a1a1a", marginBottom: 8 },
  sub: { fontSize: 14, color: "#888", marginBottom: 32 },
  label: { fontSize: 13, color: "#888", marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: "#eee", borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, marginBottom: 20,
  },
  passRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  eyeBtn: { position: "absolute", right: 16 },
  eye: { fontSize: 18 },
  error: { color: "#f44336", fontSize: 13, marginVertical: 8 },
  terms: { fontSize: 12, color: "#888", lineHeight: 18, marginVertical: 16 },
  link: { color: "#4CAF6F" },
  btn: {
    backgroundColor: "#4CAF6F", borderRadius: 16,
    paddingVertical: 16, alignItems: "center", marginBottom: 16,
  },
  btnDisabled: { backgroundColor: "#ccc" },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  loginLink: { textAlign: "center", color: "#888", fontSize: 14 },
  loginBold: { color: "#4CAF6F", fontWeight: "600" },
});