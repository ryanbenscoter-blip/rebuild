import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { colors } from '../theme/colors';
import SOSScreen from './SOSScreen';
import BodyRecovery from '../components/BodyRecovery';
import CravingTracker from '../components/CravingTracker';
import { getSobrietyStats, getNextMilestone } from '../utils/sobriety';
import { supabase } from '../lib/supabase';

export default function HomeScreen() {
  const [stats, setStats] = useState(getSobrietyStats());
  const [sosVisible, setSosVisible] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getSobrietyStats());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const nextMilestone = getNextMilestone(stats.totalDays);
  const daysToNext = nextMilestone ? nextMilestone - stats.totalDays : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>REBUILD</Text>
          <Text style={styles.tagline}>One day at a time.</Text>
        </View>

        {/* Main Counter */}
        <View style={styles.counterCard}>
          <Text style={styles.counterLabel}>DAYS SOBER</Text>
          <Text style={styles.counterNumber}>{stats.totalDays}</Text>
          <View style={styles.counterBreakdown}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownNumber}>{stats.years}</Text>
              <Text style={styles.breakdownLabel}>YRS</Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownNumber}>{stats.months}</Text>
              <Text style={styles.breakdownLabel}>MOS</Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownNumber}>{stats.days}</Text>
              <Text style={styles.breakdownLabel}>DAYS</Text>
            </View>
          </View>
        </View>

        {/* Next Milestone */}
        {nextMilestone && (
          <View style={styles.milestoneCard}>
            <Text style={styles.milestoneLabel}>NEXT MILESTONE</Text>
            <Text style={styles.milestoneText}>
              <Text style={styles.milestoneAccent}>{daysToNext} days</Text> until {nextMilestone} days sober
            </Text>
          </View>
        )}

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalHours.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Hours Sober</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>${(stats.totalDays * 15).toLocaleString()}</Text>
            <Text style={styles.statLabel}>Est. Saved</Text>
          </View>
        </View>

        {/* Body Recovery */}
        <BodyRecovery totalDays={stats.totalDays} />

        {/* Craving Tracker */}
        <CravingTracker userId={userId} />

        {/* SOS Button */}
        <TouchableOpacity style={styles.sosButton} activeOpacity={0.8} onPress={() => setSosVisible(true)}>
          <Text style={styles.sosText}>I NEED SUPPORT RIGHT NOW</Text>
        </TouchableOpacity>

        <Modal visible={sosVisible} animationType="slide" onRequestClose={() => setSosVisible(false)}>
          <SOSScreen onClose={() => setSosVisible(false)} />
        </Modal>

        {/* Daily Pledge */}
        <TouchableOpacity style={styles.pledgeButton} activeOpacity={0.8}>
          <Text style={styles.pledgeText}>Take Today's Pledge</Text>
          <Text style={styles.pledgeSubtext}>I choose to stay sober today</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  logo: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 8,
  },
  tagline: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
    letterSpacing: 2,
  },
  counterCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  counterLabel: {
    fontSize: 12,
    color: colors.accent,
    letterSpacing: 4,
    fontWeight: '700',
    marginBottom: 8,
  },
  counterNumber: {
    fontSize: 96,
    fontWeight: '900',
    color: colors.white,
    lineHeight: 100,
  },
  counterBreakdown: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  breakdownItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  breakdownNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.accent,
  },
  breakdownLabel: {
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 2,
    marginTop: 2,
  },
  breakdownDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  milestoneCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  milestoneLabel: {
    fontSize: 10,
    color: colors.gold,
    letterSpacing: 3,
    fontWeight: '700',
    marginBottom: 4,
  },
  milestoneText: {
    fontSize: 15,
    color: colors.white,
  },
  milestoneAccent: {
    color: colors.gold,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
  },
  statLabel: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 4,
    letterSpacing: 1,
  },
  sosButton: {
    backgroundColor: colors.error,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  sosText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 2,
  },
  pledgeButton: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  pledgeText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
  pledgeSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
  },
});
