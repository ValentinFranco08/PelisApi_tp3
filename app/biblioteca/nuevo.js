import React, { useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import MovieForm from "../../components/MovieForm";
import { createMovie } from "../../db/movies";
import AppModal from "../../components/AppModal";

export default function NuevoRegistro() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState({ visible: false });

  async function handleSubmit(values) {
    try {
      setSaving(true);
      await createMovie(values);
      setModal({
        visible: true,
        title: "Listo",
        message: "La pelicula se guardo",
        actions: [
          { text: "Ver biblioteca", onPress: () => router.replace("/biblioteca") },
          { text: "Seguir" },
        ],
      });
    } catch (err) {
      setModal({ visible: true, title: "Ups", message: err?.message ?? "No se pudo crear el registro", actions: [{ text: "Ok" }] });
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nuevo registro</Text>
        <Text style={styles.subtitle}>
          Completa los datos para sumar una pelicula manualmente a tu biblioteca.
        </Text>
      </View>
      <MovieForm onSubmit={handleSubmit} submitLabel={saving ? "Guardando..." : "Guardar"} />
        <AppModal visible={modal.visible} title={modal.title} message={modal.message} actions={modal.actions} onRequestClose={() => setModal({ visible: false })} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0d0d0d",
  },
  content: {
    padding: 24,
    gap: 24,
  },
  header: {
    gap: 12,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  backText: {
    color: "#fff",
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontSize: 12,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    color: "#b5b5b5",
    fontSize: 14,
    lineHeight: 20,
  },
});
