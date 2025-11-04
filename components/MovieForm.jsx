import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const baseValues = {
  tmdbId: "",
  title: "",
  overview: "",
  posterPath: "",
  rating: "",
  genre: "",
  releaseDate: "",
  runtime: "",
  voteAverage: "",
  voteCount: "",
  year: "",
  userRating: "",
  review: "",
  reviewDate: "",
};

export default function MovieForm({ initialValues = {}, onSubmit, submitLabel = "Guardar" }) {
  const [values, setValues] = useState(() => ({ ...baseValues, ...initialValues }));
  const [error, setError] = useState("");

  const ratingValue = useMemo(() => values.rating?.toString() ?? "", [values.rating]);
  const genreValue = useMemo(() => values.genre?.toString() ?? "", [values.genre]);
  const releaseDateValue = useMemo(
    () => values.releaseDate?.toString() ?? "",
    [values.releaseDate]
  );
  const runtimeValue = useMemo(() => values.runtime?.toString() ?? "", [values.runtime]);
  const voteAverageValue = useMemo(
    () => values.voteAverage?.toString() ?? "",
    [values.voteAverage]
  );
  const voteCountValue = useMemo(
    () => values.voteCount?.toString() ?? "",
    [values.voteCount]
  );
  const yearValue = useMemo(() => values.year?.toString() ?? "", [values.year]);
  const userRatingValue = useMemo(() => values.userRating?.toString() ?? "", [values.userRating]);
  const reviewValue = useMemo(() => values.review?.toString() ?? "", [values.review]);
  const reviewDateValue = useMemo(() => values.reviewDate?.toString() ?? "", [values.reviewDate]);

  function handleChange(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit() {
    if (!values.title.trim()) {
      setError("El titulo es obligatorio");
      return;
    }

    const rating = Number(ratingValue);
    const runtime = Number(runtimeValue);
    const voteAverage = Number(voteAverageValue);
    const voteCount = Number(voteCountValue);
    const payload = {
      ...values,
      tmdbId: values.tmdbId?.trim() || null,
      rating: Number.isNaN(rating) ? 0 : Math.max(0, Math.min(100, rating)),
      genre: genreValue.trim(),
      releaseDate: releaseDateValue.trim(),
      runtime: Number.isNaN(runtime) ? 0 : Math.max(0, Math.trunc(runtime)),
      voteAverage: Number.isNaN(voteAverage) ? 0 : voteAverage,
      voteCount: Number.isNaN(voteCount) ? 0 : Math.max(0, Math.trunc(voteCount)),
      year:
        yearValue.trim() !== ""
          ? yearValue.trim()
          : releaseDateValue.trim()
          ? releaseDateValue.trim().slice(0, 4)
          : "",
      userRating: Number.isNaN(Number(userRatingValue)) ? 0 : Math.max(0, Math.min(100, Number(userRatingValue))),
      review: reviewValue?.trim() ?? "",
      reviewDate: reviewDateValue?.trim() ?? null,
    };

    setError("");
    onSubmit?.(payload);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Datos de la pelicula</Text>
      <TextInput
        style={styles.input}
        placeholder="ID de TMDB (opcional)"
        placeholderTextColor="#999"
        value={values.tmdbId ?? ""}
        onChangeText={(text) => handleChange("tmdbId", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Titulo"
        placeholderTextColor="#999"
        value={values.title}
        onChangeText={(text) => handleChange("title", text)}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
        placeholder="Descripcion"
        placeholderTextColor="#999"
        value={values.overview ?? ""}
        onChangeText={(text) => handleChange("overview", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="URL del poster (opcional)"
        placeholderTextColor="#999"
        value={values.posterPath ?? ""}
        onChangeText={(text) => handleChange("posterPath", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Genero(s) (separados por coma)"
        placeholderTextColor="#999"
        value={genreValue}
        onChangeText={(text) => handleChange("genre", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Rating (0 - 100)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={ratingValue}
        onChangeText={(text) => handleChange("rating", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de estreno (YYYY-MM-DD)"
        placeholderTextColor="#999"
        value={releaseDateValue}
        onChangeText={(text) => handleChange("releaseDate", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Año"
        placeholderTextColor="#999"
        value={yearValue}
        onChangeText={(text) => handleChange("year", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Duracion (minutos)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={runtimeValue}
        onChangeText={(text) => handleChange("runtime", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Puntaje promedio (TMDB)"
        placeholderTextColor="#999"
        keyboardType="decimal-pad"
        value={voteAverageValue}
        onChangeText={(text) => handleChange("voteAverage", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Cantidad de votos (TMDB)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={voteCountValue}
        onChangeText={(text) => handleChange("voteCount", text)}
      />
      {/* Campos de reseña personal (color distintivo) */}
      <TextInput
        style={[styles.input, styles.reviewInput]}
        placeholder="Puntaje personal (0-100)"
        placeholderTextColor="#f2dede"
        keyboardType="numeric"
        value={userRatingValue}
        onChangeText={(text) => handleChange("userRating", text)}
      />
      <TextInput
        style={[styles.input, styles.reviewInput, styles.textArea]}
        multiline
        numberOfLines={4}
        placeholder="Tu reseña personal"
        placeholderTextColor="#f2dede"
        value={reviewValue}
        onChangeText={(text) => handleChange("review", text)}
      />
      <TextInput
        style={[styles.input, styles.reviewInput]}
        placeholder="Fecha de la reseña (YYYY-MM-DD)"
        placeholderTextColor="#f2dede"
        value={reviewDateValue}
        onChangeText={(text) => handleChange("reviewDate", text)}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{submitLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    padding: 20,
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  heading: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  input: {
    backgroundColor: "#2b2b2b",
    color: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  reviewInput: {
    backgroundColor: "#3a2b2b",
    borderColor: "#b85a5a",
    borderWidth: 1,
    color: "#fff",
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  error: {
    color: "#ff5555",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#e50914",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textTransform: "uppercase",
  },
});
