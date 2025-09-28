import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Loading from "../../components/Loading";
import ErrorView from "../../components/ErrorView";

export default function Detalle() {
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
          throw new Error(data.status_message || "No se pudo cargar la información");
        }
        setPelicula(data);
      } catch (e) {
        setPelicula(null);
        setError(e.message || "No se pudo cargar la información");
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
    return () => controller.abort();
  }, [id]);

  if (loading) return <Loading text="Cargando detalles..." />;
  if (!pelicula) return <ErrorView message={error || "No se pudo cargar la información de la película."} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{pelicula.title}</Text>
      <Image source={{ uri: `https://image.tmdb.org/t/p/w500${pelicula.poster_path}` }} style={styles.poster} />
      {!!pelicula.tagline && <Text style={styles.tagline}>{pelicula.tagline}</Text>}
      {!!pelicula.overview && <Text style={styles.overview}>{pelicula.overview}</Text>}
      <View style={styles.details}>
        <Text>Estreno: {pelicula.release_date}</Text>
        <Text>Rating: {pelicula.vote_average} ({pelicula.vote_count} votos)</Text>
        <Text>Duración: {pelicula.runtime} min</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  poster: { width: 300, height: 450, borderRadius: 10, marginBottom: 20 },
  tagline: { fontStyle: "italic", fontSize: 16, marginBottom: 10, textAlign: "center" },
  overview: { fontSize: 16, textAlign: "justify", marginBottom: 20 },
  details: { marginTop: 10, marginBottom: 20, alignItems: "flex-start" },
});

