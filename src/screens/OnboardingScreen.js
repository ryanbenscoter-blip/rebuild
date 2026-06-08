import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

const COSTS = [
  { id: 'relationships', label: 'My relationships', emoji: '💔' },
  { id: 'health', label: 'My health', emoji: '🫀' },
  { id: 'money', label: 'My money', emoji: '💸' },
  { id: 'job', label: 'My career', emoji: '💼' },
  { id: 'selfrespect', label: 'My self-respect', emoji: '🪞' },
  { id: 'time', label: 'Years of my life', emoji: '⏳' },
  { id: 'family', label: 'My family', emoji: '👨‍👩‍👧' },
  { id: 'mental', label: 'My mental health', emoji: '🧠' },
];

const TRIGGERS = [
  { id: 'stress', label: 'Stress', emoji: '😤' },
  { id: 'loneliness', label: 'Loneliness', emoji: '😔' },
  { id: 'social', label: 'Social situations', emoji: '🍻' },
  { id: 'boredom', label: 'Boredom', emoji: '😶' },
  { id: 'anxiety', label: 'Anxiety', emoji: '😰' },
  { id: 'habit', label: 'Just habit', emoji: '🔄' },
];

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [selectedCosts, setSelectedCosts] = useState([]);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [sobrietyDate, setSobrietyDate] = useState('');
  const [startingToday, setStartingToday] = useState(null);
  const [pledgeName, setPledgeName] = useState('');
  const [saving, setSaving] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  function goNext() {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    setStep(s => s + 1);
  }

  function toggleCost(id) {
    setSelectedCosts(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  }

  function toggleTrigger(id) {
    setSelectedTriggers(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  }

  async function handleComplete() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const finalDate = startingToday
        ? new Date().toISOString().split('T')[0]
        : sobrietyDate;

      await supabase.from('profiles').update({
        sobriety_date: finalDate || null,
      }).eq('id', user.id);
    }
    setSaving(false);
    onComplete();
  }

  const steps = [
    <StepHook onNext={goNext} />,
    <StepCosts selected={selectedCosts} onToggle={toggleCost} onNext={goNext} />,
    <StepTriggers selected={selectedTriggers} onToggle={toggleTrigger} onNext={goNext} />,
    <StepMeetRyan onNext={goNext} />,
    <StepSobrietyDate
      startingToday={startingToday}
      setStartingToday={setStartingToday}
      sobrietyDate={sobrietyDate}
      setSobrietyDate={setSobrietyDate}
      onNext={goNext}
    />,
    <StepPledge pledgeName={pledgeName} setPledgeName={setPledgeName} onNext={goNext} />,
    <StepWelcome onComplete={handleComplete} saving={saving} />,
  ];

  const progress = (step / (steps.length - 1)) * 100;

  return (
    <SafeAreaView style={styles.safe}>
      {step > 0 && step < steps.length - 1 && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      )}
      <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
        {steps[step]}
      </Animated.View>
    </SafeAreaView>
  );
}

function StepHook({ onNext }) {
  return (
    <View style={styles.centerStep}>
      <Text style={styles.hookEmoji}>🔥</Text>
      <Text style={styles.hookTitle}>You already know{'\n'}something has{'\n'}to change.</Text>
      <Text style={styles.hookSubtitle}>
        You wouldn't be here if you didn't. That instinct is right. Trust it.
      </Text>
      <Text style={styles.hookBody}>
        Rebuild is not a tracker. It's not a course.{'\n'}
        It's a community built by someone who{'\n'}
        actually did the hard thing — and wants{'\n'}
        to help you do it too.
      </Text>
      <TouchableOpacity style={styles.primaryButton} onPress={onNext} activeOpacity={0.8}>
        <Text style={styles.primaryButtonText}>I'M READY</Text>
      </TouchableOpacity>
    </View>
  );
}

function StepCosts({ selected, onToggle, onNext }) {
  return (
    <KeyboardAvoidingView style={styles.scrollStep} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.stepLabel}>STEP 1 OF 5</Text>
        <Text style={styles.stepTitle}>What has drinking{'\n'}cost you?</Text>
        <Text style={styles.stepSubtitle}>Select everything that applies. Be honest — this is just for you.</Text>

        <View style={styles.grid}>
          {COSTS.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.gridItem, selected.includes(item.id) && styles.gridItemSelected]}
              onPress={() => onToggle(item.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.gridEmoji}>{item.emoji}</Text>
              <Text style={[styles.gridLabel, selected.includes(item.id) && styles.gridLabelSelected]}>
                {item.label}
              </Text>
              {selected.includes(item.id) && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark" size={12} color={colors.white} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, selected.length === 0 && styles.primaryButtonMuted]}
          onPress={onNext}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>
            {selected.length === 0 ? 'SKIP' : 'CONTINUE'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function StepTriggers({ selected, onToggle, onNext }) {
  return (
    <View style={styles.scrollStep}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.stepLabel}>STEP 2 OF 5</Text>
        <Text style={styles.stepTitle}>What usually{'\n'}triggers you?</Text>
        <Text style={styles.stepSubtitle}>
          Knowing your triggers is half the battle. We'll help you prepare for them.
        </Text>

        <View style={styles.grid}>
          {TRIGGERS.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.gridItem, selected.includes(item.id) && styles.gridItemSelected]}
              onPress={() => onToggle(item.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.gridEmoji}>{item.emoji}</Text>
              <Text style={[styles.gridLabel, selected.includes(item.id) && styles.gridLabelSelected]}>
                {item.label}
              </Text>
              {selected.includes(item.id) && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark" size={12} color={colors.white} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={onNext} activeOpacity={0.8}>
          <Text style={styles.primaryButtonText}>CONTINUE</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function StepMeetRyan({ onNext }) {
  return (
    <View style={styles.centerStep}>
      <View style={styles.ryanAvatar}>
        <Text style={styles.ryanAvatarText}>R</Text>
      </View>
      <Text style={styles.stepLabel}>STEP 3 OF 5</Text>
      <Text style={styles.stepTitle}>I've been{'\n'}where you are.</Text>
      <View style={styles.ryanCard}>
        <Text style={styles.ryanQuote}>
          "I was a heavy drinker and drug user for years. Getting sober was the hardest thing I ever did — and the best thing I ever did.
          {'\n\n'}
          I built Rebuild because I know what it takes. Not from a textbook. From living it.
          {'\n\n'}
          I show up in this app every single day. Because someone showed up for me, and now I want to show up for you."
        </Text>
        <Text style={styles.ryanName}>— Ryan</Text>
      </View>
      <TouchableOpacity style={styles.primaryButton} onPress={onNext} activeOpacity={0.8}>
        <Text style={styles.primaryButtonText}>I'M IN</Text>
      </TouchableOpacity>
    </View>
  );
}

function StepSobrietyDate({ startingToday, setStartingToday, sobrietyDate, setSobrietyDate, onNext }) {
  const canContinue = startingToday !== null;

  return (
    <KeyboardAvoidingView
      style={styles.scrollStep}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.stepLabel}>STEP 4 OF 5</Text>
        <Text style={styles.stepTitle}>When does{'\n'}your journey start?</Text>

        <TouchableOpacity
          style={[styles.dateOption, startingToday === true && styles.dateOptionSelected]}
          onPress={() => setStartingToday(true)}
          activeOpacity={0.8}
        >
          <View style={styles.dateOptionLeft}>
            <Text style={styles.dateOptionEmoji}>🌅</Text>
            <View>
              <Text style={[styles.dateOptionTitle, startingToday === true && styles.dateOptionTitleSelected]}>
                Today is Day 1
              </Text>
              <Text style={styles.dateOptionSub}>I'm starting right now</Text>
            </View>
          </View>
          {startingToday === true && <Ionicons name="checkmark-circle" size={24} color={colors.accent} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dateOption, startingToday === false && styles.dateOptionSelected]}
          onPress={() => setStartingToday(false)}
          activeOpacity={0.8}
        >
          <View style={styles.dateOptionLeft}>
            <Text style={styles.dateOptionEmoji}>📅</Text>
            <View>
              <Text style={[styles.dateOptionTitle, startingToday === false && styles.dateOptionTitleSelected]}>
                I already started
              </Text>
              <Text style={styles.dateOptionSub}>I have a sobriety date</Text>
            </View>
          </View>
          {startingToday === false && <Ionicons name="checkmark-circle" size={24} color={colors.accent} />}
        </TouchableOpacity>

        {startingToday === false && (
          <View style={styles.dateInputContainer}>
            <Text style={styles.dateInputLabel}>YOUR SOBRIETY DATE</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="YYYY-MM-DD  e.g. 2024-01-15"
              placeholderTextColor={colors.muted}
              value={sobrietyDate}
              onChangeText={setSobrietyDate}
              keyboardType="numbers-and-punctuation"
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.primaryButton, !canContinue && styles.primaryButtonMuted]}
          onPress={canContinue ? onNext : null}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>CONTINUE</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function StepPledge({ pledgeName, setPledgeName, onNext }) {
  return (
    <KeyboardAvoidingView
      style={styles.centerStep}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.stepLabel}>STEP 5 OF 5</Text>
      <Text style={styles.stepTitle}>Make the{'\n'}commitment.</Text>
      <Text style={styles.stepSubtitle}>
        Something changes when you write your name to something. This is your pledge.
      </Text>

      <View style={styles.pledgeCard}>
        <Text style={styles.pledgeText}>
          "I am done letting alcohol run my life.{'\n'}
          I am choosing to rebuild — one day at a time."
        </Text>
        <View style={styles.pledgeSignLine}>
          <TextInput
            style={styles.pledgeInput}
            placeholder="Sign your name here"
            placeholderTextColor={colors.muted}
            value={pledgeName}
            onChangeText={setPledgeName}
            autoCapitalize="words"
          />
          <View style={styles.signatureLine} />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, !pledgeName.trim() && styles.primaryButtonMuted]}
        onPress={pledgeName.trim() ? onNext : null}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>I COMMIT TO THIS</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

function StepWelcome({ onComplete, saving }) {
  return (
    <View style={styles.centerStep}>
      <Text style={styles.welcomeEmoji}>🔥</Text>
      <Text style={styles.welcomeTitle}>Welcome to{'\n'}Rebuild.</Text>
      <Text style={styles.welcomeSubtitle}>
        Your counter is running. Ryan shows up every day. Your community is waiting.
      </Text>

      <View style={styles.welcomeItems}>
        {[
          { emoji: '⚡', text: 'Daily content from Ryan' },
          { emoji: '👥', text: 'A community that gets it' },
          { emoji: '🤝', text: 'An accountability partner' },
          { emoji: '🏆', text: 'Milestones to celebrate' },
        ].map(item => (
          <View key={item.text} style={styles.welcomeItem}>
            <Text style={styles.welcomeItemEmoji}>{item.emoji}</Text>
            <Text style={styles.welcomeItemText}>{item.text}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={onComplete}
        disabled={saving}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>
          {saving ? 'LOADING...' : "LET'S GO"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  progressBar: {
    height: 3,
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 2,
  },
  progressFill: {
    height: 3,
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  stepContainer: { flex: 1 },
  centerStep: {
    flex: 1,
    padding: 28,
    justifyContent: 'center',
  },
  scrollStep: { flex: 1 },
  scrollContent: { padding: 28, paddingBottom: 40 },
  hookEmoji: { fontSize: 56, marginBottom: 24, textAlign: 'center' },
  hookTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: colors.white,
    lineHeight: 44,
    marginBottom: 20,
  },
  hookSubtitle: {
    fontSize: 18,
    color: colors.accent,
    fontWeight: '600',
    lineHeight: 26,
    marginBottom: 16,
  },
  hookBody: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 24,
    marginBottom: 40,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 3,
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.white,
    lineHeight: 40,
    marginBottom: 12,
  },
  stepSubtitle: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
    marginBottom: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  gridItem: {
    width: (width - 76) / 2,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  gridItemSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.surfaceLight,
  },
  gridEmoji: { fontSize: 24, marginBottom: 8 },
  gridLabel: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  gridLabelSelected: { color: colors.white },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ryanAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  ryanAvatarText: { fontSize: 36, fontWeight: '900', color: colors.white },
  ryanCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ryanQuote: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  ryanName: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: 14,
    marginTop: 12,
  },
  dateOption: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateOptionSelected: { borderColor: colors.accent },
  dateOptionLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  dateOptionEmoji: { fontSize: 28 },
  dateOptionTitle: { color: colors.muted, fontWeight: '700', fontSize: 16 },
  dateOptionTitleSelected: { color: colors.white },
  dateOptionSub: { color: colors.muted, fontSize: 12, marginTop: 2 },
  dateInputContainer: { marginBottom: 16 },
  dateInputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 3,
    marginBottom: 8,
  },
  dateInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    color: colors.white,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pledgeCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    marginVertical: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pledgeText: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 26,
    fontStyle: 'italic',
    marginBottom: 24,
  },
  pledgeSignLine: { gap: 8 },
  pledgeInput: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
    padding: 4,
  },
  signatureLine: {
    height: 1,
    backgroundColor: colors.accent,
  },
  welcomeEmoji: { fontSize: 64, textAlign: 'center', marginBottom: 20 },
  welcomeTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.white,
    textAlign: 'center',
    lineHeight: 46,
    marginBottom: 16,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  welcomeItems: { gap: 14, marginBottom: 40 },
  welcomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  welcomeItemEmoji: { fontSize: 24 },
  welcomeItemText: { color: colors.white, fontSize: 15, fontWeight: '600' },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonMuted: { opacity: 0.4 },
  primaryButtonText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 3,
  },
});
