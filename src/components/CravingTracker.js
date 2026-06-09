import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

const TRIGGERS = [
  { id: 'stress', label: 'Stress', emoji: '😤' },
  { id: 'loneliness', label: 'Lonely', emoji: '😔' },
  { id: 'social', label: 'Social', emoji: '🍻' },
  { id: 'boredom', label: 'Boredom', emoji: '😶' },
  { id: 'anxiety', label: 'Anxiety', emoji: '😰' },
  { id: 'habit', label: 'Habit', emoji: '🔄' },
  { id: 'celebration', label: 'Celebrating', emoji: '🎉' },
  { id: 'anger', label: 'Anger', emoji: '😡' },
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIMES = ['Morning', 'Afternoon', 'Evening', 'Late Night'];

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  if (hour < 21) return 'Evening';
  return 'Late Night';
}

function getDayOfWeek() {
  return DAYS[new Date().getDay()];
}

export default function CravingTracker({ userId }) {
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [totalCravings, setTotalCravings] = useState(0);
  const [overcameCount, setOvercameCount] = useState(0);

  useEffect(() => {
    fetchQuickStats();
  }, []);

  async function fetchQuickStats() {
    if (!userId) return;
    const { data } = await supabase
      .from('craving_logs')
      .select('overcame')
      .eq('user_id', userId);

    if (data) {
      setTotalCravings(data.length);
      setOvercameCount(data.filter(c => c.overcame).length);
    }
  }

  async function logCraving(overcame = false) {
    if (!userId) return;
    setSaving(true);

    await supabase.from('craving_logs').insert({
      user_id: userId,
      trigger_type: selectedTrigger,
      intensity,
      time_of_day: getTimeOfDay(),
      day_of_week: getDayOfWeek(),
      overcame,
    });

    setSaving(false);
    setSaved(true);
    fetchQuickStats();
    setTimeout(() => {
      setSaved(false);
      setLogModalVisible(false);
      setSelectedTrigger(null);
      setIntensity(5);
    }, 1500);
  }

  async function fetchStats() {
    if (!userId) return;
    setLoadingStats(true);

    const { data } = await supabase
      .from('craving_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!data || data.length === 0) {
      setStats(null);
      setLoadingStats(false);
      return;
    }

    // Trigger breakdown
    const triggerCounts = {};
    data.forEach(c => {
      if (c.trigger_type) {
        triggerCounts[c.trigger_type] = (triggerCounts[c.trigger_type] || 0) + 1;
      }
    });
    const topTrigger = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0];

    // Day breakdown
    const dayCounts = {};
    data.forEach(c => {
      if (c.day_of_week) {
        dayCounts[c.day_of_week] = (dayCounts[c.day_of_week] || 0) + 1;
      }
    });
    const topDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0];

    // Time breakdown
    const timeCounts = {};
    data.forEach(c => {
      if (c.time_of_day) {
        timeCounts[c.time_of_day] = (timeCounts[c.time_of_day] || 0) + 1;
      }
    });
    const topTime = Object.entries(timeCounts).sort((a, b) => b[1] - a[1])[0];

    // Overcome rate
    const overcameRate = Math.round((data.filter(c => c.overcame).length / data.length) * 100);

    // Average intensity
    const avgIntensity = Math.round(data.reduce((sum, c) => sum + (c.intensity || 5), 0) / data.length);

    setStats({
      total: data.length,
      topTrigger: topTrigger ? { name: topTrigger[0], count: topTrigger[1] } : null,
      topDay: topDay ? { name: topDay[0], count: topDay[1] } : null,
      topTime: topTime ? { name: topTime[0], count: topTime[1] } : null,
      overcameRate,
      avgIntensity,
      triggerCounts,
      dayCounts,
      timeCounts,
      recent: data.slice(0, 5),
    });

    setLoadingStats(false);
  }

  const overcomeRate = totalCravings > 0 ? Math.round((overcameCount / totalCravings) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>CRAVING TRACKER</Text>
        {totalCravings > 0 && (
          <TouchableOpacity
            onPress={() => { fetchStats(); setStatsModalVisible(true); }}
            activeOpacity={0.7}
          >
            <Text style={styles.viewPatterns}>View patterns →</Text>
          </TouchableOpacity>
        )}
      </View>

      {totalCravings > 0 && (
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatNumber}>{totalCravings}</Text>
            <Text style={styles.quickStatLabel}>Logged</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatNumber}>{overcameCount}</Text>
            <Text style={styles.quickStatLabel}>Overcame</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={[styles.quickStatNumber, { color: colors.success }]}>{overcomeRate}%</Text>
            <Text style={styles.quickStatLabel}>Win rate</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.logButton}
        onPress={() => setLogModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle-outline" size={20} color={colors.white} />
        <Text style={styles.logButtonText}>Log a Craving</Text>
      </TouchableOpacity>

      {totalCravings === 0 && (
        <Text style={styles.emptyText}>
          Log cravings to discover your patterns. Knowledge is your best weapon.
        </Text>
      )}

      {/* Log Modal */}
      <Modal visible={logModalVisible} animationType="slide" transparent onRequestClose={() => setLogModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {saved ? (
              <View style={styles.savedContainer}>
                <Text style={styles.savedEmoji}>💪</Text>
                <Text style={styles.savedTitle}>Logged.</Text>
                <Text style={styles.savedText}>Every craving you log makes you stronger.</Text>
              </View>
            ) : (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Log This Craving</Text>
                  <TouchableOpacity onPress={() => setLogModalVisible(false)}>
                    <Ionicons name="close" size={24} color={colors.muted} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalLabel}>WHAT'S TRIGGERING IT?</Text>
                <View style={styles.triggersGrid}>
                  {TRIGGERS.map(t => (
                    <TouchableOpacity
                      key={t.id}
                      style={[styles.triggerChip, selectedTrigger === t.id && styles.triggerChipSelected]}
                      onPress={() => setSelectedTrigger(t.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.triggerEmoji}>{t.emoji}</Text>
                      <Text style={[styles.triggerLabel, selectedTrigger === t.id && styles.triggerLabelSelected]}>
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.modalLabel}>INTENSITY (1-10)</Text>
                <View style={styles.intensityRow}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <TouchableOpacity
                      key={n}
                      style={[styles.intensityDot, intensity >= n && styles.intensityDotActive]}
                      onPress={() => setIntensity(n)}
                      activeOpacity={0.7}
                    />
                  ))}
                </View>
                <Text style={styles.intensityLabel}>
                  {intensity <= 3 ? 'Mild' : intensity <= 6 ? 'Moderate' : intensity <= 8 ? 'Strong' : 'Overwhelming'}
                  {' '}({intensity}/10)
                </Text>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.overcameButton}
                    onPress={() => logCraving(true)}
                    disabled={saving}
                    activeOpacity={0.8}
                  >
                    {saving ? <ActivityIndicator color={colors.white} size="small" /> : (
                      <>
                        <Text style={styles.overcameButtonText}>💪 I Overcame It</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.stillFightingButton}
                    onPress={() => logCraving(false)}
                    disabled={saving}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.stillFightingText}>Still fighting</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Stats Modal */}
      <Modal visible={statsModalVisible} animationType="slide" transparent onRequestClose={() => setStatsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, styles.statsModalCard]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>YOUR PATTERNS</Text>
              <TouchableOpacity onPress={() => setStatsModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.muted} />
              </TouchableOpacity>
            </View>

            {loadingStats ? (
              <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
            ) : !stats ? (
              <Text style={styles.noStatsText}>Not enough data yet. Keep logging cravings.</Text>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.statsIntro}>
                  Based on {stats.total} logged cravings, here's what your data shows:
                </Text>

                {stats.topTrigger && (
                  <View style={styles.insightCard}>
                    <Text style={styles.insightEmoji}>🎯</Text>
                    <View style={styles.insightContent}>
                      <Text style={styles.insightTitle}>Biggest Trigger</Text>
                      <Text style={styles.insightValue}>
                        {TRIGGERS.find(t => t.id === stats.topTrigger.name)?.label || stats.topTrigger.name}
                      </Text>
                      <Text style={styles.insightSub}>{stats.topTrigger.count} times logged</Text>
                    </View>
                  </View>
                )}

                {stats.topDay && (
                  <View style={styles.insightCard}>
                    <Text style={styles.insightEmoji}>📅</Text>
                    <View style={styles.insightContent}>
                      <Text style={styles.insightTitle}>Hardest Day</Text>
                      <Text style={styles.insightValue}>{stats.topDay.name}</Text>
                      <Text style={styles.insightSub}>Most cravings on this day</Text>
                    </View>
                  </View>
                )}

                {stats.topTime && (
                  <View style={styles.insightCard}>
                    <Text style={styles.insightEmoji}>🕐</Text>
                    <View style={styles.insightContent}>
                      <Text style={styles.insightTitle}>Hardest Time</Text>
                      <Text style={styles.insightValue}>{stats.topTime.name}</Text>
                      <Text style={styles.insightSub}>When cravings hit hardest</Text>
                    </View>
                  </View>
                )}

                <View style={styles.insightCard}>
                  <Text style={styles.insightEmoji}>💪</Text>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightTitle}>Win Rate</Text>
                    <Text style={[styles.insightValue, { color: colors.success }]}>{stats.overcameRate}%</Text>
                    <Text style={styles.insightSub}>of cravings you've overcome</Text>
                  </View>
                </View>

                <View style={styles.preparednessCard}>
                  <Text style={styles.preparednessTitle}>Be Prepared</Text>
                  <Text style={styles.preparednessText}>
                    {stats.topDay && stats.topTime
                      ? `Your data shows ${stats.topDay.name} ${stats.topTime.name.toLowerCase()} is your most vulnerable time. Plan ahead for this window — have a strategy ready before it hits.`
                      : 'Keep logging to get personalized preparation advice.'
                    }
                  </Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
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
  viewPatterns: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  quickStats: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  quickStat: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  quickStatNumber: { fontSize: 20, fontWeight: '900', color: colors.white },
  quickStatLabel: { fontSize: 10, color: colors.muted, marginTop: 2, letterSpacing: 1 },
  logButton: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logButtonText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  emptyText: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 10, lineHeight: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  statsModalCard: { maxHeight: '85%' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '900', color: colors.white },
  modalLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 3,
    marginBottom: 12,
    marginTop: 4,
  },
  triggersGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  triggerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  triggerChipSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  triggerEmoji: { fontSize: 16 },
  triggerLabel: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  triggerLabelSelected: { color: colors.white },
  intensityRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  intensityDot: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceLight,
  },
  intensityDotActive: { backgroundColor: colors.accent },
  intensityLabel: { color: colors.muted, fontSize: 12, marginBottom: 20 },
  actionRow: { flexDirection: 'row', gap: 10 },
  overcameButton: {
    flex: 2,
    backgroundColor: colors.success,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  overcameButtonText: { color: colors.white, fontWeight: '900', fontSize: 15 },
  stillFightingButton: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stillFightingText: { color: colors.muted, fontWeight: '700', fontSize: 13 },
  savedContainer: { alignItems: 'center', paddingVertical: 30 },
  savedEmoji: { fontSize: 50, marginBottom: 16 },
  savedTitle: { fontSize: 24, fontWeight: '900', color: colors.white, marginBottom: 8 },
  savedText: { fontSize: 14, color: colors.muted, textAlign: 'center' },
  statsIntro: { color: colors.muted, fontSize: 13, marginBottom: 16, lineHeight: 20 },
  insightCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  insightEmoji: { fontSize: 28 },
  insightContent: { flex: 1 },
  insightTitle: { color: colors.muted, fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 4 },
  insightValue: { color: colors.white, fontSize: 18, fontWeight: '900' },
  insightSub: { color: colors.muted, fontSize: 11, marginTop: 2 },
  preparednessCard: {
    backgroundColor: colors.accent + '22',
    borderRadius: 14,
    padding: 16,
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  preparednessTitle: { color: colors.accent, fontWeight: '900', fontSize: 14, marginBottom: 8 },
  preparednessText: { color: colors.white, fontSize: 13, lineHeight: 20 },
  noStatsText: { color: colors.muted, textAlign: 'center', marginTop: 40, fontSize: 14 },
});
