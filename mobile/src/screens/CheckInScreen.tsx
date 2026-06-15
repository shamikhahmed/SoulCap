import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { checkInApi } from '../api/client';

const EMOTION_OPTIONS = [
  'anxious', 'calm', 'sad', 'content', 'frustrated', 'hopeful',
  'exhausted', 'energized', 'lonely', 'connected', 'numb', 'overwhelmed',
  'grateful', 'angry', 'confused', 'proud',
];

function ValenceSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const steps = [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1];
  const labels = ['😞', '😟', '😕', '😐', '😐', '🙂', '😊', '😄', '😁'];
  const idx = steps.indexOf(value);

  return (
    <View style={slider.container}>
      <View style={slider.track}>
        {steps.map((step, i) => (
          <TouchableOpacity
            key={step}
            style={[slider.node, value === step && slider.nodeActive]}
            onPress={() => onChange(step)}
          >
            <Text style={slider.emoji}>{labels[i]}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={slider.labels}>
        <Text style={slider.label}>Very low</Text>
        <Text style={slider.label}>Neutral</Text>
        <Text style={slider.label}>Very high</Text>
      </View>
    </View>
  );
}

export default function CheckInScreen() {
  const [valence, setValence] = useState(0);
  const [arousal, setArousal] = useState(0.5);
  const [groundedness, setGroundedness] = useState(0.7);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [freeText, setFreeText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ aiOpener: string } | null>(null);

  const toggleEmotion = (e: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e],
    );
  };

  const submit = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await checkInApi.submit({
        valence,
        arousal,
        groundedness,
        emotions: selectedEmotions,
        freeText: freeText || undefined,
      });
      setResult(data);
    } catch {
      Alert.alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Check-in recorded.</Text>
          <View style={styles.aiOpenerBox}>
            <Text style={styles.aiOpenerLabel}>From your companion</Text>
            <Text style={styles.aiOpenerText}>{result.aiOpener}</Text>
          </View>
          <TouchableOpacity style={styles.resetBtn} onPress={() => setResult(null)}>
            <Text style={styles.resetBtnText}>New Check-In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Daily Check-In</Text>
        <Text style={styles.subtitle}>How are you, honestly?</Text>

        <Text style={styles.sectionLabel}>Emotional state</Text>
        <ValenceSlider value={valence} onChange={setValence} />

        <Text style={styles.sectionLabel}>Energy right now</Text>
        <View style={styles.arousalRow}>
          {[
            { label: 'Flat / drained', value: 0.1 },
            { label: 'Calm', value: 0.4 },
            { label: 'Alert', value: 0.6 },
            { label: 'Activated', value: 0.9 },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, Math.abs(arousal - opt.value) < 0.2 && styles.chipActive]}
              onPress={() => setArousal(opt.value)}
            >
              <Text style={[styles.chipText, Math.abs(arousal - opt.value) < 0.2 && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>What are you feeling? (select all that apply)</Text>
        <View style={styles.emotionGrid}>
          {EMOTION_OPTIONS.map((e) => (
            <TouchableOpacity
              key={e}
              style={[styles.emotionChip, selectedEmotions.includes(e) && styles.emotionChipActive]}
              onPress={() => toggleEmotion(e)}
            >
              <Text style={[styles.emotionChipText, selectedEmotions.includes(e) && styles.emotionChipTextActive]}>
                {e}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Anything you want to add? (optional)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="What's on your mind..."
          placeholderTextColor="#444"
          value={freeText}
          onChangeText={setFreeText}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity style={styles.submitBtn} onPress={submit} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Check In</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const slider = StyleSheet.create({
  container: { marginBottom: 8 },
  track: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  node: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#16161e', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#2a2a3e',
  },
  nodeActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  emoji: { fontSize: 18 },
  labels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  label: { fontSize: 10, color: '#444' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d12' },
  scroll: { padding: 20, paddingBottom: 48 },
  title: { fontSize: 24, fontWeight: '700', color: '#e0e0ee', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#555', marginBottom: 28 },
  sectionLabel: { fontSize: 13, fontWeight: '500', color: '#888', marginBottom: 12, marginTop: 8 },
  arousalRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#16161e', borderWidth: 1, borderColor: '#2a2a3e',
  },
  chipActive: { backgroundColor: '#6366f122', borderColor: '#6366f1' },
  chipText: { color: '#666', fontSize: 13 },
  chipTextActive: { color: '#6366f1' },
  emotionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  emotionChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    backgroundColor: '#16161e', borderWidth: 1, borderColor: '#2a2a3e',
  },
  emotionChipActive: { backgroundColor: '#14b8a622', borderColor: '#14b8a6' },
  emotionChipText: { color: '#666', fontSize: 13 },
  emotionChipTextActive: { color: '#14b8a6' },
  textArea: {
    backgroundColor: '#16161e', borderRadius: 10, padding: 14,
    color: '#e0e0ee', fontSize: 14, borderWidth: 1,
    borderColor: '#2a2a3e', minHeight: 80, marginBottom: 8,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#6366f1', borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', marginTop: 16,
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  resultContainer: { flex: 1, padding: 24, justifyContent: 'center' },
  resultTitle: { fontSize: 20, fontWeight: '600', color: '#e0e0ee', marginBottom: 24 },
  aiOpenerBox: {
    backgroundColor: '#16161e', borderRadius: 12, padding: 18,
    borderWidth: 1, borderColor: '#6366f133', marginBottom: 32,
  },
  aiOpenerLabel: { fontSize: 10, color: '#6366f1', fontWeight: '600', marginBottom: 8 },
  aiOpenerText: { fontSize: 16, color: '#e0e0ee', lineHeight: 24 },
  resetBtn: { alignItems: 'center', paddingVertical: 12 },
  resetBtnText: { color: '#6366f1', fontSize: 15, fontWeight: '500' },
});
