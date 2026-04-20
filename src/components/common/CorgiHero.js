import React, { useEffect, useRef } from 'react';
import { View, Image, Text, Animated, Easing, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../utils/constants';

const CorgiHero = ({ size = 200, sparkles = true }) => {
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bob]);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const ringSize = size + 24;

  return (
    <View style={{ width: ringSize, height: ringSize }}>
      <Animated.View
        style={[
          styles.ring,
          {
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            transform: [{ translateY }],
          },
        ]}
      >
        <Image
          source={require('../../../assets/professor-corgi.jpeg')}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        />
      </Animated.View>
      {sparkles ? (
        <>
          <Text style={[styles.sparkle, { top: -4, right: 4, fontSize: 22 }]}>✨</Text>
          <Text style={[styles.sparkle, { bottom: 10, left: -6, fontSize: 18 }]}>⭐</Text>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  ring: {
    backgroundColor: COLORS.white,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.pop,
  },
  sparkle: {
    position: 'absolute',
  },
});

export default CorgiHero;
