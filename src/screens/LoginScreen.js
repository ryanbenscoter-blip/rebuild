import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { colors } from '../theme/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Login failed', error.message);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.top}>
          <Text style={styles.logo}>REBUILD</Text>
          <Text style={styles.tagline}>Your journey starts here.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="you@email.com"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.buttonText}>LOG IN</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchRow}
            onPress={() => navigation.navigate('Signup')}
            activeOpacity={0.7}
          >
            <Text style={styles.switchText}>
              Don't have an account? <Text style={styles.switchLink}>Sign up free</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          "You survived every bad day so far.{'\n'}Your record is 100%." — Ryan
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 24, justifyContent: 'space-between' },
  top: { alignItems: 'center', marginTop: 40 },
  logo: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 10,
  },
  tagline: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 8,
    letterSpacing: 2,
  },
  form: { gap: 8 },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 3,
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    color: colors.white,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 3,
  },
  switchRow: { alignItems: 'center', marginTop: 16 },
  switchText: { color: colors.muted, fontSize: 14 },
  switchLink: { color: colors.accent, fontWeight: '700' },
  footer: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 20,
  },
});
