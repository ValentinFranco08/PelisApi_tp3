import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import Loading from "../../components/Loading";
import ErrorView from "../../components/ErrorView";
import LibraryItem from "../../components/LibraryItem";
import { useMovies } from "../../hooks/useMovies";
import AppModal from "../../components/AppModal";

export default function Biblioteca() {
  const router = useRouter();
  const { movies, loading, error, refresh, remove } = useMovies();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const [modal, setModal] = useState({ visible: false });

  function handleDelete(movie) {
    setModal({
      visible: true,
      title: "Eliminar",
      message: `Seguro que deseas eliminar "${movie.title}"?`,
      actions: [
        { text: "Cancelar" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => remove(movie.id),
        },
      ],
    });
  }

  function renderItem({ item }) {
    return (
      <LibraryItem
        movie={item}
        onPress={() => router.push(`/biblioteca/${item.id}`)}
        onEdit={() => router.push(`/biblioteca/${item.id}`)}
        onDelete={() => handleDelete(item)}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.brand}>Mi biblioteca</Text>
        <Text style={styles.subtitle}>Tus peliculas favoritas siempre disponibles offline.</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/biblioteca/nuevo")}>
          <Text style={styles.addText}>Agregar nueva</Text>
        </TouchableOpacity>
      </View>
      {loading && <Loading text="Cargando biblioteca..." />}
      {!loading && error && <ErrorView message={error} />}
      {!loading && !error && movies.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Tu lista esta vacia</Text>
          <Text style={styles.emptyText}>Guarda peliculas desde la seccion Explorar o crea una manualmente.</Text>
        </View>
      )}
      {!loading && movies.length > 0 && (
        <FlatList
          data={movies}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
      <AppModal visible={modal.visible} title={modal.title} message={modal.message} actions={modal.actions} onRequestClose={() => setModal({ visible: false })} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0d0d0d",
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 10,
  },
  brand: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#b5b5b5",
    fontSize: 14,
    maxWidth: 320,
  },
  addButton: {
    alignSelf: "flex-start",
    backgroundColor: "#e50914",
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  addText: {
    color: "#fff",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  empty: {
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  emptyText: {
    color: "#b5b5b5",
    fontSize: 14,
    lineHeight: 20,
  },
});
