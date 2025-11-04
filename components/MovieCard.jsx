import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function MovieCard({ movie, onPress }) {
  if (!movie) return null;

  const remotePoster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;
  const localPoster = movie.posterPath
    ? movie.posterPath.startsWith("http")
      ? movie.posterPath
      : `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : null;
  const posterUri = localPoster || remotePoster;
  const voteAverage =
    movie.voteAverage ??
    movie.vote_average ??
    (Number.isFinite(Number(movie.rating)) ? Number(movie.rating) / 10 : 0);
  const displayVote = Number.isFinite(Number(voteAverage))
    ? Number(voteAverage).toFixed(1)
    : "0.0";
  const releaseLabel =
    movie.releaseDate || movie.release_date || (movie.year ? `${movie.year}` : "");
  const runtimeLabel =
    Number.isFinite(Number(movie.runtime)) && Number(movie.runtime) > 0
      ? `${movie.runtime} min`
      : "";
  const votesLabel =
    Number.isFinite(Number(movie.voteCount ?? movie.vote_count)) &&
    Number(movie.voteCount ?? movie.vote_count) > 0
      ? `${movie.voteCount ?? movie.vote_count} votos`
      : "";

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
          {movie.title || movie.name || "Sin titulo"}
        </Text>
        {movie.overview ? (
          <Text style={styles.overview} numberOfLines={3}>
            {movie.overview}
          </Text>
        ) : null}
        {movie.genre ? (
          <Text style={styles.genre} numberOfLines={1}>
            {movie.genre}
          </Text>
        ) : null}
        <View style={styles.metaRow}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{displayVote}</Text>
          </View>
          {releaseLabel ? <Text style={styles.metaText}>{releaseLabel}</Text> : null}
          {runtimeLabel ? <Text style={styles.metaText}>{runtimeLabel}</Text> : null}
          {votesLabel ? <Text style={styles.metaText}>{votesLabel}</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#181818",
    borderRadius: 18,
    overflow: "hidden",
    maxWidth: 340,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  poster: {
    width: "100%",
    aspectRatio: 2 / 3,
  },
  posterFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2f2f2f",
  },
  posterFallbackText: {
    color: "#777",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  info: {
    padding: 18,
    gap: 10,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  overview: {
    color: "#b3b3b3",
    fontSize: 14,
    lineHeight: 20,
  },
  genre: {
    color: "#e5e5e5",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pill: {
    backgroundColor: "#e50914",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  pillText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  metaText: {
    color: "#999",
    fontSize: 13,
  },
});

