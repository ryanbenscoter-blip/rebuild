import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

const ADMIN_ID = '66d349da-6b31-4789-9402-7407b9d03ae0';

const DAILY_CHALLENGES = [
  { id: 'c1', text: 'Write down 3 things you\'re grateful for today', done: false },
  { id: 'c2', text: 'Reach out to one person in your life', done: false },
  { id: 'c3', text: 'Do 10 minutes of movement', done: false },
];

export default function DailyScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [challenges, setChallenges] = useState(DAILY_CHALLENGES);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
    fetchPosts();
  }, []);

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id === ADMIN_ID) setIsAdmin(true);
  }

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('daily_posts')
      .select('*')
      .order('post_date', { ascending: false })
      .limit(10);

    if (!error && data) {
      setPosts(data);
      if (data.length > 0) setExpandedId(data[0].id);
    }
    setLoading(false);
    setRefreshing(false);
  }

  function toggleChallenge(id) {
    setChallenges(challenges.map(c => c.id === id ? { ...c, done: !c.done } : c));
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  const completedCount = challenges.filter(c => c.done).length;

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
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPosts(); }} tintColor={colors.accent} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>DAILY</Text>
            <Text style={styles.subtitle}>From Ryan, every single day.</Text>
          </View>
          <View style={styles.headerRight}>
            {isAdmin && (
              <TouchableOpacity
                style={styles.adminButton}
                onPress={() => navigation.navigate('AdminPost')}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={20} color={colors.white} />
                <Text style={styles.adminButtonText}>Post</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Daily Challenges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TODAY'S CHALLENGES</Text>
            <Text style={styles.sectionMeta}>{completedCount}/{challenges.length} done</Text>
          </View>
          {challenges.map(challenge => (
            <TouchableOpacity
              key={challenge.id}
              style={styles.challengeRow}
              onPress={() => toggleChallenge(challenge.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, challenge.done && styles.checkboxDone]}>
                {challenge.done && <Ionicons name="checkmark" size={14} color={colors.white} />}
              </View>
              <Text style={[styles.challengeText, challenge.done && styles.challengeTextDone]}>
                {challenge.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ryan's Posts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FROM RYAN</Text>

          {posts.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Ryan's first post is coming soon.</Text>
              <Text style={styles.emptySubtext}>Check back tomorrow.</Text>
            </View>
          ) : (
            posts.map(post => (
              <TouchableOpacity
                key={post.id}
                style={styles.postCard}
                onPress={() => setExpandedId(expandedId === post.id ? null : post.id)}
                activeOpacity={0.85}
              >
                <View style={styles.postHeader}>
                  <View style={styles.ryanAvatar}>
                    <Text style={styles.ryanAvatarText}>R</Text>
                  </View>
                  <View style={styles.postMeta}>
                    <Text style={styles.postTitle}>{post.title}</Text>
                    <Text style={styles.postDate}>{formatDate(post.post_date)}</Text>
                  </View>
                  <Ionicons
                    name={expandedId === post.id ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.muted}
                  />
                </View>

                {expandedId === post.id && (
                  <View style={styles.postBody}>
                    <Text style={styles.postContent}>{post.body}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.encouragement}>
          <Text style={styles.encouragementText}>
            "You survived every bad day so far. Your record is 100%."
          </Text>
          <Text style={styles.encouragementAuthor}>— Ryan</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 20, paddingBottom: 40 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 24, fontWeight: '900', color: colors.white, letterSpacing: 4 },
  subtitle: { fontSize: 12, color: colors.muted, marginTop: 2, letterSpacing: 1 },
  headerRight: { flexDirection: 'row', gap: 10 },
  adminButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adminButtonText: { color: colors.white, fontWeight: '800', fontSize: 13 },
  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 3,
  },
  sectionMeta: { fontSize: 12, color: colors.muted },
  challengeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  challengeText: { color: colors.white, fontSize: 14, flex: 1 },
  challengeTextDone: { color: colors.muted, textDecorationLine: 'line-through' },
  postCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ryanAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ryanAvatarText: { color: colors.white, fontWeight: '900', fontSize: 18 },
  postMeta: { flex: 1 },
  postTitle: { color: colors.white, fontWeight: '700', fontSize: 14 },
  postDate: { color: colors.muted, fontSize: 12, marginTop: 2 },
  postBody: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 14,
  },
  postContent: { color: colors.white, fontSize: 15, lineHeight: 24 },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  emptySubtext: { color: colors.muted, fontSize: 13, marginTop: 6 },
  encouragement: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.border,
  },
  encouragementText: {
    color: colors.white,
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  encouragementAuthor: { color: colors.accent, fontSize: 13, fontWeight: '700', marginTop: 8 },
});
