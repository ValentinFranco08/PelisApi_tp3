import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';
import { router } from 'expo-router';
import { createUser } from '../db/auth';
import AppModal from './AppModal';
import { colors } from '../utils/commonStyles';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [modal, setModal] = useState({ visible: false });

  const handleSubmit = async () => {
    if (!formData.username || !formData.password || !formData.name) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      await createUser({
        ...formData,
        role: 'user', // Rol por defecto
      });

      setError('');
      setFormData({
        username: '',
        password: '',
        name: '',
      });
      setModal({
        visible: true,
        title: 'Cuenta creada',
        message: 'Ya podés iniciar sesión con tus credenciales.',
        actions: [
          {
            text: 'Ir a iniciar sesión',
            onPress: () => router.replace('/login'),
          },
        ],
      });
    } catch (err) {
      if (err.message?.includes('UNIQUE')) {
        setError('El nombre de usuario ya existe');
      } else {
        setError('Error al crear la cuenta');
        console.error('Error al registrar:', err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        placeholderTextColor={colors.textSecondary}
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor={colors.textSecondary}
        value={formData.username}
        onChangeText={(text) => setFormData({ ...formData, username: text })}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={colors.textSecondary}
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <Link href="/login" asChild>
        <TouchableOpacity>
          <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </Link>

      <AppModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        actions={modal.actions}
        onRequestClose={() => setModal((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
  error: {
    color: colors.error,
    marginBottom: 10,
  },
});
