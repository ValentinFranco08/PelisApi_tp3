import React, { useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Loading from "../../components/Loading";
import ErrorView from "../../components/ErrorView";
import MovieForm from "../../components/MovieForm";
import { useMovieById } from "../../hooks/useMovies";
import { updateMovie, removeMovie } from "../../db/movies";
import AppModal from "../../components/AppModal";

export default function EditarRegistro() {
  const router = useRouter();
  const { id: rawId } = useLocalSearchParams();
  const { movie, loading, error } = useMovieById(rawId);
  const movieId = movie?.id ?? (rawId != null ? Number(rawId) : Number.NaN);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState({ visible: false });

  async function handleSubmit(values) {
    if (!Number.isFinite(movieId)) {
      setModal({ visible: true, title: "Ups", message: "Identificador invalido", actions: [{ text: "Ok" }] });
      return;
    }
    try {
      setSaving(true);
      await updateMovie(movieId, values);
      setModal({
        visible: true,
        title: "Actualizada",
        message: "Guardamos los cambios",
        actions: [{ text: "Listo", onPress: () => router.replace("/biblioteca") }],
      });
    } catch (err) {
  setModal({ visible: true, title: "Ups", message: err?.message ?? "No se pudo actualizar", actions: [{ text: "Ok" }] });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!Number.isFinite(movieId)) {
      setModal({ visible: true, title: "Ups", message: "Identificador invalido", actions: [{ text: "Ok" }] });
      return;
    }
    setModal({
      visible: true,
      title: "Eliminar",
      message: "Seguro que queres eliminar esta pelicula?",
      actions: [
        { text: "Cancelar" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await removeMovie(movieId);
            router.replace("/biblioteca");
          },
        },
      ],
    });
  }

  if (loading) return <Loading text="Cargando registro..." />;
  if (!movie) return <ErrorView message={error || "No encontramos la pelicula"} />;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.subtitle}>Actualiza la informacion y guardala para tenerla siempre a mano.</Text>
      </View>
      <MovieForm
        initialValues={movie}
        onSubmit={handleSubmit}
        submitLabel={saving ? "Guardando..." : "Actualizar"}
      />
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </TouchableOpacity>
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
  deleteButton: {
    backgroundColor: "#3a3a3a",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  deleteText: {
    color: "#ff6666",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
