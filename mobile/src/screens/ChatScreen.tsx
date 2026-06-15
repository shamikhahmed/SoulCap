import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, FlatList, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Message } from '../components/Message';
import { conversationApi } from '../api/client';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: string;
  strategy?: string;
  safetyTier?: number;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const { data } = await conversationApi.sendMessage(text, sessionId);
      if (!sessionId) setSessionId(data.sessionId);

      const aiMsg: ChatMessage = {
        id: data.messageId,
        role: 'assistant',
        content: data.content,
        mode: data.mode,
        strategy: data.strategy,
        safetyTier: data.safetyTier,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `error-${Date.now()}`, role: 'assistant', content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleFeedback = useCallback(async (messageId: string, feedback: 'positive' | 'neutral' | 'negative') => {
    await conversationApi.sendFeedback(messageId, feedback).catch(() => null);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Living Mind</Text>
          {sessionId && <Text style={styles.headerSub}>session active</Text>}
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Message
              role={item.role}
              content={item.content}
              mode={item.mode}
              strategy={item.strategy}
              safetyTier={item.safetyTier}
              messageId={item.role === 'assistant' ? item.id : undefined}
              onFeedback={handleFeedback}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>I'm here.</Text>
              <Text style={styles.emptySubtitle}>What's on your mind?</Text>
            </View>
          }
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="What's on your mind..."
            placeholderTextColor="#555"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={4000}
            returnKeyType="default"
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || isSending) && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!input.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendBtnText}>↑</Text>
            )}
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d12' },
  container: { flex: 1 },
  header: {
    paddingHorizontal: 18, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#1e1e2c',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#e0e0ee' },
  headerSub: { fontSize: 11, color: '#6366f1' },
  list: { padding: 16, paddingBottom: 8 },
  emptyState: { flex: 1, alignItems: 'center', paddingTop: 120 },
  emptyTitle: { fontSize: 24, fontWeight: '300', color: '#444', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#333' },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', padding: 12,
    borderTopWidth: 1, borderTopColor: '#1e1e2c', gap: 10,
  },
  input: {
    flex: 1, backgroundColor: '#16161e', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10, color: '#e0e0ee',
    fontSize: 15, maxHeight: 120, borderWidth: 1, borderColor: '#2a2a3e',
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#2a2a3e' },
  sendBtnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
