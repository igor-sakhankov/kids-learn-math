import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZING } from '../../utils/constants';

const Card = ({
  children,
  onPress,
  style,
  variant = 'default',
  padding = true,
}) => {
  const Container = onPress ? TouchableOpacity : View;
  
  const cardStyles = [
    styles.card,
    styles[`card_${variant}`],
    !padding && styles.card_no_padding,
    style,
  ];

  return (
    <Container
      style={cardStyles}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZING.BORDER_RADIUS.large,
    padding: SIZING.PADDING.large,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  card_default: {
    backgroundColor: COLORS.white,
  },
  card_overlay: {
    backgroundColor: COLORS.overlay,
  },
  card_primary: {
    backgroundColor: COLORS.lightBlue,
  },
  card_success: {
    backgroundColor: COLORS.mint,
  },
  card_no_padding: {
    padding: 0,
  },
});

export default Card;

