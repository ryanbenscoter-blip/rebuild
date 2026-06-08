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
  ScrollView,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { colors } from '../theme/colors';

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sobrietyDate, setSobrietyDate] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!fullName || !email || !password) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setLoading(false);
      Alert.alert('Signup failed', error.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        sobriety_date: sobrietyDate || null,
      });

      if (profileError) {
        console.log('Profile error:', profileError.message);
      }
    }

    setLoading(false);
    Alert.alert(
      'Welcome to Rebuild!',
      'Check your email to confirm your account, then log in.',
      [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.top}>
            <Text style={styles.logo}>REBUILD</Text>
            <Text style={styles.tagline}>Let's get started.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>YOUR NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="First name"
              placeholderTextColor={colors.muted}
              value={fullName}
              onChangeText={setFullName}
            />

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
              placeholder="Min. 6 characters"
              placeholderTextColor={colors.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Text style={styles.label}>SOBRIETY DATE <Text style={styles.optional}>(optional)</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD  e.g. 2024-01-01"
              placeholderTextColor={colors.muted}
              value={sobrietyDate}
              onChangeText={setSobrietyDate}
            />
            <Text style={styles.hint}>You can always set or change this later.</Text>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading
                ? <ActivityIndicator color={colors.white} />
                : <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchRow}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={styles.switchText}>
                Already have an account? <Text style={styles.switchLink}>Log in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 24 },
  top: { alignItems: 'center', marginTop: 40, marginBottom: 32 },
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
  form: { gap: 8, paddingBottom: 40 },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 3,
    marginBottom: 4,
    marginTop: 12,
  },
  optional: {
    color: colors.muted,
    fontWeight: '400',
    letterSpacing: 0,
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
  hint: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
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
});
