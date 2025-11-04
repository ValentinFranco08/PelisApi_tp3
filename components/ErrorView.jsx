import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ErrorView({ message = "Ocurrió un error", children }) {
  return (
    <View style={styles.center}>
      <Text style={styles.text}>{message}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { marginTop: 20, justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
  text: { textAlign: "center", color: "#ff5555" },
});


