import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const MOCK_PARTNER = {
  name: 'Marcus T.',
  days: 90,
  lastCheckIn: '2 hours ago',
  streak: 14,
  status: 'doing well',
};

const MOCK_MESSAGES = [
  { id: '1', from: 'them', text: 'Rough morning but I got through it. Didn\'t drink.', time: '8:14am' },
  { id: '2', from: 'me', text: 'That\'s huge. Getting through the rough ones is everything.', time: '8:32am' },
  { id: '3', from: 'them', text: 'Thanks man. How are you holding up?', time: '8:33am' },
  { id: '4', from: 'me', text: 'Strong today. Hit the gym this morning. Feeling good.', time: '9:01am' },
  { id: '5', from: 'them', text: '💪 Let\'s go. Checking in tonight.', time: '9:02am' },
];

export default function PartnerScreen() {
  const [hasPartner] = useState(true);
  const [message, setMessage] = useState('');
  const [checkedIn, setCheckedIn] = useState(false);

  if (!hasPartner) {
    return <NoPartnerView />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PARTNER</Text>
          <Text style={styles.subtitle}>Your accountability partner.</Text>
        </View>

        {/* Partner Card */}
        <View style={styles.partnerCard}>
          <View style={styles.partnerLeft}>
            <View style={styles.partnerAvatar}>
              <Text style={styles.partnerAvatarText}>{MOCK_PARTNER.name[0]}</Text>
              <View style={styles.onlineDot} />
            </View>
            <View>
              <Text style={styles.partnerName}>{MOCK_PARTNER.name}</Text>
              <Text style={styles.partnerDays}>{MOCK_PARTNER.days} days sober</Text>
              <Text style={styles.partnerStatus}>Last check-in: {MOCK_PARTNER.lastCheckIn}</Text>
            </View>
          </View>
          <View style={styles.partnerStreak}>
            <Text style={styles.streakNumber}>{MOCK_PARTNER.streak}</Text>
            <Text style={styles.streakLabel}>day streak{'\n'}together</Text>
          </View>
        </View>

        {/* Daily Check-in */}
        <TouchableOpacity
          style={[styles.checkInButton, checkedIn && styles.checkInButtonDone]}
          onPress={() => setCheckedIn(true)}
          activeOpacity={0.8}
          disabled={checkedIn}
        >
          <Ionicons
            name={checkedIn ? 'checkmark-circle' : 'radio-button-off'}
            size={24}
            color={colors.white}
          />
          <View>
            <Text style={styles.checkInText}>
              {checkedIn ? 'Checked in today ✓' : 'Check in for today'}
            </Text>
            <Text style={styles.checkInSub}>
              {checkedIn ? 'Your partner has been notified' : 'Let your partner know you\'re sober today'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Quick Reactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QUICK SEND</Text>
          <View style={styles.reactionsRow}>
            {[
              { emoji: '💪', label: 'Strong' },
              { emoji: '🙏', label: 'Need help' },
              { emoji: '🔥', label: 'Crushing it' },
              { emoji: '😤', label: 'Hard day' },
            ].map(r => (
              <TouchableOpacity key={r.label} style={styles.reactionChip} activeOpacity={0.7}>
                <Text style={styles.reactionEmoji}>{r.emoji}</Text>
                <Text style={styles.reactionLabel}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Messages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TODAY'S MESSAGES</Text>
          <View style={styles.messagesContainer}>
            {MOCK_MESSAGES.map(msg => (
              <View
                key={msg.id}
                style={[styles.bubble, msg.from === 'me' ? styles.bubbleMe : styles.bubbleThem]}
              >
                <Text style={[styles.bubbleText, msg.from === 'me' && styles.bubbleTextMe]}>
                  {msg.text}
                </Text>
                <Text style={styles.bubbleTime}>{msg.time}</Text>
              </View>
            ))}
          </View>

          {/* Message input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Send a message..."
              placeholderTextColor={colors.muted}
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
              disabled={!message.trim()}
              activeOpacity={0.8}
              onPress={() => setMessage('')}
            >
              <Ionicons name="send" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Partner stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YOUR BOND</Text>
          <View style={styles.bondRow}>
            <View style={styles.bondCard}>
              <Text style={styles.bondNumber}>{MOCK_PARTNER.streak}</Text>
              <Text style={styles.bondLabel}>Days together</Text>
            </View>
            <View style={styles.bondCard}>
              <Text style={styles.bondNumber}>100%</Text>
              <Text style={styles.bondLabel}>Check-in rate</Text>
            </View>
            <View style={styles.bondCard}>
              <Text style={styles.bondNumber}>47</Text>
              <Text style={styles.bondLabel}>Messages</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function NoPartnerView() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.noPartnerContainer}>
        <Text style={styles.noPartnerEmoji}>🤝</Text>
        <Text style={styles.noPartnerTitle}>Get an Accountability Partner</Text>
        <Text style={styles.noPartnerText}>
          Research shows one-on-one accountability is the single most powerful tool for staying sober. Get matched with someone on the same journey.
        </Text>
        <TouchableOpacity style={styles.findButton} activeOpacity={0.8}>
          <Text style={styles.findButtonText}>Find My Partner</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inviteButton} activeOpacity={0.8}>
          <Text style={styles.inviteButtonText}>Invite Someone I Know</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
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
  partnerCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  partnerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  partnerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerAvatarText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 22,
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  partnerName: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
  partnerDays: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  partnerStatus: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  partnerStreak: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.gold,
  },
  streakLabel: {
    fontSize: 10,
    color: colors.muted,
    textAlign: 'center',
    letterSpacing: 1,
  },
  checkInButton: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },
  checkInButtonDone: {
    backgroundColor: colors.success,
  },
  checkInText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 15,
  },
  checkInSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 3,
    marginBottom: 12,
  },
  reactionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  reactionChip: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  reactionEmoji: { fontSize: 20 },
  reactionLabel: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
  messagesContainer: {
    marginBottom: 12,
    gap: 8,
  },
  bubble: {
    maxWidth: '80%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleMe: {
    backgroundColor: colors.accent,
    alignSelf: 'flex-end',
    borderColor: colors.accent,
  },
  bubbleText: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextMe: {
    color: colors.white,
  },
  bubbleTime: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    color: colors.white,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  bondRow: {
    flexDirection: 'row',
    gap: 10,
  },
  bondCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bondNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.white,
  },
  bondLabel: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 4,
    textAlign: 'center',
  },
  noPartnerContainer: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPartnerEmoji: { fontSize: 60, marginBottom: 20 },
  noPartnerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  noPartnerText: {
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  findButton: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    padding: 18,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  findButtonText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 16,
  },
  inviteButton: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 14,
    padding: 18,
    width: '100%',
    alignItems: 'center',
  },
  inviteButtonText: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: 16,
  },
});
