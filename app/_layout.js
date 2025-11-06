import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import { initMoviesTable } from '../db/movies';
import { initDatabase } from '../db/auth';
import { AuthProvider, useAuth } from '../useAuth';
import LogoutButton from '../components/LogoutButton';

function ProtectedLayout() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return;
    }

    const publicRoutes = ['/login', '/register'];
    
    // Si no hay usuario, redireccionar a login excepto en rutas públicas
    if (!user && !publicRoutes.includes(pathname)) {
      router.replace('/login');
      return;
    }

    // Si hay usuario y está en una ruta pública, redireccionar según su rol
    if (user && publicRoutes.includes(pathname)) {
      router.replace(user.role === 'admin' ? '/admin/users' : '/');
      return;
    }

    // Si el usuario no es admin y trata de acceder al panel de administración
    if (user?.role !== 'admin' && pathname.startsWith('/admin')) {
      router.replace('/');
      return;
    }

    // Si el usuario está en la raíz, redirigir según su estado de autenticación
    if (pathname === '/' || pathname === '/index') {
      if (!user) {
        router.replace('/login');
      } else {
        router.replace(user.role === 'admin' ? '/admin/users' : '/');
      }
    }
  }, [user, loading, pathname]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#141414' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700', letterSpacing: 0.5 },
          contentStyle: { backgroundColor: '#0d0d0d' },
          headerRight: pathname !== '/login' ? () => <LogoutButton /> : undefined,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: 'Inicio', headerShown: true, headerLeft: () => null }}
        />
        <Stack.Screen name="login" options={{ title: 'Iniciar sesion', headerShown: false }} />
        <Stack.Screen name="register" options={{ title: 'Crear cuenta', headerShown: false }} />
        <Stack.Screen name="peliculas" options={{ title: 'Explorar' }} />
        <Stack.Screen name="detalle/[id]" options={{ title: 'Detalle' }} />
        <Stack.Screen name="biblioteca/index" options={{ title: 'Mi biblioteca' }} />
        <Stack.Screen name="biblioteca/nuevo" options={{ title: 'Nuevo registro' }} />
        <Stack.Screen name="biblioteca/[id]" options={{ title: 'Editar registro' }} />
        <Stack.Screen name="admin/users/index" options={{ title: 'Gestion de Usuarios' }} />
        <Stack.Screen name="admin/users/nuevo" options={{ title: 'Nuevo Usuario' }} />
        <Stack.Screen name="admin/users/[id]" options={{ title: 'Editar Usuario' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    initMoviesTable().catch((err) => {
      console.warn('No se pudo inicializar la base local', err);
    });
    initDatabase().catch((err) => {
      console.warn('No se pudo inicializar la base de autenticacion', err);
    });
  }, []);

  return (
    <AuthProvider>
      <ProtectedLayout />
    </AuthProvider>
  );
}
