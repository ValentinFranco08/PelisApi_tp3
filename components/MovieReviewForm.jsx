import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Slider from '@react-native-community/slider';

export default function MovieReviewForm({ initialValues = {}, onSubmit, submitLabel = "Guardar opinión" }) {
  const [values, setValues] = useState(() => ({
    userRating: initialValues.userRating ?? 0,
    review: initialValues.review ?? "",
  }));

  function handleSubmit() {
    onSubmit?.(values);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Tu opinión</Text>
      
      <View style={styles.ratingSection}>
        <Text style={styles.label}>Puntuación: {values.userRating}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={values.userRating}
          onValueChange={(value) => setValues((prev) => ({ ...prev, userRating: value }))}
          minimumTrackTintColor="#e50914"
          maximumTrackTintColor="#666"
          thumbTintColor="#e50914"
        />
      </View>

      <Text style={styles.label}>Tu reseña</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
        placeholder="Escribe tu opinión sobre la película..."
        placeholderTextColor="#999"
        value={values.review}
        onChangeText={(text) => setValues((prev) => ({ ...prev, review: text }))}
      />

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
  ratingSection: {
    gap: 8,
  },
  label: {
    color: "#9a9a9a",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  slider: {
    height: 40,
  },
  input: {
    backgroundColor: "#2b2b2b",
    color: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
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