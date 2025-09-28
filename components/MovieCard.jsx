import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function MovieCard({ movie, onPress }) {
  if (!movie) return null;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={styles.poster}
      />
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.overview}>
        {movie.overview ? `${movie.overview.substring(0, 150)}...` : "Sin descripción"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 20, alignItems: "center" },
  poster: { width: 300, height: 450, borderRadius: 10, marginBottom: 15 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  overview: { fontSize: 14, textAlign: "justify", color: "#555" },
});

