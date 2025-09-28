import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* Pantalla principal (Home) sin botón atrás */}
      <Stack.Screen
        name="index"
        options={{
          title: "Inicio",
          headerShown: true,
          headerLeft: () => null, // Esto quita el botón atrás en Home
        }}
      />

      {/* Pantalla de Películas */}
      <Stack.Screen
        name="peliculas"
        options={{
          title: "Películas",
        }}
      />

      {/* Pantalla de Detalle con ID dinámico */}
      <Stack.Screen
        name="detalle/[id]"
        options={{
          title: "Detalle",
        }}
      />
    </Stack>
  );
}
