import React, { useEffect, useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Loading from "../components/Loading";
import ErrorView from "../components/ErrorView";
import MovieCard from "../components/MovieCard";

export default function Peliculas() {
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams();

  // Toma el ID desde Home via params; usa 122 por defecto
  const movieId = String(idParam || "122");
  const [pelicula, setPelicula] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_API_KEY}`,
      },
      signal: controller.signal,
    };

    async function fetchMovie() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?language=es-ES`,
          options
        );
        const data = await res.json();
        if (!res.ok || data.success === false || data.status_code) {
          throw new Error(data.status_message || "No se encontró la película");
        }
        setPelicula(data);
      } catch (e) {
        setPelicula(null);
        setError(e.message || "No se pudo cargar la película");
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
    return () => controller.abort();
  }, [movieId]);

  return (
    <View style={styles.container}>
      <Button title="Volver al Home" onPress={() => router.push("/")} />

      {loading && <Loading text="Cargando película..." />}

      {!loading && error !== "" && <ErrorView message={error} />}

      {!loading && pelicula && (
        <MovieCard movie={pelicula} onPress={() => router.push(`/detalle/${pelicula.id}`)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },
});

