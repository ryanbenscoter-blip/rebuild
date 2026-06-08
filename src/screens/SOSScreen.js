import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const RYAN_MESSAGES = [
  "Stop. Breathe. You don't have to drink right now.\n\nThis feeling is not permanent. I promise you that. I've been exactly where you are — the craving feels like it will last forever. It won't.\n\nYou have made it this far. Don't let one moment erase that.",
  "I know this is hard. That's not a weakness — that's just what this is.\n\nThe fact that you hit this button instead of drinking? That's strength. Real strength.\n\nSit with me for a minute. Breathe. Let it pass.",
  "Cravings peak and pass in 15-20 minutes. That's science.\n\nYou just need to outlast this one moment. Not forever. Not tomorrow. Just right now.\n\nYou've done hard things before. This is just another one.",
];

const BREATHING_STEPS = [
  { label: 'Breathe In', duration: 4, color: colors.accent },
  { label: 'Hold', duration: 4, color: colors.gold },
  { label: 'Breathe Out', duration: 6, color: '#4A90D9' },
  { label: 'Hold', duration: 2, color: colors.muted },
];

export default function SOSScreen({ onClose }) {
  const [tab, setTab] = useState('message');
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathStep, setBreathStep] = useState(0);
  const [countdown, setCountdown] = useState(BREATHING_STEPS[0].duration);
  const [survived, setSurvived] = useState(false);
  const breathScale = useRef(new Animated.Value(1)).current;
  const messageIndex = useRef(Math.floor(Math.random() * RYAN_MESSAGES.length)).current;
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function startBreathing() {
    setBreathingActive(true);
    setBreathStep(0);
    setCountdown(BREATHING_STEPS[0].duration);
    runBreathCycle(0, BREATHING_STEPS[0].duration);
  }

  function runBreathCycle(stepIndex, seconds) {
    const step = BREATHING_STEPS[stepIndex];

    if (stepIndex === 0 || stepIndex === 2) {
      Animated.timing(breathScale, {
        toValue: stepIndex === 0 ? 1.6 : 0.8,
        duration: step.duration * 1000,
        useNativeDriver: true,
      }).start();
    }

    let remaining = seconds;
    intervalRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        const next = (stepIndex + 1) % BREATHING_STEPS.length;
        setBreathStep(next);
        const nextDuration = BREATHING_STEPS[next].duration;
        setCountdown(nextDuration);
        runBreathCycle(next, nextDuration);
      }
    }, 1000);
  }

  function stopBreathing() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setBreathingActive(false);
    breathScale.setValue(1);
  }

  function handleSurvived() {
    setSurvived(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  }

  function callHotline() {
    Alert.alert(
      'SAMHSA Helpline',
      '1-800-662-4357 — Free, confidential, 24/7 treatment referral and information.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => Linking.openURL('tel:18006624357') },
      ]
    );
  }

  if (survived) {
    return (
      <View style={styles.survivedContainer}>
        <Text style={styles.survivedEmoji}>💪</Text>
        <Text style={styles.survivedTitle}>You made it through.</Text>
        <Text style={styles.survivedText}>That was real strength. Log this as a win.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>YOU'VE GOT THIS</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.muted} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {[
          { id: 'message', label: 'Ryan', icon: 'person' },
          { id: 'breathe', label: 'Breathe', icon: 'leaf' },
          { id: 'help', label: 'Get Help', icon: 'call' },
        ].map(t => (
          <TouchableOpacity
            key={t.id}
            style={[styles.tab, tab === t.id && styles.tabActive]}
            onPress={() => { setTab(t.id); stopBreathing(); }}
            activeOpacity={0.7}
          >
            <Ionicons name={t.icon} size={18} color={tab === t.id ? colors.white : colors.muted} />
            <Text style={[styles.tabText, tab === t.id && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'message' && (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.ryanCard}>
            <View style={styles.ryanHeader}>
              <View style={styles.ryanAvatar}>
                <Text style={styles.ryanAvatarText}>R</Text>
              </View>
              <View>
                <Text style={styles.ryanName}>Ryan</Text>
                <Text style={styles.ryanSub}>Here with you right now</Text>
              </View>
            </View>
            <Text style={styles.ryanMessage}>{RYAN_MESSAGES[messageIndex]}</Text>
          </View>

          <View style={styles.reminderCard}>
            <Text style={styles.reminderTitle}>Remember why you started.</Text>
            <Text style={styles.reminderText}>
              This craving will peak and pass in 15-20 minutes.{'\n'}
              You only have to get through right now.
            </Text>
          </View>

          <TouchableOpacity style={styles.survivedButton} onPress={handleSurvived} activeOpacity={0.8}>
            <Text style={styles.survivedButtonText}>I MADE IT THROUGH 💪</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {tab === 'breathe' && (
        <View style={styles.content}>
          <Text style={styles.breatheIntro}>
            Box breathing interrupts the anxiety cycle and reduces cravings. Do this for 2 minutes.
          </Text>

          <View style={styles.breathCircleContainer}>
            <Animated.View
              style={[
                styles.breathCircle,
                {
                  transform: [{ scale: breathScale }],
                  backgroundColor: breathingActive
                    ? BREATHING_STEPS[breathStep].color + '33'
                    : colors.surface,
                  borderColor: breathingActive
                    ? BREATHING_STEPS[breathStep].color
                    : colors.border,
                },
              ]}
            >
              {breathingActive ? (
                <>
                  <Text style={[styles.breathLabel, { color: BREATHING_STEPS[breathStep].color }]}>
                    {BREATHING_STEPS[breathStep].label}
                  </Text>
                  <Text style={styles.breathCountdown}>{countdown}</Text>
                </>
              ) : (
                <Text style={styles.breathStart}>TAP TO{'\n'}START</Text>
              )}
            </Animated.View>
          </View>

          {!breathingActive ? (
            <TouchableOpacity style={styles.breathButton} onPress={startBreathing} activeOpacity={0.8}>
              <Text style={styles.breathButtonText}>START BREATHING EXERCISE</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.breathStopButton} onPress={stopBreathing} activeOpacity={0.8}>
              <Text style={styles.breathStopText}>STOP</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.survivedButton} onPress={handleSurvived} activeOpacity={0.8}>
            <Text style={styles.survivedButtonText}>I MADE IT THROUGH 💪</Text>
          </TouchableOpacity>
        </View>
      )}

      {tab === 'help' && (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.helpIntro}>
            You don't have to do this alone. Reach out right now.
          </Text>

          <TouchableOpacity style={styles.helpCard} onPress={callHotline} activeOpacity={0.8}>
            <View style={styles.helpCardLeft}>
              <Text style={styles.helpCardEmoji}>📞</Text>
              <View>
                <Text style={styles.helpCardTitle}>SAMHSA Helpline</Text>
                <Text style={styles.helpCardSub}>Free · Confidential · 24/7</Text>
                <Text style={styles.helpCardNumber}>1-800-662-4357</Text>
              </View>
            </View>
            <Ionicons name="call" size={20} color={colors.accent} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.helpCard}
            onPress={() => Linking.openURL('sms:741741?body=HELLO')}
            activeOpacity={0.8}
          >
            <View style={styles.helpCardLeft}>
              <Text style={styles.helpCardEmoji}>💬</Text>
              <View>
                <Text style={styles.helpCardTitle}>Crisis Text Line</Text>
                <Text style={styles.helpCardSub}>Text HOME to 741741</Text>
                <Text style={styles.helpCardNumber}>Free · 24/7 · Confidential</Text>
              </View>
            </View>
            <Ionicons name="chatbubble" size={20} color={colors.accent} />
          </TouchableOpacity>

          <View style={styles.partnerCard}>
            <Ionicons name="handshake-outline" size={28} color={colors.accent} />
            <Text style={styles.partnerCardTitle}>Message Your Partner</Text>
            <Text style={styles.partnerCardSub}>
              Your accountability partner is there for exactly this moment.
            </Text>
            <TouchableOpacity style={styles.partnerButton} activeOpacity={0.8}>
              <Text style={styles.partnerButtonText}>SEND SOS TO PARTNER</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.survivedButton} onPress={handleSurvived} activeOpacity={0.8}>
            <Text style={styles.survivedButtonText}>I MADE IT THROUGH 💪</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 4,
  },
  closeButton: { padding: 4 },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  tabText: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  tabTextActive: { color: colors.white },
  content: { padding: 20, paddingBottom: 40 },
  ryanCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ryanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  ryanAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ryanAvatarText: { color: colors.white, fontWeight: '900', fontSize: 20 },
  ryanName: { color: colors.white, fontWeight: '800', fontSize: 15 },
  ryanSub: { color: colors.accent, fontSize: 12, marginTop: 2 },
  ryanMessage: { color: colors.white, fontSize: 15, lineHeight: 26 },
  reminderCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reminderTitle: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 15,
    marginBottom: 8,
  },
  reminderText: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  survivedButton: {
    backgroundColor: colors.success,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  survivedButtonText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
  survivedContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  survivedEmoji: { fontSize: 80, marginBottom: 24 },
  survivedTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  survivedText: { fontSize: 16, color: colors.muted, textAlign: 'center' },
  breatheIntro: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 30,
  },
  breathCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    height: 200,
  },
  breathCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathLabel: { fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  breathCountdown: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.white,
    marginTop: 4,
  },
  breathStart: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
  },
  breathButton: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  breathButtonText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 2,
  },
  breathStopButton: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  breathStopText: { color: colors.muted, fontWeight: '900', fontSize: 14, letterSpacing: 2 },
  helpIntro: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  helpCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  helpCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  helpCardEmoji: { fontSize: 28 },
  helpCardTitle: { color: colors.white, fontWeight: '800', fontSize: 15 },
  helpCardSub: { color: colors.muted, fontSize: 12, marginTop: 2 },
  helpCardNumber: { color: colors.accent, fontSize: 13, fontWeight: '700', marginTop: 2 },
  partnerCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  partnerCardTitle: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  partnerCardSub: {
    color: colors.muted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  partnerButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  partnerButtonText: { color: colors.white, fontWeight: '900', fontSize: 13, letterSpacing: 2 },
});
