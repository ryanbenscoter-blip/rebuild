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
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

export default function AdminPostScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  async function handlePost() {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Missing fields', 'Please add both a title and message.');
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('daily_posts').insert({
      title: title.trim(),
      body: body.trim(),
      post_date: new Date().toISOString().split('T')[0],
    });

    setSaving(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert('Posted!', 'Your daily message is live.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backText}>← Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>TODAY'S POST</Text>
            <View style={{ width: 60 }} />
          </View>

          <Text style={styles.label}>TITLE</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. The hardest part is starting."
            placeholderTextColor={colors.muted}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={styles.charCount}>{title.length}/100</Text>

          <Text style={styles.label}>YOUR MESSAGE</Text>
          <TextInput
            style={[styles.input, styles.bodyInput]}
            placeholder="Write from the heart. This goes to everyone in Rebuild today..."
            placeholderTextColor={colors.muted}
            value={body}
            onChangeText={setBody}
            multiline
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{body.length} characters</Text>

          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>PREVIEW</Text>
            <Text style={styles.previewTitle}>{title || 'Your title here...'}</Text>
            <Text style={styles.previewBody}>{body || 'Your message here...'}</Text>
          </View>

          <TouchableOpacity
            style={[styles.postButton, (!title.trim() || !body.trim() || saving) && styles.postButtonDisabled]}
            onPress={handlePost}
            disabled={!title.trim() || !body.trim() || saving}
            activeOpacity={0.8}
          >
            {saving
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.postButtonText}>POST TO REBUILD</Text>
            }
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  backButton: { padding: 4 },
  backText: { color: colors.accent, fontSize: 15, fontWeight: '600' },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 3,
    marginBottom: 8,
    marginTop: 16,
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
  bodyInput: {
    minHeight: 200,
    lineHeight: 24,
  },
  charCount: {
    color: colors.muted,
    fontSize: 11,
    textAlign: 'right',
    marginTop: 4,
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 3,
    marginBottom: 10,
  },
  previewTitle: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 10,
  },
  previewBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  postButton: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  postButtonDisabled: { opacity: 0.4 },
  postButtonText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 3,
  },
});
