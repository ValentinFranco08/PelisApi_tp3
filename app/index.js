import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  const [inputId, setInputId] = useState("122");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a la App de Películas</Text>

      <TextInput
        style={styles.input}
        value={inputId}
        onChangeText={setInputId}
        keyboardType="number-pad"
        placeholder="ID de película (ej. 122)"
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push({ pathname: "/peliculas", params: { id: inputId || "122" } })}
      >
        <Text style={styles.buttonText}>Ver Película</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push(`/detalle/${inputId || "122"}`)}
      >
        <Text style={styles.buttonText}>Ver Detalle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "70%",
    height: 44,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginVertical: 8,
    width: "70%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

