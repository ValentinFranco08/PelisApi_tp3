import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Loading from "../../components/Loading";
import ErrorView from "../../components/ErrorView";

export default function Detalle() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [pelicula, setPelicula] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_API_KEY}`,
      },
      signal: controller.signal,
    };

    async function fetchDetails() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=es-ES`, options);
        const data = await res.json();
        if (!res.ok || data.success === false || data.status_code) {
          throw new Error(data.status_message || "No se pudo cargar la informacion");
        }
        setPelicula(data);
      } catch (e) {
        setPelicula(null);
        setError(e.message || "No se pudo cargar la informacion");
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
    return () => controller.abort();
  }, [id]);

  // Nota: la pantalla de detalle ahora solo muestra información de la película.
  // Las acciones de opinar/guardar se realizan en la pantalla 'Peliculas'.

  if (loading) return <Loading text="Cargando detalles..." />;
  if (!pelicula) return <ErrorView message={error || "No se pudo cargar la informacion de la pelicula."} />;

  const posterUri = pelicula.poster_path
    ? `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`
    : null;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{pelicula.title}</Text>
      {posterUri && <Image source={{ uri: posterUri }} style={styles.poster} />}
      {!!pelicula.tagline && <Text style={styles.tagline}>{pelicula.tagline}</Text>}
      {!!pelicula.overview && <Text style={styles.overview}>{pelicula.overview}</Text>}
      <View style={styles.details}>
        <Text style={styles.detailText}>Estreno: {pelicula.release_date}</Text>
        <Text style={styles.detailText}>
          Rating: {pelicula.vote_average} ({pelicula.vote_count} votos)
        </Text>
        <Text style={styles.detailText}>Duracion: {pelicula.runtime} min</Text>
        {!!pelicula.genres && pelicula.genres.length > 0 && (
          <Text style={styles.detailText}>
            Generos: {pelicula.genres.map((genre) => genre.name).join(", ")}
          </Text>
        )}
      </View>
      {/* No actions here: detalle solo muestra información pública de la película */}
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
    alignItems: "center",
    gap: 18,
  },
  backLink: {
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
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  poster: {
    width: 320,
    height: 480,
    borderRadius: 20,
  },
  tagline: {
    fontStyle: "italic",
    fontSize: 16,
    color: "#e5e5e5",
    textAlign: "center",
  },
  overview: {
    color: "#c5c5c5",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "justify",
  },
  details: {
    alignSelf: "stretch",
    backgroundColor: "#141414",
    borderRadius: 18,
    padding: 18,
    gap: 8,
  },
  detailText: {
    color: "#fff",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#e50914",
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 42,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
