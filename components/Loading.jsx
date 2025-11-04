import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export default function Loading({ text = "Cargando..." }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#e50914" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { marginTop: 20, justifyContent: "center", alignItems: "center" },
  text: { marginTop: 8, color: "#fff" },
});


