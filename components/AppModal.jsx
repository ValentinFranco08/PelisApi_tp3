import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function AppModal({ visible, title, message, actions = [], onRequestClose }) {
  return (
    <Modal visible={!!visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.actions}>
            {actions.map((act, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.button, act.style === "destructive" ? styles.destructive : null]}
                onPress={() => {
                  act.onPress?.();
                  onRequestClose?.();
                }}
              >
                <Text style={styles.buttonText}>{act.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#141414",
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  message: {
    color: "#d0d0d0",
    fontSize: 14,
  },
  actions: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#2b2b2b",
  },
  destructive: {
    backgroundColor: "#6b1b1b",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});