import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { getSobrietyStats } from '../utils/sobriety';

const MILESTONES = [
  { days: 1, label: '1 Day', emoji: '✨' },
  { days: 7, label: '1 Week', emoji: '🔥' },
  { days: 30, label: '30 Days', emoji: '💪' },
  { days: 90, label: '90 Days', emoji: '⚡' },
  { days: 180, label: '6 Months', emoji: '🏆' },
  { days: 365, label: '1 Year', emoji: '👑' },
];

export default function ProfileScreen() {
  const stats = getSobrietyStats();
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>R</Text>
          </View>
          <Text style={styles.name}>Ryan</Text>
          <Text style={styles.joinDate}>Member since Dec 2022</Text>
          <View style={styles.daysBadge}>
            <Text style={styles.daysBadgeText}>{stats.totalDays} Days Sober</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalDays}</Text>
            <Text style={styles.statLabel}>Days Sober</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.years}</Text>
            <Text style={styles.statLabel}>Years</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>${(stats.totalDays * 15).toLocaleString()}</Text>
            <Text style={styles.statLabel}>Est. Saved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{(stats.totalDays * 2000).toLocaleString()}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
        </View>

        {/* Milestones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MILESTONES</Text>
          <View style={styles.milestonesGrid}>
            {MILESTONES.map(m => {
              const achieved = stats.totalDays >= m.days;
              return (
                <View key={m.days} style={[styles.milestoneCard, !achieved && styles.milestoneCardLocked]}>
                  <Text style={styles.milestoneEmoji}>{achieved ? m.emoji : '🔒'}</Text>
                  <Text style={[styles.milestoneLabel, !achieved && styles.milestoneLabelLocked]}>
                    {m.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>

          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
              <Ionicons name="calendar-outline" size={20} color={colors.accent} />
              <Text style={styles.settingText}>Change Sobriety Date</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <Ionicons name="notifications-outline" size={20} color={colors.accent} />
              <Text style={styles.settingText}>Push Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={colors.white}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <Ionicons name="alarm-outline" size={20} color={colors.accent} />
              <Text style={styles.settingText}>Daily Reminder</Text>
              <Switch
                value={dailyReminder}
                onValueChange={setDailyReminder}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={colors.white}
              />
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
              <Ionicons name="person-outline" size={20} color={colors.accent} />
              <Text style={styles.settingText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
              <Ionicons name="shield-outline" size={20} color={colors.accent} />
              <Text style={styles.settingText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutButton} activeOpacity={0.8}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Rebuild v1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 20, paddingBottom: 40 },
  header: {
    alignItems: 'center',
    marginBottom: 28,
    paddingTop: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.white,
  },
  name: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.white,
  },
  joinDate: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },
  daysBadge: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  daysBadgeText: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.white,
  },
  statLabel: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 4,
    letterSpacing: 1,
  },
  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 3,
    marginBottom: 12,
  },
  milestonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  milestoneCard: {
    flex: 1,
    minWidth: '28%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gold,
  },
  milestoneCardLocked: {
    borderColor: colors.border,
    opacity: 0.5,
  },
  milestoneEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  milestoneLabel: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  milestoneLabelLocked: {
    color: colors.muted,
  },
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  settingText: {
    flex: 1,
    color: colors.white,
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 48,
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  signOutText: {
    color: colors.error,
    fontWeight: '800',
    fontSize: 15,
  },
  version: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 12,
  },
});
