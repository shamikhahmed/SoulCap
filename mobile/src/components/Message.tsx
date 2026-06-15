import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  mode?: string;
  strategy?: string;
  safetyTier?: number;
  messageId?: string;
  onFeedback?: (messageId: string, feedback: 'positive' | 'neutral' | 'negative') => void;
}

export function Message({ role, content, mode, strategy, safetyTier, messageId, onFeedback }: MessageProps) {
  const isUser = role === 'user';
  const isCrisis = safetyTier === 3 || mode === 'CRISIS';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      {!isUser && isCrisis && (
        <View style={styles.crisisBadge}>
          <Text style={styles.crisisBadgeText}>Safety Support Mode</Text>
        </View>
      )}

      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble, isCrisis && styles.crisisBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.aiText]}>{content}</Text>
      </View>

      {!isUser && messageId && onFeedback && (
        <View style={styles.feedbackRow}>
          <Text style={styles.feedbackLabel}>Was this helpful?</Text>
          <TouchableOpacity onPress={() => onFeedback(messageId, 'positive')} style={styles.feedbackBtn}>
            <Text style={styles.feedbackBtnText}>👍</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onFeedback(messageId, 'negative')} style={styles.feedbackBtn}>
            <Text style={styles.feedbackBtnText}>👎</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isUser && mode && strategy && (
        <Text style={styles.metaText}>{mode.toLowerCase()} · {strategy}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 6, maxWidth: '88%' },
  userContainer: { alignSelf: 'flex-end' },
  aiContainer: { alignSelf: 'flex-start' },
  bubble: { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  userBubble: { backgroundColor: '#6366f1' },
  aiBubble: { backgroundColor: '#1e1e2c', borderWidth: 1, borderColor: '#2a2a3e' },
  crisisBubble: { borderColor: '#ef4444', borderWidth: 1.5 },
  text: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#ffffff' },
  aiText: { color: '#e0e0ee' },
  crisisBadge: {
    backgroundColor: '#ef444422',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  crisisBadgeText: { color: '#ef4444', fontSize: 10, fontWeight: '600' },
  feedbackRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 },
  feedbackLabel: { fontSize: 11, color: '#666' },
  feedbackBtn: { padding: 4 },
  feedbackBtnText: { fontSize: 14 },
  metaText: { fontSize: 10, color: '#444', marginTop: 2, marginLeft: 4 },
});
