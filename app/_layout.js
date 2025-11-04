import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { initMoviesTable } from "../db/movies";

export default function RootLayout() {
  useEffect(() => {
    initMoviesTable().catch((err) => {
      console.warn("No se pudo inicializar la base local", err);
    });
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#141414" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "700", letterSpacing: 0.5 },
          contentStyle: { backgroundColor: "#0d0d0d" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "Inicio", headerShown: true, headerLeft: () => null }}
        />
        <Stack.Screen name="peliculas" options={{ title: "Explorar" }} />
        <Stack.Screen name="detalle/[id]" options={{ title: "Detalle" }} />
        <Stack.Screen name="biblioteca/index" options={{ title: "Mi biblioteca" }} />
        <Stack.Screen name="biblioteca/nuevo" options={{ title: "Nuevo registro" }} />
        <Stack.Screen name="biblioteca/[id]" options={{ title: "Editar registro" }} />
      </Stack>
    </>
  );
}
