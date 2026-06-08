import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import PostCard from '../components/PostCard';

const MOCK_POSTS = [
  {
    id: '1',
    name: 'Marcus T.',
    days: 90,
    time: '2m ago',
    content: 'Just hit 90 days. Three months ago I couldn\'t go 3 hours. If you\'re on day 1 reading this — I promise it gets better. Keep going.',
    likes: 47,
    comments: 12,
    milestone: '90 Days',
  },
  {
    id: '2',
    name: 'Sarah K.',
    days: 14,
    time: '18m ago',
    content: 'Had a really hard night last night. Work stress, old friends texting, the whole thing. But I made it through. Day 14. Still here.',
    likes: 89,
    comments: 23,
    milestone: null,
  },
  {
    id: '3',
    name: 'Derek M.',
    days: 365,
    time: '1h ago',
    content: 'ONE YEAR. 365 days ago I was sleeping on my brother\'s couch with nothing. Today I have my own place, a new job, and my daughter calls me every Sunday. Sobriety gave me my life back.',
    likes: 214,
    comments: 67,
    milestone: '1 Year 🔥',
  },
  {
    id: '4',
    name: 'Jamie L.',
    days: 7,
    time: '3h ago',
    content: 'One week. I know it\'s not much but it\'s the longest I\'ve gone in 4 years. Feeling proud of myself for the first time in a long time.',
    likes: 103,
    comments: 31,
    milestone: '1 Week',
  },
  {
    id: '5',
    name: 'Tony R.',
    days: 30,
    time: '5h ago',
    content: 'Month one down. The cravings are still there but they\'re quieter now. Like a TV in another room instead of someone screaming in your face.',
    likes: 156,
    comments: 18,
    milestone: '30 Days',
  },
];

const FILTERS = ['All', 'Wins', 'Struggling', 'Milestones'];

export default function CommunityScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [newPost, setNewPost] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>COMMUNITY</Text>
            <Text style={styles.subtitle}>You are not alone.</Text>
          </View>
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => setPostModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filters}>
          {FILTERS.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Posts */}
        <FlatList
          data={MOCK_POSTS}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <PostCard post={item} />}
          contentContainerStyle={styles.feed}
          showsVerticalScrollIndicator={false}
        />

        {/* New Post Modal */}
        <Modal
          visible={postModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setPostModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Share with the Community</Text>
                <TouchableOpacity onPress={() => setPostModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.muted} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="What's on your mind? Share a win, a struggle, or some encouragement..."
                placeholderTextColor={colors.muted}
                multiline
                value={newPost}
                onChangeText={setNewPost}
                autoFocus
              />
              <TouchableOpacity
                style={[styles.submitButton, !newPost.trim() && styles.submitButtonDisabled]}
                disabled={!newPost.trim()}
                activeOpacity={0.8}
                onPress={() => {
                  setNewPost('');
                  setPostModalVisible(false);
                }}
              >
                <Text style={styles.submitText}>POST</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
    letterSpacing: 1,
  },
  postButton: {
    backgroundColor: colors.accent,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.white,
  },
  feed: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.white,
  },
  textInput: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    color: colors.white,
    fontSize: 15,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 2,
  },
});
