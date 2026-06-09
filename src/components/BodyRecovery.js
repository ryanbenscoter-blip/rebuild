import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const RECOVERY_STAGES = [
  {
    id: 1,
    hours: 12,
    days: 0.5,
    title: 'Heart Rate Stabilizing',
    shortDesc: 'Your heart rate and blood pressure begin to normalize.',
    fullDesc: `Within 12-24 hours of your last drink, your heart rate begins to drop back to normal levels. Alcohol artificially elevates your heart rate and blood pressure — now your cardiovascular system starts to recover.\n\nYour blood sugar, which alcohol throws wildly out of balance, begins stabilizing. You may feel shaky or anxious — that's your body recalibrating. It will pass.\n\nThis is the hardest window. Your body is in shock from the absence of something it depended on. Push through.`,
    icon: '❤️',
    system: 'Heart',
    color: '#E85555',
  },
  {
    id: 2,
    hours: 48,
    days: 2,
    title: 'Alcohol Leaves Your Body',
    shortDesc: 'Alcohol is fully cleared from your bloodstream.',
    fullDesc: `By 48-72 hours, alcohol has been completely metabolized and cleared from your blood. Your liver — which was working overtime processing toxins — gets its first real break.\n\nThis is often when withdrawal symptoms peak for heavy drinkers. If you're experiencing severe symptoms, please reach out to a medical professional.\n\nFor most people, this is when the fog starts to lift slightly. The first sign that your brain is coming back online.`,
    icon: '🩸',
    system: 'Blood',
    color: '#E85555',
  },
  {
    id: 3,
    hours: 168,
    days: 7,
    title: 'Sleep is Improving',
    shortDesc: 'Your sleep cycles begin to restore and deepen.',
    fullDesc: `Alcohol destroys sleep quality. It suppresses REM sleep — the deep, restorative sleep your brain needs to process emotions, form memories, and repair itself.\n\nAt one week sober, your sleep cycles begin to normalize. You may actually sleep worse for a few days first (your brain is rebalancing) but then experience deeper, more vivid sleep than you've had in years.\n\nYour body is also fully rehydrated for the first time in a while. Alcohol is a diuretic — it was dehydrating you constantly. That fog is lifting.`,
    icon: '😴',
    system: 'Sleep',
    color: '#7B68EE',
  },
  {
    id: 4,
    hours: 336,
    days: 14,
    title: 'Liver Repair Begins',
    shortDesc: 'Your liver starts serious cellular repair.',
    fullDesc: `The liver is remarkable. After two weeks without alcohol, it begins active cellular repair — regenerating damaged tissue and clearing accumulated fat.\n\nAlcohol causes fat to build up in liver cells (fatty liver disease). At two weeks, this process begins to reverse. Your liver enzyme levels, if tested, would already be dropping toward normal.\n\nYou may notice your digestion improving, less bloating, and more stable energy throughout the day. That's your liver doing its job again.`,
    icon: '🫀',
    system: 'Liver',
    color: '#E8622A',
  },
  {
    id: 5,
    hours: 720,
    days: 30,
    title: 'Skin & Blood Pressure',
    shortDesc: 'Your skin is clearing. Blood pressure normalizing.',
    fullDesc: `30 days is a massive milestone — and your body knows it.\n\nBlood pressure: Alcohol chronically elevates blood pressure. At 30 days, it's measurably lower — reducing your risk of stroke and heart attack.\n\nSkin: Alcohol dehydrates skin and causes inflammation. At 30 days, people consistently report clearer skin, reduced puffiness (especially around the face), and a healthier complexion.\n\nWeight: Many people lose 5-10 lbs in the first month simply from cutting alcohol calories and reducing water retention.\n\nYou should be feeling and looking noticeably different right now.`,
    icon: '✨',
    system: 'Skin & Heart',
    color: '#F0A500',
  },
  {
    id: 6,
    hours: 2160,
    days: 90,
    title: 'Brain Chemistry Healing',
    shortDesc: 'Dopamine receptors begin to repair and rebalance.',
    fullDesc: `This is one of the most profound changes — and the most important for long-term sobriety.\n\nAlcohol hijacks your brain's dopamine system. It floods your brain with dopamine artificially, which causes your brain to downregulate its own dopamine receptors. This is why everything feels flat and joyless in early sobriety — your brain literally has fewer pleasure receptors than normal.\n\nAt 90 days, your dopamine receptors are measurably recovering. Things start to feel good again — food, music, exercise, connection. Natural pleasures return.\n\nThis is why 90 days is the most celebrated milestone in recovery. Your brain is coming back.`,
    icon: '🧠',
    system: 'Brain',
    color: '#4A90D9',
  },
  {
    id: 7,
    hours: 4320,
    days: 180,
    title: 'Liver Fat Significantly Reduced',
    shortDesc: 'Fatty liver disease is reversing. Liver function near normal.',
    fullDesc: `At six months, your liver has undergone significant healing. Fatty liver disease — present in nearly all heavy drinkers — has largely reversed for most people.\n\nLiver enzymes are typically back in the normal range. The organ that was working hardest to keep you alive is now functioning close to how it was designed to.\n\nYour immune system, which is closely tied to liver function, is also stronger. You may notice you're getting sick less often and recovering faster.`,
    icon: '💚',
    system: 'Liver',
    color: '#4CAF50',
  },
  {
    id: 8,
    hours: 8760,
    days: 365,
    title: 'One Year: Brain Volume Recovering',
    shortDesc: 'Your brain is physically growing back. Cancer risk dropping.',
    fullDesc: `This is extraordinary — and most people don't know it's possible.\n\nAlcohol physically shrinks brain tissue. Heavy drinking causes measurable loss of gray matter. At one year sober, brain imaging studies show actual recovery of brain volume — your brain is physically growing back.\n\nCognitive function, memory, and decision-making continue to improve. Many people report this as the year they "got their mind back."\n\nCancer risk: Alcohol is a Group 1 carcinogen. At one year, your risk of alcohol-related cancers (mouth, throat, liver, breast) is meaningfully reduced.\n\nYou are a different person physically than you were 365 days ago.`,
    icon: '👑',
    system: 'Brain & Cancer Risk',
    color: colors.gold,
  },
  {
    id: 9,
    hours: 17520,
    days: 730,
    title: 'Two Years: Full Restoration',
    shortDesc: 'Liver largely restored. Peak mental clarity.',
    fullDesc: `Two years. This is where the science gets remarkable.\n\nFor most people who were heavy drinkers, the liver is largely restored to healthy function at two years. The organ that was on the edge of failure is now working as it should.\n\nBrain: The cognitive recovery continues. Working memory, processing speed, and emotional regulation are at their peak. Many people describe two years sober as when they feel truly, completely themselves — often for the first time in their adult lives.\n\nThis is what you're working toward. Every single day is building toward this.`,
    icon: '🔥',
    system: 'Full Body',
    color: colors.accent,
  },
];

export default function BodyRecovery({ totalDays }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);

  const currentStage = RECOVERY_STAGES.filter(s => totalDays >= s.days).pop();
  const nextStage = RECOVERY_STAGES.find(s => totalDays < s.days);

  const progressPercent = nextStage
    ? Math.min(100, ((totalDays - (currentStage?.days || 0)) / (nextStage.days - (currentStage?.days || 0))) * 100)
    : 100;

  const visibleStages = expanded ? RECOVERY_STAGES : RECOVERY_STAGES.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.sectionTitle}>YOUR BODY RIGHT NOW</Text>
          <Text style={styles.sectionSub}>
            {currentStage ? currentStage.title : 'Recovery starting...'}
          </Text>
        </View>
        <View style={styles.stageCount}>
          <Text style={styles.stageCountText}>
            {RECOVERY_STAGES.filter(s => totalDays >= s.days).length}/{RECOVERY_STAGES.length}
          </Text>
          <Text style={styles.stageCountLabel}>unlocked</Text>
        </View>
      </View>

      {nextStage && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: nextStage.color }]} />
          </View>
          <Text style={styles.progressText}>
            {Math.ceil(nextStage.days - totalDays)} days until: {nextStage.title}
          </Text>
        </View>
      )}

      {visibleStages.map(stage => {
        const unlocked = totalDays >= stage.days;
        const isCurrent = currentStage?.id === stage.id;

        return (
          <TouchableOpacity
            key={stage.id}
            style={[
              styles.stageRow,
              unlocked && styles.stageRowUnlocked,
              isCurrent && styles.stageRowCurrent,
            ]}
            onPress={() => unlocked && setSelectedStage(stage)}
            activeOpacity={unlocked ? 0.7 : 1}
          >
            <View style={[styles.stageIcon, { backgroundColor: unlocked ? stage.color + '22' : colors.surfaceLight }]}>
              <Text style={styles.stageEmoji}>{unlocked ? stage.icon : '🔒'}</Text>
            </View>
            <View style={styles.stageContent}>
              <View style={styles.stageTitleRow}>
                <Text style={[styles.stageTitle, !unlocked && styles.stageTitleLocked]}>
                  {stage.title}
                </Text>
                {isCurrent && (
                  <View style={styles.nowBadge}>
                    <Text style={styles.nowBadgeText}>NOW</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.stageDesc, !unlocked && styles.stageDescLocked]}>
                {unlocked ? stage.shortDesc : `Unlocks at ${stage.days} days`}
              </Text>
            </View>
            {unlocked && (
              <Ionicons name="chevron-forward" size={16} color={stage.color} />
            )}
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={styles.showMore}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.showMoreText}>
          {expanded ? 'Show less' : `Show all ${RECOVERY_STAGES.length} recovery stages`}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={14}
          color={colors.accent}
        />
      </TouchableOpacity>

      <Modal
        visible={!!selectedStage}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedStage(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setSelectedStage(null)}>
                  <Ionicons name="close" size={24} color={colors.muted} />
                </TouchableOpacity>
              </View>
              {selectedStage && (
                <>
                  <View style={[styles.modalIconContainer, { backgroundColor: selectedStage.color + '22' }]}>
                    <Text style={styles.modalEmoji}>{selectedStage.emoji}</Text>
                  </View>
                  <View style={[styles.modalBadge, { backgroundColor: selectedStage.color + '22' }]}>
                    <Text style={[styles.modalBadgeText, { color: selectedStage.color }]}>
                      {selectedStage.system}
                    </Text>
                  </View>
                  <Text style={styles.modalTitle}>{selectedStage.title}</Text>
                  <Text style={styles.modalBody}>{selectedStage.fullDesc}</Text>
                  <View style={styles.modalUnlocked}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                    <Text style={styles.modalUnlockedText}>
                      You unlocked this at {selectedStage.days} days sober
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 3,
  },
  sectionSub: {
    fontSize: 13,
    color: colors.white,
    fontWeight: '600',
    marginTop: 4,
  },
  stageCount: { alignItems: 'center' },
  stageCountText: { fontSize: 20, fontWeight: '900', color: colors.white },
  stageCountLabel: { fontSize: 10, color: colors.muted, letterSpacing: 1 },
  progressContainer: { marginBottom: 14 },
  progressBar: {
    height: 4,
    backgroundColor: colors.surfaceLight,
    borderRadius: 2,
    marginBottom: 6,
  },
  progressFill: { height: 4, borderRadius: 2 },
  progressText: { fontSize: 11, color: colors.muted },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: colors.surfaceLight,
    opacity: 0.5,
    gap: 12,
  },
  stageRowUnlocked: { opacity: 1 },
  stageRowCurrent: {
    borderWidth: 1,
    borderColor: colors.accent,
    opacity: 1,
  },
  stageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageEmoji: { fontSize: 20 },
  stageContent: { flex: 1 },
  stageTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  stageTitle: { color: colors.white, fontWeight: '700', fontSize: 13, flex: 1 },
  stageTitleLocked: { color: colors.muted },
  nowBadge: {
    backgroundColor: colors.accent,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  nowBadgeText: { color: colors.white, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  stageDesc: { color: colors.muted, fontSize: 11, lineHeight: 16 },
  stageDescLocked: { color: colors.border },
  showMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 4,
  },
  showMoreText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 48,
    maxHeight: '85%',
  },
  modalHeader: { alignItems: 'flex-end', marginBottom: 16 },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalEmoji: { fontSize: 40 },
  modalBadge: {
    alignSelf: 'center',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 12,
  },
  modalBadgeText: { fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalBody: {
    fontSize: 15,
    color: colors.white,
    lineHeight: 26,
    marginBottom: 24,
  },
  modalUnlocked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 14,
  },
  modalUnlockedText: { color: colors.muted, fontSize: 13 },
});
