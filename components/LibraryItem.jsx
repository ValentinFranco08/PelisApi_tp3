import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

export default function LibraryItem({ movie, onPress, onEdit, onDelete }) {
  const posterUri = movie.posterPath
    ? movie.posterPath.startsWith("http")
      ? movie.posterPath
      : `https://image.tmdb.org/t/p/w200${movie.posterPath}`
    : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {posterUri ? (
        <Image source={{ uri: posterUri }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.posterFallback]}>
          <Text style={styles.posterFallbackText}>Sin poster</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        {movie.overview ? (
          <Text style={styles.overview} numberOfLines={2}>
            {movie.overview}
          </Text>
        ) : null}
        {movie.genre ? (
          <Text style={styles.genre} numberOfLines={1}>
            {movie.genre}
          </Text>
        ) : null}
        {movie.userRating > 0 && (
          <View style={styles.userReview}>
            <Text style={styles.userRating}>Tu puntuación: {movie.userRating}/100</Text>
            {movie.review ? (
              <Text style={styles.reviewSnippet} numberOfLines={1}>
                "{movie.review}"
              </Text>
            ) : null}
          </View>
        )}
        <View style={styles.metaRow}>
          {movie.year ? <Text style={styles.meta}>{movie.year}</Text> : null}
          {movie.runtime ? <Text style={styles.meta}>{movie.runtime} min</Text> : null}
          {movie.voteAverage ? <Text style={styles.meta}>{Number(movie.voteAverage).toFixed(1)}/10</Text> : null}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionButton, styles.edit]} onPress={onEdit}>
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.delete]} onPress={onDelete}>
            <Text style={styles.actionText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 16,
    backgroundColor: "#1c1c1c",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 12,
  },
  posterFallback: {
    backgroundColor: "#2f2f2f",
    alignItems: "center",
    justifyContent: "center",
  },
  posterFallbackText: {
    color: "#777",
    fontSize: 12,
    textAlign: "center",
  },
  info: {
    flex: 1,
    gap: 8,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  overview: {
    color: "#b5b5b5",
    fontSize: 13,
    lineHeight: 18,
  },
  genre: {
    color: "#e5e5e5",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  meta: {
    color: "#9c9c9c",
    fontSize: 12,
  },
  userReview: {
    marginTop: 4,
    gap: 4,
  },
  userRating: {
    color: "#e50914",
    fontSize: 12,
    fontWeight: "600",
  },
  reviewSnippet: {
    color: "#b5b5b5",
    fontSize: 12,
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  actionText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  edit: {
    backgroundColor: "#e50914",
  },
  delete: {
    backgroundColor: "#444",
  },
});
