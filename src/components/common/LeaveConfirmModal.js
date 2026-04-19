import React from 'react';
import { View, Text, Modal, StyleSheet, Pressable } from 'react-native';
import Button from './Button';
import { t } from '../../utils/i18n';
import { COLORS, SIZING, TYPOGRAPHY, SHADOWS } from '../../utils/constants';

// Gentle confirmation used before leaving a lesson or game mid-session.
// Two huge labeled buttons — no `×` closer — per UX rule U13.
const LeaveConfirmModal = ({ visible, onStay, onLeave }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onStay}
  >
    <Pressable style={styles.backdrop} onPress={onStay}>
      <Pressable style={styles.card} onPress={() => {}}>
        <Text style={styles.emoji}>🤖</Text>
        <Text style={styles.title}>{t('leave.title')}</Text>
        <Text style={styles.message}>{t('leave.message')}</Text>
        <Button
          title={t('leave.stay')}
          onPress={onStay}
          variant="primary"
          size="large"
          icon="▶️"
          style={styles.stayButton}
        />
        <Button
          title={t('leave.leave')}
          onPress={onLeave}
          variant="outline"
          size="small"
          style={styles.leaveButton}
        />
      </Pressable>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 42, 68, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZING.PADDING.large,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZING.BORDER_RADIUS.xlarge,
    padding: SIZING.PADDING.xlarge,
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
    ...SHADOWS.pop,
  },
  emoji: {
    fontSize: 72,
    marginBottom: SIZING.MARGIN.small,
  },
  title: {
    fontSize: TYPOGRAPHY.SIZES.title,
    fontWeight: TYPOGRAPHY.WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZING.MARGIN.small,
  },
  message: {
    fontSize: TYPOGRAPHY.SIZES.body,
    color: COLORS.textSoft,
    textAlign: 'center',
    marginBottom: SIZING.MARGIN.large,
  },
  stayButton: {
    minWidth: 220,
    marginBottom: SIZING.MARGIN.medium,
  },
  leaveButton: {
    minWidth: 180,
  },
});

export default LeaveConfirmModal;
