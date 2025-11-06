import React from 'react';
import { ImageBackground, View, StyleSheet } from 'react-native';

const HERO = {
  uri: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1400&q=80",
};

export default function AuthBackground({ children }) {
  return (
    <ImageBackground source={HERO} style={styles.background} blurRadius={6}>
      <View style={styles.overlay}>
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10, 10, 10, 0.85)",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});