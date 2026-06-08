import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  function handleLike() {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{post.name[0].toUpperCase()}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name}>{post.name}</Text>
          <Text style={styles.meta}>{post.days} days sober · {post.time}</Text>
        </View>
        {post.milestone && (
          <View style={styles.milestoneBadge}>
            <Text style={styles.milestoneText}>🏆 {post.milestone}</Text>
          </View>
        )}
      </View>

      <Text style={styles.content}>{post.content}</Text>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.action} onPress={handleLike} activeOpacity={0.7}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={20}
            color={liked ? colors.accent : colors.muted}
          />
          <Text style={[styles.actionText, liked && styles.actionTextActive]}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action} activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.muted} />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action} activeOpacity={0.7}>
          <Ionicons name="hand-left-outline" size={20} color={colors.muted} />
          <Text style={styles.actionText}>I got you</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 18,
  },
  headerText: {
    flex: 1,
  },
  name: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  meta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  milestoneBadge: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  milestoneText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },
  footer: {
    flexDirection: 'row',
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  actionTextActive: {
    color: colors.accent,
  },
});
