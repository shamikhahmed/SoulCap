import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { useAuthStore } from '../store/auth.store';

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const { login, register, isLoading } = useAuthStore();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Please fill in all fields');
      return;
    }
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, displayName || undefined);
      }
    } catch {
      Alert.alert('Error', mode === 'login' ? 'Login failed. Check your credentials.' : 'Registration failed. Email may already be in use.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inner}>
        <Text style={styles.wordmark}>SoulCap</Text>
        <Text style={styles.tagline}>Emotional wellness companion (not therapy)</Text>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, mode === 'login' && styles.tabActive]}
            onPress={() => setMode('login')}
          >
            <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, mode === 'register' && styles.tabActive]}
            onPress={() => setMode('register')}
          >
            <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {mode === 'register' && (
          <TextInput
            style={styles.input}
            placeholder="Your name (optional)"
            placeholderTextColor="#555"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#555"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{mode === 'login' ? 'Sign In' : 'Create Account'}</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          This is a personal growth companion. It is not a therapist and does not provide medical advice.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d12' },
  inner: { flex: 1, padding: 28, justifyContent: 'center' },
  wordmark: { fontSize: 32, fontWeight: '700', color: '#e0e0ee', letterSpacing: -0.5, marginBottom: 6 },
  tagline: { fontSize: 14, color: '#666', marginBottom: 40 },
  tabRow: { flexDirection: 'row', marginBottom: 24, backgroundColor: '#16161e', borderRadius: 10, padding: 3 },
  tab: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: '#6366f1' },
  tabText: { fontSize: 14, color: '#666', fontWeight: '500' },
  tabTextActive: { color: '#fff' },
  input: {
    backgroundColor: '#16161e', borderRadius: 10, padding: 14,
    color: '#e0e0ee', fontSize: 15, marginBottom: 12,
    borderWidth: 1, borderColor: '#2a2a3e',
  },
  button: {
    backgroundColor: '#6366f1', borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  disclaimer: { fontSize: 11, color: '#444', textAlign: 'center', marginTop: 32, lineHeight: 16 },
});
