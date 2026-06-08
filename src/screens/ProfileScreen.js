import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { getSobrietyStats } from '../utils/sobriety';
import { supabase } from '../lib/supabase';

const MILESTONES = [
  { days: 1, label: '1 Day', emoji: '✨' },
  { days: 7, label: '1 Week', emoji: '🔥' },
  { days: 30, label: '30 Days', emoji: '💪' },
  { days: 90, label: '90 Days', emoji: '⚡' },
  { days: 180, label: '6 Months', emoji: '🏆' },
  { days: 365, label: '1 Year', emoji: '👑' },
];

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!error && data) setProfile(data);
    setLoading(false);
  }

  async function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => supabase.auth.signOut(),
      },
    ]);
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

  const sobrietyDate = profile?.sobriety_date ? new Date(profile.sobriety_date) : new Date('2022-12-22');
  const stats = getSobrietyStats(sobrietyDate);
  const name = profile?.full_name || 'You';
  const initials = name[0].toUpperCase();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.joinDate}>
            Sober since {sobrietyDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>
          <View style={styles.daysBadge}>
            <Text style={styles.daysBadgeText}>{stats.totalDays} Days Sober</Text>
          </View>
        </View>

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
            <Text style={styles.statLabel}>Cals Not Drunk</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MILESTONES</Text>
          <View style={styles.milestonesGrid}>
            {MILESTONES.map(m => {
              const achieved = stats.totalDays >= m.days;
              return (
                <View key={m.days} style={[styles.milestoneCard, !achieved && styles.milestoneCardLocked]}>
                  <Text style={styles.milestoneEmoji}>{achieved ? m.emoji : '🔒'}</Text>
                  <Text style={[styles.milestoneLabel, !achieved && styles.milestoneLabelLocked]}>{m.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

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
              <Ionicons name="shield-outline" size={20} color={colors.accent} />
              <Text style={styles.settingText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.8}>
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
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 28, paddingTop: 10 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 36, fontWeight: '900', color: colors.white },
  name: { fontSize: 24, fontWeight: '900', color: colors.white },
  joinDate: { fontSize: 13, color: colors.muted, marginTop: 4 },
  daysBadge: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  daysBadgeText: { color: colors.accent, fontWeight: '800', fontSize: 13 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 },
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
  statNumber: { fontSize: 22, fontWeight: '900', color: colors.white },
  statLabel: { fontSize: 11, color: colors.muted, marginTop: 4, letterSpacing: 1 },
  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 3,
    marginBottom: 12,
  },
  milestonesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
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
  milestoneCardLocked: { borderColor: colors.border, opacity: 0.5 },
  milestoneEmoji: { fontSize: 24, marginBottom: 6 },
  milestoneLabel: { color: colors.white, fontSize: 11, fontWeight: '700', textAlign: 'center' },
  milestoneLabelLocked: { color: colors.muted },
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  settingText: { flex: 1, color: colors.white, fontSize: 15 },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 48 },
  signOutButton: {
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  signOutText: { color: colors.error, fontWeight: '800', fontSize: 15 },
  version: { textAlign: 'center', color: colors.muted, fontSize: 12 },
});
