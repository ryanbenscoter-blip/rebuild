import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const DAILY_CONTENT = [
  {
    id: '1',
    date: 'Today',
    title: 'The hardest part is starting.',
    body: "Everyone wants to be sober. Nobody wants to go through getting sober. That gap — between wanting it and doing it — that's where most people get stuck.\n\nBut here's what I learned: you don't have to cross the whole gap today. You just have to take one step into it.\n\nToday's step: just don't drink today. That's it. Not forever. Not next week. Just today.\n\nI did it one day at a time. You can too.",
    type: 'message',
    readTime: '2 min read',
    liked: false,
  },
  {
    id: '2',
    date: 'Yesterday',
    title: 'What to do when a craving hits hard.',
    body: "Cravings feel like they'll last forever. They don't. Research shows the average craving peaks and passes within 15-20 minutes if you don't feed it.\n\nMy personal toolkit when it gets bad:\n\n1. Change your location immediately. Go outside, drive somewhere, anything.\n2. Call someone — anyone. Even just to talk about nothing.\n3. Do something physical. Even 20 pushups breaks the mental loop.\n4. Remind yourself: this feeling is not permanent.\n\nThe craving is lying to you. It always passes.",
    type: 'message',
    readTime: '3 min read',
    liked: false,
  },
  {
    id: '3',
    date: '2 days ago',
    title: 'Why I actually got sober.',
    body: "It wasn't for my health. It wasn't for my family. It wasn't because I hit rock bottom.\n\nI got sober because I was exhausted. Exhausted from managing everything around drinking. The planning, the hiding, the recovering, the guilt.\n\nDrinking was a full time job I hated.\n\nWhen I finally stopped, I didn't just lose the drinking. I got back all that energy. All that time. All that mental space.\n\nThat's what nobody tells you about sobriety. You don't just stop losing things. You start getting things back.",
    type: 'message',
    readTime: '2 min read',
    liked: true,
  },
];

const DAILY_CHALLENGES = [
  { id: 'c1', text: 'Write down 3 things you\'re grateful for today', done: false },
  { id: 'c2', text: 'Reach out to one person in your life', done: false },
  { id: 'c3', text: 'Do 10 minutes of movement', done: true },
];

export default function DailyScreen() {
  const [posts, setPosts] = useState(DAILY_CONTENT);
  const [challenges, setChallenges] = useState(DAILY_CHALLENGES);
  const [expandedId, setExpandedId] = useState('1');

  function toggleLike(id) {
    setPosts(posts.map(p => p.id === id ? { ...p, liked: !p.liked } : p));
  }

  function toggleChallenge(id) {
    setChallenges(challenges.map(c => c.id === id ? { ...c, done: !c.done } : c));
  }

  const completedCount = challenges.filter(c => c.done).length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>DAILY</Text>
            <Text style={styles.subtitle}>From Ryan, every single day.</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakText}>Day {new Date().getDate()}</Text>
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

        {/* Ryan's Messages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FROM RYAN</Text>
          {posts.map(post => (
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
                  <Text style={styles.postDate}>{post.date} · {post.readTime}</Text>
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
                  <TouchableOpacity
                    style={styles.likeRow}
                    onPress={() => toggleLike(post.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={post.liked ? 'heart' : 'heart-outline'}
                      size={20}
                      color={post.liked ? colors.accent : colors.muted}
                    />
                    <Text style={[styles.likeText, post.liked && styles.likeTextActive]}>
                      {post.liked ? 'This helped me' : 'This helped me'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom encouragement */}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
  streakBadge: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  streakEmoji: { fontSize: 18 },
  streakText: { color: colors.white, fontSize: 11, fontWeight: '700', marginTop: 2 },
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
    marginBottom: 12,
  },
  sectionMeta: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 12,
  },
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
  checkboxDone: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  challengeText: {
    color: colors.white,
    fontSize: 14,
    flex: 1,
  },
  challengeTextDone: {
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  postCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ryanAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ryanAvatarText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 18,
  },
  postMeta: { flex: 1 },
  postTitle: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  postDate: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  postBody: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 14,
  },
  postContent: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 24,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  likeText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  likeTextActive: {
    color: colors.accent,
  },
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
  encouragementAuthor: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
  },
});
