import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

const HERO = {
  uri: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1400&q=80",
};

export default function Home() {
  const router = useRouter();
  const [inputId, setInputId] = useState("122");
  const normalizedId = useMemo(() => inputId.trim() || "122", [inputId]);

  function goToMovie() {
    router.push({ pathname: "/peliculas", params: { id: normalizedId } });
  }

  function goToDetail() {
    router.push(`/detalle/${normalizedId}`);
  }

  function goToLibrary() {
    router.push("/biblioteca");
  }

  return (
    <ImageBackground source={HERO} style={styles.background} blurRadius={6}>
      <View style={styles.overlay}>
        <Text style={styles.brand}>PELISAPI+</Text>
        <Text style={styles.title}>Encuentra tu proxima pelicula</Text>
        <Text style={styles.subtitle}>
          Buscala por ID de TMDB o guardala en tu biblioteca personal.
        </Text>

        <View style={styles.searchCard}>
          <Text style={styles.label}>ID de pelicula</Text>
          <TextInput
            style={styles.input}
            value={inputId}
            onChangeText={setInputId}
            keyboardType="number-pad"
            placeholder="Ej: 122"
            placeholderTextColor="#666"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.primary]} onPress={goToMovie}>
              <Text style={styles.buttonText}>Ver pelicula</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.secondary]} onPress={goToDetail}>
              <Text style={styles.buttonText}>Ver detalle</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.libraryButton} onPress={goToLibrary}>
          <Text style={styles.libraryText}>Mi biblioteca</Text>
        </TouchableOpacity>
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
    gap: 24,
  },
  brand: {
    color: "#e50914",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 4,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    color: "#c8c8c8",
    fontSize: 16,
    lineHeight: 22,
    maxWidth: 320,
  },
  searchCard: {
    backgroundColor: "rgba(20, 20, 20, 0.96)",
    borderRadius: 20,
    padding: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    maxWidth: 360,
  },
  label: {
    color: "#9a9a9a",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  primary: {
    backgroundColor: "#e50914",
  },
  secondary: {
    backgroundColor: "#3d3d3d",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: 14,
  },
  libraryButton: {
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    borderColor: "#e50914",
    borderWidth: 2,
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  libraryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
