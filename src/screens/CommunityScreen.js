import React, { useState, useEffect, useCallback } from 'react';
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
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

const FILTERS = ['All', 'Wins', 'Struggling', 'Milestones'];

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getDays(sobrietyDate) {
  if (!sobrietyDate) return 0;
  const diff = new Date() - new Date(sobrietyDate);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function PostCard({ post, currentUserId, onLikeToggle }) {
  const [liked, setLiked] = useState(post.liked_by_me);
  const [likeCount, setLikeCount] = useState(post.likes_count);

  async function handleLike() {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(newLiked ? likeCount + 1 : likeCount - 1);

    if (newLiked) {
      await supabase.from('post_likes').insert({ post_id: post.id, user_id: currentUserId });
      await supabase.from('posts').update({ likes_count: likeCount + 1 }).eq('id', post.id);
    } else {
      await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', currentUserId);
      await supabase.from('posts').update({ likes_count: likeCount - 1 }).eq('id', post.id);
    }
  }

  const name = post.profiles?.full_name || 'Anonymous';
  const days = getDays(post.profiles?.sobriety_date);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name[0].toUpperCase()}</Text>
        </View>
        <View style={styles.cardMeta}>
          <Text style={styles.cardName}>{name}</Text>
          <Text style={styles.cardSub}>{days} days sober · {timeAgo(post.created_at)}</Text>
        </View>
        {post.post_type !== 'general' && (
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {post.post_type === 'win' ? '🏆 Win' : post.post_type === 'struggling' ? '💙 Support' : '🔥 Milestone'}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.cardContent}>{post.content}</Text>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.action} onPress={handleLike} activeOpacity={0.7}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color={liked ? colors.accent : colors.muted} />
          <Text style={[styles.actionText, liked && styles.actionTextActive]}>{likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.muted} />
          <Text style={styles.actionText}>{post.comments_count}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} activeOpacity={0.7}>
          <Ionicons name="hand-left-outline" size={20} color={colors.muted} />
          <Text style={styles.actionText}>I got you</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CommunityScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState('general');
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id);
    });
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
      .from('posts')
      .select('*, profiles(full_name, sobriety_date)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (activeFilter === 'Wins') query = query.eq('post_type', 'win');
    else if (activeFilter === 'Struggling') query = query.eq('post_type', 'struggling');
    else if (activeFilter === 'Milestones') query = query.eq('post_type', 'milestone');

    const { data, error } = await query;
    if (error) { console.log(error); return; }

    if (user && data) {
      const { data: likes } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id);

      const likedIds = new Set((likes || []).map(l => l.post_id));
      setPosts(data.map(p => ({ ...p, liked_by_me: likedIds.has(p.id) })));
    } else {
      setPosts(data || []);
    }

    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    fetchPosts();
  }, [activeFilter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, [activeFilter]);

  async function handleSubmitPost() {
    if (!newPost.trim()) return;
    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('posts').insert({
      user_id: user.id,
      content: newPost.trim(),
      post_type: postType,
    });

    setSubmitting(false);
    if (error) {
      Alert.alert('Error', 'Could not post. Please try again.');
      return;
    }
    setNewPost('');
    setPostType('general');
    setPostModalVisible(false);
    fetchPosts();
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>COMMUNITY</Text>
            <Text style={styles.subtitle}>You are not alone.</Text>
          </View>
          <TouchableOpacity style={styles.postButton} onPress={() => setPostModalVisible(true)} activeOpacity={0.8}>
            <Ionicons name="add" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.filters}>
          {FILTERS.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PostCard post={item} currentUserId={currentUserId} />
          )}
          contentContainerStyle={styles.feed}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No posts yet.</Text>
              <Text style={styles.emptySubtext}>Be the first to share something.</Text>
            </View>
          }
        />

        <Modal visible={postModalVisible} animationType="slide" transparent onRequestClose={() => setPostModalVisible(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Share with the Community</Text>
                <TouchableOpacity onPress={() => setPostModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.muted} />
                </TouchableOpacity>
              </View>

              <View style={styles.typeRow}>
                {[
                  { type: 'general', label: 'General' },
                  { type: 'win', label: '🏆 Win' },
                  { type: 'struggling', label: '💙 Struggling' },
                  { type: 'milestone', label: '🔥 Milestone' },
                ].map(t => (
                  <TouchableOpacity
                    key={t.type}
                    style={[styles.typeChip, postType === t.type && styles.typeChipActive]}
                    onPress={() => setPostType(t.type)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.typeChipText, postType === t.type && styles.typeChipTextActive]}>{t.label}</Text>
                  </TouchableOpacity>
                ))}
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
                style={[styles.submitButton, (!newPost.trim() || submitting) && styles.submitButtonDisabled]}
                disabled={!newPost.trim() || submitting}
                activeOpacity={0.8}
                onPress={handleSubmitPost}
              >
                {submitting
                  ? <ActivityIndicator color={colors.white} />
                  : <Text style={styles.submitText}>POST</Text>
                }
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: { fontSize: 24, fontWeight: '900', color: colors.white, letterSpacing: 4 },
  subtitle: { fontSize: 12, color: colors.muted, marginTop: 2, letterSpacing: 1 },
  postButton: {
    backgroundColor: colors.accent,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filters: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 16 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  filterText: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: colors.white },
  feed: { paddingHorizontal: 20, paddingBottom: 20 },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: colors.white, fontSize: 18, fontWeight: '700' },
  emptySubtext: { color: colors.muted, fontSize: 14, marginTop: 8 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: { color: colors.white, fontWeight: '800', fontSize: 18 },
  cardMeta: { flex: 1 },
  cardName: { color: colors.white, fontWeight: '700', fontSize: 15 },
  cardSub: { color: colors.muted, fontSize: 12, marginTop: 2 },
  typeBadge: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeBadgeText: { color: colors.gold, fontSize: 11, fontWeight: '700' },
  cardContent: { color: colors.white, fontSize: 15, lineHeight: 22, marginBottom: 14 },
  cardFooter: {
    flexDirection: 'row',
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  actionTextActive: { color: colors.accent },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
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
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.white },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  typeChipText: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  typeChipTextActive: { color: colors.white },
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
  submitButtonDisabled: { opacity: 0.4 },
  submitText: { color: colors.white, fontWeight: '900', fontSize: 15, letterSpacing: 2 },
});
